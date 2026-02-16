#!/usr/bin/env node

import { spawn } from "child_process";
import { createHash } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const VIDEO_DIMENSIONS = {
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
};

const MIN_SCENE_SEC = Number(process.env.VIDEO_MIN_SCENE_SEC || "4");
const VO_BUFFER_SEC = Number(process.env.VIDEO_VOICEOVER_BUFFER_SEC || "0.45");
const VO_EDGE_FADE_SEC = Number(process.env.VIDEO_VOICEOVER_EDGE_FADE_SEC || "0.09");

function normalizeAspectRatio(value) {
  if (value === "16:9" || value === "1:1" || value === "9:16") {
    return value;
  }
  return "16:9";
}

function toCompositionId(aspectRatio) {
  return `EdubaSectorVideo-${aspectRatio.replace(":", "-")}`;
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key?.startsWith("--") && value) {
      parsed[key.slice(2)] = value;
    }
  }
  return parsed;
}

function sanitizeId(value) {
  return (value || "").replace(/[^a-zA-Z0-9_-]/g, "");
}

function runCommand(bin, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: process.cwd(),
      env: process.env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(stderr || stdout || `${bin} failed with code ${code}`));
    });
  });
}

async function getAudioDurationSec(audioPath) {
  const { stdout } = await runCommand("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    audioPath,
  ]);
  const parsed = Number.parseFloat(stdout.trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

async function synthesizeSceneVoiceover({
  text,
  outputPath,
  voiceId,
  modelId,
  apiKey,
}) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: Number(process.env.ELEVENLABS_STABILITY || "0.42"),
          similarity_boost: Number(process.env.ELEVENLABS_SIMILARITY_BOOST || "0.78"),
          style: Number(process.env.ELEVENLABS_STYLE || "0.34"),
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs request failed (${response.status}): ${err}`);
  }

  const audio = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, audio);
}

async function ensureVoiceovers(script, outputDir) {
  const voiceoverEnabled = Boolean(script?.meta?.voiceoverEnabled);
  if (!voiceoverEnabled) {
    return [];
  }

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "ELEVENLABS_API_KEY is required when voiceoverEnabled is true."
    );
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || "EXAVITQu4vr4xnSDxMaL";
  const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2";

  const voiceoverDir = path.join(outputDir, "voiceovers");
  await fs.mkdir(voiceoverDir, { recursive: true });

  const scenes = Array.isArray(script?.scenes) ? script.scenes : [];
  const outputs = [];

  for (let index = 0; index < scenes.length; index += 1) {
    const scene = scenes[index] || {};
    const text = String(scene.voiceoverScript || "").trim();
    if (!text) {
      outputs.push(null);
      continue;
    }

    const key = createHash("sha1")
      .update(`${voiceId}:${modelId}:${text}`)
      .digest("hex")
      .slice(0, 16);

    const fileName = `voiceover-${key}.mp3`;
    const filePath = path.join(voiceoverDir, fileName);

    try {
      await fs.access(filePath);
    } catch {
      await synthesizeSceneVoiceover({
        text,
        outputPath: filePath,
        voiceId,
        modelId,
        apiKey,
      });
    }

    const durationSec = await getAudioDurationSec(filePath);
    outputs.push({ path: filePath, durationSec, text });
  }

  return outputs;
}

function rebalanceDurationsForVoiceover(script, sceneAudio) {
  if (!Array.isArray(script?.scenes)) {
    return [];
  }

  const report = [];
  let total = 0;

  script.scenes.forEach((scene, index) => {
    const current = Number(scene?.durationSec || 0);
    const voice = sceneAudio[index];
    const voiceDuration = voice?.durationSec || 0;
    const minimum = voiceDuration > 0 ? voiceDuration + VO_BUFFER_SEC : MIN_SCENE_SEC;
    const adjusted = Number(Math.max(current, minimum, MIN_SCENE_SEC).toFixed(2));

    scene.durationSec = adjusted;
    total += adjusted;

    report.push({
      sceneId: String(scene?.id || `scene-${index + 1}`),
      previousSec: current,
      adjustedSec: adjusted,
      voiceoverSec: Number(voiceDuration.toFixed(2)),
    });
  });

  if (script?.meta) {
    script.meta.durationSec = Number(total.toFixed(2));
  }

  return report;
}

async function buildVoiceoverTrack({ sceneAudio, script, outputPath }) {
  const scenes = Array.isArray(script?.scenes) ? script.scenes : [];
  const available = [];

  let offsetSec = 0;
  for (let index = 0; index < scenes.length; index += 1) {
    const scene = scenes[index] || {};
    const voice = sceneAudio[index];
    const sceneDuration = Number(scene.durationSec || 0);

    if (voice?.path && sceneDuration > 0) {
      available.push({
        audioPath: voice.path,
        audioDuration: Number(voice.durationSec || 0),
        sceneDuration,
        offsetMs: Math.round(offsetSec * 1000),
      });
    }

    offsetSec += Math.max(sceneDuration, 0);
  }

  if (!available.length) {
    return null;
  }

  const ffmpegArgs = ["-y"];
  available.forEach((entry) => {
    ffmpegArgs.push("-i", entry.audioPath);
  });

  const filters = available.map((entry, index) => {
    const clipDuration = Math.max(entry.sceneDuration, MIN_SCENE_SEC).toFixed(3);
    const audioDuration = Math.max(
      Math.min(entry.audioDuration, entry.sceneDuration),
      0.04
    );
    const fadeIn = Math.min(0.06, audioDuration / 3).toFixed(3);
    const fadeOut = Math.min(VO_EDGE_FADE_SEC, audioDuration / 3).toFixed(3);
    const fadeOutStart = Math.max(audioDuration - Number(fadeOut), 0).toFixed(3);

    return `[${index}:a]atrim=0:${clipDuration},afade=t=in:st=0:d=${fadeIn},afade=t=out:st=${fadeOutStart}:d=${fadeOut},apad=pad_dur=${clipDuration},atrim=duration=${clipDuration},adelay=${entry.offsetMs}|${entry.offsetMs}[a${index}]`;
  });

  const mixInputs = available.map((_, index) => `[a${index}]`).join("");
  const totalDuration = Math.max(Number(script?.meta?.durationSec || 0), 1).toFixed(3);

  filters.push(
    `${mixInputs}amix=inputs=${available.length}:normalize=0,atrim=duration=${totalDuration}[mixed]`
  );

  ffmpegArgs.push(
    "-filter_complex",
    filters.join(";"),
    "-map",
    "[mixed]",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    outputPath
  );

  await runCommand("ffmpeg", ffmpegArgs);
  return outputPath;
}

async function muxVoiceover({ videoInput, voiceoverInput, outputPath }) {
  await runCommand("ffmpeg", [
    "-y",
    "-i",
    videoInput,
    "-i",
    voiceoverInput,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-shortest",
    outputPath,
  ]);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || !args.outputDir) {
    throw new Error("Missing required args: --input and --outputDir");
  }

  const raw = await fs.readFile(args.input, "utf8");
  const payload = JSON.parse(raw);
  const script = structuredClone(payload.script || {});
  const jobId = payload.jobId;
  const revisionId = payload.revisionId;

  const aspectRatio = normalizeAspectRatio(script?.meta?.aspectRatio);
  if (!VIDEO_DIMENSIONS[aspectRatio]) {
    throw new Error(`Unsupported aspect ratio: ${aspectRatio}`);
  }

  await fs.mkdir(args.outputDir, { recursive: true });

  const safeJob = sanitizeId(jobId);
  const safeRevision = sanitizeId(revisionId).slice(0, 12) || "rev";
  const baseName = `${safeJob}-${safeRevision}`;
  const silentVideoPath = path.join(args.outputDir, `${baseName}.silent.mp4`);
  const videoPath = path.join(args.outputDir, `${baseName}.mp4`);
  const posterPath = path.join(args.outputDir, `${baseName}.jpg`);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "eduba-video-voice-"));

  try {
    const sceneAudio = await ensureVoiceovers(script, args.outputDir);
    const timingReport = rebalanceDurationsForVoiceover(script, sceneAudio);

    const entryPoint = path.join(process.cwd(), "src/video/entry.ts");
    const serveUrl = await bundle({ entryPoint });
    const composition = await selectComposition({
      serveUrl,
      id: toCompositionId(aspectRatio),
      inputProps: { script },
    });

    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: silentVideoPath,
      inputProps: { script },
      overwrite: true,
      muted: true,
    });

    const voiceTrackPath = path.join(tempDir, `${baseName}.m4a`);
    const mixedTrackPath = await buildVoiceoverTrack({
      sceneAudio,
      script,
      outputPath: voiceTrackPath,
    });

    if (mixedTrackPath) {
      await muxVoiceover({
        videoInput: silentVideoPath,
        voiceoverInput: mixedTrackPath,
        outputPath: videoPath,
      });
    } else {
      await fs.copyFile(silentVideoPath, videoPath);
    }

    await renderStill({
      composition,
      serveUrl,
      inputProps: { script },
      frame: Math.max(0, Math.floor(composition.durationInFrames / 2)),
      imageFormat: "jpeg",
      output: posterPath,
      overwrite: true,
    });

    const relativeBase = `/generated-videos/${baseName}`;
    process.stdout.write(
      JSON.stringify({
        videoUrl: `${relativeBase}.mp4`,
        posterUrl: `${relativeBase}.jpg`,
        adjustedScript: script,
        timingReport,
      })
    );
  } finally {
    await fs.rm(silentVideoPath, { force: true });
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(message);
  process.exit(1);
});
