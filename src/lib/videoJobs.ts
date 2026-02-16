import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { ChatTurn, VideoBrief, VideoJob, VideoRevision, VideoScript } from "@/lib/videoTypes";
import {
  LegacyVideoScriptError,
  normalizeVideoScript,
} from "@/lib/videoScriptUtils";

const JOBS_DIR = path.join(process.cwd(), ".video-jobs");

async function ensureDir() {
  await fs.mkdir(JOBS_DIR, { recursive: true });
}

function jobPath(jobId: string) {
  return path.join(JOBS_DIR, `${jobId}.json`);
}

function isVideoScriptCandidate(value: unknown): value is Partial<VideoScript> {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return Boolean(record.meta) && Array.isArray(record.scenes);
}

function isVideoJobLike(value: unknown): value is VideoJob {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    Array.isArray(record.revisions) &&
    typeof record.selectedRevisionId === "string" &&
    Boolean(record.brief)
  );
}

function defaultBriefFromScript(script: VideoScript): VideoBrief {
  return {
    company: script.meta.company,
    sector: script.meta.sector,
    slug: script.meta.slug,
    context: "",
    customPrompt: "",
    links: [],
    website: "",
    include: [],
    exclude: [],
    template: script.meta.template,
    aspectRatio: script.meta.aspectRatio,
    durationSec: script.meta.durationSec,
  };
}

function coerceVideoJob(raw: unknown, jobId: string): VideoJob | null {
  if (isVideoJobLike(raw)) {
    return raw;
  }

  if (!isVideoScriptCandidate(raw)) {
    return null;
  }

  try {
    const script = normalizeVideoScript(raw);
    const now = new Date().toISOString();
    const revisionId = randomUUID();
    const revision: VideoRevision = {
      id: revisionId,
      version: 1,
      createdAt: now,
      notes: "Imported script",
      script,
    };

    return {
      id: jobId,
      status: "editing",
      createdAt: now,
      updatedAt: now,
      brief: defaultBriefFromScript(script),
      revisions: [revision],
      selectedRevisionId: revision.id,
      chat: [],
    };
  } catch (error) {
    if (error instanceof LegacyVideoScriptError) {
      return null;
    }
    throw error;
  }
}

export async function listVideoJobs(): Promise<VideoJob[]> {
  await ensureDir();
  const files = await fs.readdir(JOBS_DIR);
  const jobs = await Promise.all(
    files
      .filter((name) => name.endsWith(".json"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(JOBS_DIR, file), "utf8");
        const parsed = JSON.parse(raw) as unknown;
        const jobId = file.replace(/\.json$/, "");
        return coerceVideoJob(parsed, jobId);
      })
  );
  return jobs
    .filter((job): job is VideoJob => Boolean(job))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getVideoJob(jobId: string): Promise<VideoJob | null> {
  await ensureDir();
  try {
    const raw = await fs.readFile(jobPath(jobId), "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return coerceVideoJob(parsed, jobId);
  } catch {
    return null;
  }
}

export async function saveVideoJob(job: VideoJob): Promise<void> {
  await ensureDir();
  await fs.writeFile(jobPath(job.id), JSON.stringify(job, null, 2), "utf8");
}

export async function createVideoJob(brief: VideoBrief, script: VideoScript): Promise<VideoJob> {
  const now = new Date().toISOString();
  const jobId = randomUUID();
  const revision: VideoRevision = {
    id: randomUUID(),
    version: 1,
    createdAt: now,
    notes: "Initial draft",
    script,
  };
  const job: VideoJob = {
    id: jobId,
    status: "editing",
    createdAt: now,
    updatedAt: now,
    brief,
    revisions: [revision],
    selectedRevisionId: revision.id,
    chat: [],
  };
  await saveVideoJob(job);
  return job;
}

export async function addRevision(job: VideoJob, script: VideoScript, notes: string): Promise<VideoJob> {
  const now = new Date().toISOString();
  const revision: VideoRevision = {
    id: randomUUID(),
    version: job.revisions.length + 1,
    createdAt: now,
    notes,
    script,
  };
  job.revisions.push(revision);
  job.selectedRevisionId = revision.id;
  job.updatedAt = now;
  await saveVideoJob(job);
  return job;
}

export async function addChatTurn(
  job: VideoJob,
  role: ChatTurn["role"],
  message: string,
  revisionId?: string
): Promise<VideoJob> {
  job.chat.push({
    id: randomUUID(),
    role,
    message,
    revisionId,
    createdAt: new Date().toISOString(),
  });
  job.updatedAt = new Date().toISOString();
  await saveVideoJob(job);
  return job;
}

export function getSelectedRevision(job: VideoJob) {
  return job.revisions.find((revision) => revision.id === job.selectedRevisionId) ?? job.revisions[job.revisions.length - 1];
}

export async function setSelectedRevision(job: VideoJob, revisionId: string): Promise<VideoJob> {
  const hasRevision = job.revisions.some((revision) => revision.id === revisionId);
  if (!hasRevision) {
    throw new Error("Revision not found");
  }
  job.selectedRevisionId = revisionId;
  job.updatedAt = new Date().toISOString();
  await saveVideoJob(job);
  return job;
}

export async function setJobStatus(job: VideoJob, status: VideoJob["status"], error?: string): Promise<VideoJob> {
  job.status = status;
  job.error = error;
  job.updatedAt = new Date().toISOString();
  await saveVideoJob(job);
  return job;
}

export async function setJobOutput(
  job: VideoJob,
  output: { videoUrl?: string; posterUrl?: string }
): Promise<VideoJob> {
  job.output = output;
  job.status = "ready";
  job.updatedAt = new Date().toISOString();
  await saveVideoJob(job);
  return job;
}

export async function updateRevisionScript(
  job: VideoJob,
  revisionId: string,
  script: VideoScript,
  note?: string
): Promise<VideoJob> {
  const revision = job.revisions.find((item) => item.id === revisionId);
  if (!revision) {
    throw new Error("Revision not found");
  }
  revision.script = script;
  if (note) {
    revision.notes = `${revision.notes} | ${note}`;
  }
  job.updatedAt = new Date().toISOString();
  await saveVideoJob(job);
  return job;
}
