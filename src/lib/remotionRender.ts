import { spawn } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { VideoScript } from "@/lib/videoTypes";

function collect(stream: NodeJS.ReadableStream) {
  let output = "";
  stream.on("data", (chunk) => {
    output += chunk.toString();
  });
  return () => output;
}

function extractJsonPayload(stdout: string, stderr: string) {
  const candidates = [...stdout.split("\n"), ...stderr.split("\n")]
    .map((line) => line.trim())
    .filter((line) => line.startsWith("{") && line.endsWith("}"));

  const last = candidates[candidates.length - 1];
  if (!last) {
    throw new Error(stderr || stdout || "Render output did not return JSON.");
  }
  return last;
}

export async function renderVideoScript({
  jobId,
  revisionId,
  script,
}: {
  jobId: string;
  revisionId: string;
  script: VideoScript;
}) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "eduba-video-render-"));
  const inputPath = path.join(tmpDir, "render-input.json");

  try {
    await fs.writeFile(
      inputPath,
      JSON.stringify({ jobId, revisionId, script }),
      "utf8"
    );

    const renderScript = path.join(process.cwd(), "scripts", "render-video.mjs");
    const outputDir = path.join(process.cwd(), "public", "generated-videos");

    const child = spawn(
      process.execPath,
      [renderScript, "--input", inputPath, "--outputDir", outputDir],
      {
        cwd: process.cwd(),
        env: process.env,
      }
    );

    const getStdout = collect(child.stdout);
    const getStderr = collect(child.stderr);

    const exitCode: number = await new Promise((resolve) => {
      child.on("close", resolve);
    });

    const stdout = getStdout();
    const stderr = getStderr();

    if (exitCode !== 0) {
      throw new Error(stderr || stdout || "Video render failed");
    }

    const payload = JSON.parse(extractJsonPayload(stdout, stderr)) as {
      videoUrl: string;
      posterUrl: string;
      adjustedScript?: VideoScript;
      timingReport?: Array<{
        sceneId: string;
        previousSec: number;
        adjustedSec: number;
        voiceoverSec: number;
      }>;
    };

    return payload;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
