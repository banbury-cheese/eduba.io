import { NextResponse } from "next/server";
import { getSelectedRevision, getVideoJob } from "@/lib/videoJobs";
import { LegacyVideoScriptError, normalizeVideoScript } from "@/lib/videoScriptUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { jobId } = await params;
  const job = await getVideoJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Video job not found" }, { status: 404 });
  }

  try {
    normalizeVideoScript(getSelectedRevision(job).script);
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

  return NextResponse.json({
    job,
    selectedRevision: getSelectedRevision(job),
  });
}
