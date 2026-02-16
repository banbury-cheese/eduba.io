import { NextResponse } from "next/server";
import {
  getSelectedRevision,
  getVideoJob,
  setJobOutput,
  setJobStatus,
  updateRevisionScript,
} from "@/lib/videoJobs";
import { renderVideoScript } from "@/lib/remotionRender";
import {
  LegacyVideoScriptError,
  normalizeVideoScript,
} from "@/lib/videoScriptUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ jobId: string }>;
}

export async function POST(_request: Request, { params }: RouteProps) {
  const { jobId } = await params;
  const job = await getVideoJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Video job not found" }, { status: 404 });
  }

  const selectedRevision = getSelectedRevision(job);
  let normalizedScript;

  try {
    normalizedScript = normalizeVideoScript(selectedRevision.script);
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
    throw error;
  }

  await setJobStatus(job, "rendering");

  try {
    const output = await renderVideoScript({
      jobId,
      revisionId: selectedRevision.id,
      script: normalizedScript,
    });

    if (output.adjustedScript) {
      await updateRevisionScript(
        job,
        selectedRevision.id,
        normalizeVideoScript(output.adjustedScript),
        "voiceover-timing auto-adjusted"
      );
    }

    const updated = await setJobOutput(job, {
      videoUrl: output.videoUrl,
      posterUrl: output.posterUrl,
    });

    return NextResponse.json({
      job: updated,
      selectedRevision: getSelectedRevision(updated),
      output: {
        videoUrl: output.videoUrl,
        posterUrl: output.posterUrl,
      },
      timingReport: output.timingReport ?? [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to render video";
    await setJobStatus(job, "failed", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
