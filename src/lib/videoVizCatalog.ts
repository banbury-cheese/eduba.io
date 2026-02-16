import type { VideoSceneType, VideoVizComponentId } from "@/lib/videoTypes";

export const VIDEO_SCENE_ORDER: VideoSceneType[] = [
  "hero",
  "consulting",
  "why-us",
  "services",
  "methodology",
  "choice",
  "faq",
  "cta",
];

export const VIDEO_VIZ_COMPONENTS: ReadonlyArray<{
  id: VideoVizComponentId;
  label: string;
  family: "flow" | "chart";
}> = [
  { id: "flow.pipeline", label: "Flow / Pipeline", family: "flow" },
  { id: "flow.swimlane", label: "Flow / Swimlane", family: "flow" },
  { id: "flow.cycle", label: "Flow / Cycle", family: "flow" },
  {
    id: "chart.bar.comparison",
    label: "Chart / Bar Comparison",
    family: "chart",
  },
  { id: "chart.bar.stacked", label: "Chart / Bar Stacked", family: "chart" },
  {
    id: "chart.line.timeline",
    label: "Chart / Line Timeline",
    family: "chart",
  },
  {
    id: "chart.pie.allocation",
    label: "Chart / Pie Allocation",
    family: "chart",
  },
  {
    id: "chart.scatter.impactRisk",
    label: "Chart / Scatter Impact-Risk",
    family: "chart",
  },
  { id: "chart.kpi.cards", label: "Chart / KPI Cards", family: "chart" },
];

export const VIDEO_VIZ_DEFAULT_BY_SCENE: Record<VideoSceneType, VideoVizComponentId> = {
  hero: "chart.kpi.cards",
  consulting: "flow.swimlane",
  "why-us": "chart.scatter.impactRisk",
  services: "chart.bar.stacked",
  methodology: "chart.line.timeline",
  choice: "chart.bar.comparison",
  faq: "chart.kpi.cards",
  cta: "flow.cycle",
};

export const VIDEO_VIZ_ALLOWLIST_BY_SCENE: Record<
  VideoSceneType,
  VideoVizComponentId[]
> = {
  hero: ["chart.kpi.cards", "flow.pipeline"],
  consulting: ["flow.swimlane", "flow.pipeline", "chart.bar.comparison"],
  "why-us": ["chart.scatter.impactRisk", "chart.bar.comparison", "chart.kpi.cards"],
  services: ["chart.bar.stacked", "chart.pie.allocation", "flow.pipeline"],
  methodology: ["chart.line.timeline", "flow.pipeline", "flow.swimlane"],
  choice: ["chart.bar.comparison", "chart.pie.allocation", "chart.scatter.impactRisk"],
  faq: ["flow.swimlane", "chart.bar.comparison", "chart.kpi.cards"],
  cta: ["flow.cycle", "chart.kpi.cards", "chart.pie.allocation"],
};

const COMPONENT_IDS = new Set(VIDEO_VIZ_COMPONENTS.map((item) => item.id));

export function isVideoVizComponentId(value: string): value is VideoVizComponentId {
  return COMPONENT_IDS.has(value as VideoVizComponentId);
}

export function isKnownSceneType(value: string): value is VideoSceneType {
  return VIDEO_SCENE_ORDER.includes(value as VideoSceneType);
}

export function getAllowedVizComponents(sceneType: VideoSceneType) {
  return VIDEO_VIZ_ALLOWLIST_BY_SCENE[sceneType];
}

export function getVizLabel(componentId: VideoVizComponentId) {
  return VIDEO_VIZ_COMPONENTS.find((item) => item.id === componentId)?.label ?? componentId;
}
