import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function collectOutput(stream: NodeJS.ReadableStream) {
  let data = "";
  stream.on("data", (chunk) => {
    data += chunk.toString();
  });
  return () => data;
}

function parseLinks(raw: string | null) {
  if (!raw) return [];
  return raw
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const company = formData.get("company")?.toString().trim();
  const sector = formData.get("sector")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const context = formData.get("context")?.toString().trim() || "";
  const links = parseLinks(formData.get("links")?.toString() || "");
  const documents = formData.getAll("documents").filter((file) => file instanceof File) as File[];

  if (!company || !sector) {
    return NextResponse.json(
      { error: "Company and sector are required." },
      { status: 400 }
    );
  }

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "eduba-create-"));
  const docPaths: string[] = [];

  try {
    for (const file of documents) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = file.name || `document-${docPaths.length + 1}`;
      const filePath = path.join(tmpDir, filename);
      await fs.writeFile(filePath, buffer);
      docPaths.push(filePath);
    }

    const args = [
      "-m",
      "agent.cli",
      "--company",
      company,
      "--sector",
      sector,
      "--context",
      context,
    ];

    if (slug) {
      args.push("--slug", slug);
    }

    docPaths.forEach((doc) => args.push("--doc", doc));
    links.forEach((link) => args.push("--link", link));

    const pythonBin = process.env.PYTHON_BIN || "python3";
    const child = spawn(pythonBin, args, {
      cwd: process.cwd(),
      env: process.env,
    });

    const getStdout = collectOutput(child.stdout);
    const getStderr = collectOutput(child.stderr);

    const exitCode: number = await new Promise((resolve) => {
      child.on("close", resolve);
    });

    const stdout = getStdout();
    const stderr = getStderr();

    if (exitCode !== 0) {
      return NextResponse.json(
        { error: "Agent run failed", details: stderr || stdout },
        { status: 500 }
      );
    }

    const publishedLine = stdout
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith("Published:"));
    const url = publishedLine ? publishedLine.replace("Published:", "").trim() : null;

    return NextResponse.json({ url, output: stdout });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}
