import { NextResponse } from "next/server";
import { getSelectedRevision, getVideoJob, setSelectedRevision } from "@/lib/videoJobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ jobId: string }>;
}

export async function POST(request: Request, { params }: RouteProps) {
  const { jobId } = await params;
  const job = await getVideoJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Video job not found" }, { status: 404 });
  }

  const body = (await request.json()) as { revisionId?: string };
  if (!body.revisionId) {
    return NextResponse.json(
      { error: "revisionId is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await setSelectedRevision(job, body.revisionId);
    return NextResponse.json({
      job: updated,
      selectedRevision: getSelectedRevision(updated),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to select revision",
      },
      { status: 400 }
    );
  }
}
