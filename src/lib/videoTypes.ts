export type VideoAspectRatio = "16:9" | "1:1" | "9:16";

export type VideoLayoutVariant = "split" | "stacked" | "focus" | "cards-first";

export type VideoSceneType =
  | "hero"
  | "consulting"
  | "why-us"
  | "services"
  | "methodology"
  | "choice"
  | "faq"
  | "cta";

export type VideoVizComponentId =
  | "flow.pipeline"
  | "flow.swimlane"
  | "flow.cycle"
  | "chart.bar.comparison"
  | "chart.bar.stacked"
  | "chart.line.timeline"
  | "chart.pie.allocation"
  | "chart.scatter.impactRisk"
  | "chart.kpi.cards";

export type VideoVizThemeVariant = "default" | "accent" | "muted";
export type VideoVizValueMode = "numeric" | "qualitative";

export interface BaseSceneVisualization {
  componentId: VideoVizComponentId;
  title: string;
  caption: string;
  themeVariant?: VideoVizThemeVariant;
  valueMode?: VideoVizValueMode;
}

export interface FlowVisualizationNode {
  id: string;
  label: string;
  detail?: string;
  lane?: string;
}

export interface FlowVisualizationEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface FlowVisualization extends BaseSceneVisualization {
  componentId: "flow.pipeline" | "flow.swimlane" | "flow.cycle";
  nodes: FlowVisualizationNode[];
  edges: FlowVisualizationEdge[];
  laneLabels?: string[];
}

export interface ChartSeries {
  id: string;
  label: string;
  values: number[];
  rawValues?: string[];
  color?: string;
}

export interface BarVisualization extends BaseSceneVisualization {
  componentId: "chart.bar.comparison" | "chart.bar.stacked";
  categories: string[];
  series: ChartSeries[];
}

export interface LineVisualization extends BaseSceneVisualization {
  componentId: "chart.line.timeline";
  categories: string[];
  series: ChartSeries[];
}

export interface PieSlice {
  id: string;
  label: string;
  value: number;
  rawValue?: string;
  color?: string;
  detail?: string;
}

export interface PieVisualization extends BaseSceneVisualization {
  componentId: "chart.pie.allocation";
  slices: PieSlice[];
}

export interface ScatterPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  rawX?: string;
  rawY?: string;
  size?: number;
  detail?: string;
}

export interface ScatterVisualization extends BaseSceneVisualization {
  componentId: "chart.scatter.impactRisk";
  points: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
}

export interface KpiItem {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  detail?: string;
}

export interface KpiVisualization extends BaseSceneVisualization {
  componentId: "chart.kpi.cards";
  items: KpiItem[];
}

export type SceneVisualization =
  | FlowVisualization
  | BarVisualization
  | LineVisualization
  | PieVisualization
  | ScatterVisualization
  | KpiVisualization;

export interface VideoSceneCard {
  title: string;
  text: string;
}

export interface VideoScene {
  id: string;
  type: VideoSceneType;
  durationSec: number;
  headline: string;
  subcopy: string;
  voiceoverScript: string;
  layoutVariant: VideoLayoutVariant;
  illustrationPrompt: string;
  visualization: SceneVisualization;
  bullets: string[];
  cards: VideoSceneCard[];
}

export interface VideoScriptMeta {
  schemaVersion: 2;
  title: string;
  slug: string;
  company: string;
  sector: string;
  template: string;
  aspectRatio: VideoAspectRatio;
  durationSec: number;
  ctaText: string;
  voiceoverEnabled: boolean;
  illustrationStyle: string;
}

export interface VideoScript {
  meta: VideoScriptMeta;
  scenes: VideoScene[];
}

export interface VideoBrief {
  company: string;
  sector: string;
  slug: string;
  context: string;
  customPrompt: string;
  links: string[];
  website: string;
  include: string[];
  exclude: string[];
  template: string;
  aspectRatio: VideoAspectRatio;
  durationSec: number;
}

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  message: string;
  createdAt: string;
  revisionId?: string;
}

export interface VideoRevision {
  id: string;
  version: number;
  createdAt: string;
  notes: string;
  script: VideoScript;
}

export interface VideoJob {
  id: string;
  status: "queued" | "editing" | "rendering" | "ready" | "failed";
  createdAt: string;
  updatedAt: string;
  brief: VideoBrief;
  revisions: VideoRevision[];
  selectedRevisionId: string;
  chat: ChatTurn[];
  output?: {
    videoUrl?: string;
    posterUrl?: string;
  };
  error?: string;
}
