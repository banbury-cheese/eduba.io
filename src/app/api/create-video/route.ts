import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { NextResponse } from "next/server";
import { createVideoJob } from "@/lib/videoJobs";
import { runPython } from "@/lib/pythonRunner";
import {
  LegacyVideoScriptError,
  normalizeVideoScript,
} from "@/lib/videoScriptUtils";
import type { VideoBrief, VideoScript } from "@/lib/videoTypes";
import { normalizeAspectRatio } from "@/video/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseMultiline(value: string | null) {
  if (!value) return [];
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const company = formData.get("company")?.toString().trim() ?? "";
  const sector = formData.get("sector")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const context = formData.get("context")?.toString().trim() ?? "";
  const customPrompt = formData.get("customPrompt")?.toString().trim() ?? "";
  const website = formData.get("website")?.toString().trim() ?? "";
  const template = formData.get("template")?.toString().trim() || "eduba-core-v1";
  const aspectRatio = normalizeAspectRatio(
    formData.get("aspectRatio")?.toString().trim() || "16:9"
  );
  const durationSec = Number(formData.get("durationSec")?.toString() || "45");
  const voiceoverEnabled = formData.get("voiceoverEnabled")?.toString() === "on";
  const links = parseMultiline(formData.get("links")?.toString() || "");
  const autoLinks = formData
    .getAll("autoLink")
    .map((item) => item.toString().trim())
    .filter(Boolean);
  const include = formData
    .getAll("include")
    .map((item) => item.toString().trim())
    .filter(Boolean);
  const exclude = parseMultiline(formData.get("exclude")?.toString() || "");

  const documents = formData
    .getAll("documents")
    .filter((file): file is File => file instanceof File);

  if (!company || !sector) {
    return NextResponse.json(
      { error: "Company and sector are required." },
      { status: 400 }
    );
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "eduba-video-create-"));
  const docPaths: string[] = [];
  const scriptPath = path.join(tmpDir, "video-script.json");

  try {
    for (const file of documents) {
      const bytes = Buffer.from(await file.arrayBuffer());
      const safeName = file.name || `document-${docPaths.length + 1}`;
      const filePath = path.join(tmpDir, safeName);
      await fs.writeFile(filePath, bytes);
      docPaths.push(filePath);
    }

    const args = [
      "-m",
      "agent.video_cli",
      "generate",
      "--company",
      company,
      "--sector",
      sector,
      "--context",
      context,
      "--custom-prompt",
      customPrompt,
      "--template",
      template,
      "--aspect-ratio",
      aspectRatio,
      "--duration",
      String(Number.isFinite(durationSec) ? durationSec : 45),
      "--out",
      scriptPath,
    ];

    if (slug) {
      args.push("--slug", slug);
    }
    if (website) {
      args.push("--website", website);
    }

    include.forEach((category) => args.push("--include", category));
    exclude.forEach((pattern) => args.push("--exclude", pattern));
    docPaths.forEach((docPath) => args.push("--doc", docPath));
    [...new Set([...links, ...autoLinks])].forEach((link) =>
      args.push("--link", link)
    );

    const result = await runPython(args);

    if (result.exitCode !== 0) {
      return NextResponse.json(
        {
          error: "Video script generation failed",
          details: result.stderr || result.stdout,
        },
        { status: 500 }
      );
    }

    const rawScript = await fs.readFile(scriptPath, "utf8");
    const script = normalizeVideoScript(JSON.parse(rawScript) as VideoScript);
    script.meta.voiceoverEnabled = voiceoverEnabled;
    script.meta.aspectRatio = aspectRatio;

    const brief: VideoBrief = {
      company,
      sector,
      slug: script.meta.slug,
      context,
      customPrompt,
      links: [...new Set([...links, ...autoLinks])],
      website,
      include,
      exclude,
      template,
      aspectRatio,
      durationSec: Number.isFinite(durationSec) ? durationSec : 45,
    };

    const job = await createVideoJob(brief, script);

    return NextResponse.json({
      jobId: job.id,
      editUrl: `/create-video/${job.id}/edit`,
      statusUrl: `/api/create-video/${job.id}`,
      script,
    });
  } catch (error) {
    if (error instanceof LegacyVideoScriptError) {
      return NextResponse.json(
        {
          error: "Legacy script schema returned by agent",
          details: error.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
