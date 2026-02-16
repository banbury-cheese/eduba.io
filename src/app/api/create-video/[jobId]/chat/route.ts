import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { NextResponse } from "next/server";
import {
  addChatTurn,
  addRevision,
  getSelectedRevision,
  getVideoJob,
} from "@/lib/videoJobs";
import { runPython } from "@/lib/pythonRunner";
import {
  LegacyVideoScriptError,
  normalizeVideoScript,
} from "@/lib/videoScriptUtils";
import type { VideoScript } from "@/lib/videoTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ jobId: string }>;
}

function parseMultiline(value: string | null) {
  if (!value) return [];
  return value
    .split(/\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request, { params }: RouteProps) {
  const { jobId } = await params;
  let job = await getVideoJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Video job not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const instructions = formData.get("instructions")?.toString().trim() ?? "";
  const context = formData.get("context")?.toString().trim() ?? "";
  const customPrompt =
    formData.get("customPrompt")?.toString().trim() ?? job.brief.customPrompt ?? "";
  const website = formData.get("website")?.toString().trim() ?? "";
  const links = parseMultiline(formData.get("links")?.toString() ?? "");
  const autoLinks = formData
    .getAll("autoLink")
    .map((item) => item.toString().trim())
    .filter(Boolean);
  const include = formData
    .getAll("include")
    .map((item) => item.toString().trim())
    .filter(Boolean);
  const exclude = parseMultiline(formData.get("exclude")?.toString() ?? "");
  const documents = formData
    .getAll("documents")
    .filter((file): file is File => file instanceof File);

  if (!instructions) {
    return NextResponse.json(
      { error: "Instructions are required." },
      { status: 400 }
    );
  }

  const selectedRevision = getSelectedRevision(job);
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "eduba-video-chat-"));
  const docPaths: string[] = [];
  const scriptPath = path.join(tmpDir, "current-script.json");
  const outPath = path.join(tmpDir, "edited-script.json");

  try {
    const normalizedCurrent = normalizeVideoScript(selectedRevision.script);
    await fs.writeFile(scriptPath, JSON.stringify(normalizedCurrent, null, 2), "utf8");

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
      "edit",
      "--script-path",
      scriptPath,
      "--instructions",
      instructions,
      "--out",
      outPath,
    ];

    if (context) {
      args.push("--context", context);
    }
    if (customPrompt) {
      args.push("--custom-prompt", customPrompt);
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

    job = await addChatTurn(job, "user", instructions);

    const result = await runPython(args);
    if (result.exitCode !== 0) {
      return NextResponse.json(
        {
          error: "Video edit failed",
          details: result.stderr || result.stdout,
        },
        { status: 500 }
      );
    }

    const rawEdited = await fs.readFile(outPath, "utf8");
    const editedScript = normalizeVideoScript(JSON.parse(rawEdited) as VideoScript);

    const noteText =
      instructions.length > 180
        ? `${instructions.slice(0, 177)}...`
        : instructions;

    job = await addRevision(job, editedScript, noteText);
    const newRevision = getSelectedRevision(job);
    job = await addChatTurn(
      job,
      "assistant",
      `Created revision v${newRevision.version}.`,
      newRevision.id
    );

    return NextResponse.json({
      job,
      selectedRevision: newRevision,
    });
  } catch (error) {
    if (error instanceof LegacyVideoScriptError) {
      return NextResponse.json(
        {
          error: "Legacy script schema",
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
