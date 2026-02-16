"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { LegacyVideoScriptError, normalizeVideoScript } from "@/lib/videoScriptUtils";
import type { VideoScript } from "@/lib/videoTypes";
import { EdubaVideoComposition, getDurationInFrames } from "@/video/EdubaVideoComposition";
import { VIDEO_DIMENSIONS, VIDEO_FPS, normalizeAspectRatio } from "@/video/constants";

const Player = dynamic(() => import("@remotion/player").then((mod) => mod.Player), {
  ssr: false,
});

export function VideoPreviewPlayer({ script }: { script: VideoScript }) {
  const normalizedScript = useMemo(() => {
    try {
      return normalizeVideoScript(script);
    } catch (error) {
      if (error instanceof LegacyVideoScriptError) {
        return null;
      }
      throw error;
    }
  }, [script]);

  const durationInFrames = useMemo(
    () =>
      normalizedScript ? getDurationInFrames(normalizedScript, VIDEO_FPS) : 1,
    [normalizedScript]
  );

  const aspectRatio = normalizedScript
    ? normalizeAspectRatio(normalizedScript.meta.aspectRatio)
    : "16:9";
  const dims = VIDEO_DIMENSIONS[aspectRatio];

  if (!normalizedScript) {
    return (
      <div
        style={{
          minHeight: 280,
          borderRadius: 8,
          border: "1px dashed rgba(93, 49, 54, 0.3)",
          background: "rgba(249,236,223,0.74)",
          display: "grid",
          placeItems: "center",
          padding: 20,
          color: "#5d3136",
          fontFamily: "IBM Plex Mono, monospace",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        Legacy script detected. Regenerate this job to preview schema v2 visuals.
      </div>
    );
  }

  const CompositionComponent =
    EdubaVideoComposition as React.ComponentType<Record<string, unknown>>;

  return (
    <Player
      component={CompositionComponent}
      inputProps={{ script: normalizedScript } as Record<string, unknown>}
      durationInFrames={durationInFrames}
      fps={VIDEO_FPS}
      compositionWidth={dims.width}
      compositionHeight={dims.height}
      style={{
        width: "100%",
        aspectRatio: `${dims.width} / ${dims.height}`,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#f9ecdf",
      }}
      controls
      autoPlay={false}
      loop={false}
      acknowledgeRemotionLicense
    />
  );
}
