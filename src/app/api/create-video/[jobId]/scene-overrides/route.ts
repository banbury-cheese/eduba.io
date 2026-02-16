import { NextResponse } from "next/server";
import { addRevision, getSelectedRevision, getVideoJob } from "@/lib/videoJobs";
import {
  LegacyVideoScriptError,
  normalizeVideoScript,
} from "@/lib/videoScriptUtils";
import type {
  SceneVisualization,
  VideoLayoutVariant,
  VideoScript,
} from "@/lib/videoTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteProps {
  params: Promise<{ jobId: string }>;
}

interface SceneOverridePayload {
  revisionId?: string;
  sceneId?: string;
  headline?: string;
  subcopy?: string;
  voiceoverScript?: string;
  illustrationPrompt?: string;
  layoutVariant?: VideoLayoutVariant;
  visualization?: Partial<SceneVisualization>;
}

export async function POST(request: Request, { params }: RouteProps) {
  const { jobId } = await params;
  const job = await getVideoJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Video job not found" }, { status: 404 });
  }

  const body = (await request.json()) as SceneOverridePayload;

  if (!body.sceneId) {
    return NextResponse.json({ error: "sceneId is required" }, { status: 400 });
  }

  const baseRevision =
    job.revisions.find((revision) => revision.id === body.revisionId) ??
    getSelectedRevision(job);

  try {
    const normalized = normalizeVideoScript(baseRevision.script);
    const sceneIndex = normalized.scenes.findIndex((scene) => scene.id === body.sceneId);

    if (sceneIndex < 0) {
      return NextResponse.json({ error: "Scene not found" }, { status: 404 });
    }

    const scene = normalized.scenes[sceneIndex];
    const visualization = body.visualization
      ? ({ ...scene.visualization, ...body.visualization } as SceneVisualization)
      : scene.visualization;

    const nextScript: VideoScript = {
      ...normalized,
      scenes: normalized.scenes.map((item, index) => {
        if (index !== sceneIndex) {
          return item;
        }

        return {
          ...item,
          headline: body.headline?.trim() || item.headline,
          subcopy: body.subcopy?.trim() || item.subcopy,
          voiceoverScript: body.voiceoverScript?.trim() || item.voiceoverScript,
          illustrationPrompt:
            body.illustrationPrompt?.trim() || item.illustrationPrompt,
          layoutVariant: body.layoutVariant || item.layoutVariant,
          visualization,
        };
      }),
    };

    const safeScript = normalizeVideoScript(nextScript);
    const updated = await addRevision(
      job,
      safeScript,
      `Manual override: ${scene.id}`
    );

    return NextResponse.json({
      job: updated,
      selectedRevision: getSelectedRevision(updated),
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
        error: error instanceof Error ? error.message : "Unable to apply scene override",
      },
      { status: 500 }
    );
  }
}
