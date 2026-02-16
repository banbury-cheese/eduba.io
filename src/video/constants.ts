import type { VideoAspectRatio } from "../lib/videoTypes";

export const VIDEO_FPS = 30;

export const VIDEO_DIMENSIONS: Record<VideoAspectRatio, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
};

export function normalizeAspectRatio(value: string | undefined): VideoAspectRatio {
  if (value === "1:1" || value === "9:16" || value === "16:9") {
    return value;
  }
  return "16:9";
}

export function toCompositionId(aspectRatio: VideoAspectRatio) {
  return `EdubaSectorVideo-${aspectRatio.replace(":", "-")}`;
}
