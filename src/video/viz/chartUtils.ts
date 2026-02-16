import type { VideoVizValueMode } from "@/lib/videoTypes";
import { formatQualitative } from "@/video/viz/styles";

export function yAxisFormatter(value: number, mode: VideoVizValueMode | undefined) {
  if (mode === "qualitative") {
    return formatQualitative(value);
  }
  return Number(value).toString();
}

export function valueLabel(value: number, mode: VideoVizValueMode | undefined, raw?: string) {
  if (mode === "qualitative") {
    return formatQualitative(value, raw);
  }
  return `${value}`;
}

export function yAxisConfig(mode: VideoVizValueMode | undefined) {
  if (mode === "qualitative") {
    return {
      min: 1,
      max: 5,
      tickNumber: 5,
    };
  }

  return {
    min: 0,
    max: undefined,
  };
}
