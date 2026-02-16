import {
  VIDEO_SCENE_ORDER,
  VIDEO_VIZ_ALLOWLIST_BY_SCENE,
  VIDEO_VIZ_DEFAULT_BY_SCENE,
  isKnownSceneType,
  isVideoVizComponentId,
} from "@/lib/videoVizCatalog";
import type {
  BarVisualization,
  FlowVisualization,
  KpiVisualization,
  LineVisualization,
  PieVisualization,
  ScatterVisualization,
  SceneVisualization,
  VideoLayoutVariant,
  VideoScene,
  VideoSceneType,
  VideoScript,
  VideoVizComponentId,
  VideoVizValueMode,
} from "@/lib/videoTypes";
import { DEFAULT_VIDEO_SCRIPT } from "@/video/defaultScript";

const LAYOUT_VARIANTS: VideoLayoutVariant[] = [
  "split",
  "stacked",
  "focus",
  "cards-first",
];

const QUALITATIVE_TO_NUMERIC: Record<string, number> = {
  "very low": 1,
  low: 2,
  medium: 3,
  high: 4,
  "very high": 5,
  weak: 2,
  strong: 4,
  controlled: 4,
  critical: 5,
  moderate: 3,
};

const MAX_FLOW_NODES = 4;
const MAX_FLOW_EDGES = 6;
const MAX_LANES = 3;
const MAX_BAR_CATEGORIES = 4;
const MAX_BAR_SERIES = 2;
const MAX_STACKED_SERIES = 3;
const MAX_LINE_CATEGORIES = 6;
const MAX_LINE_SERIES = 2;
const MAX_PIE_SLICES = 4;
const MAX_SCATTER_POINTS = 3;
const MAX_KPI_ITEMS = 3;
const MAX_BULLETS = 3;
const MAX_CARDS = 2;

export class LegacyVideoScriptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LegacyVideoScriptError";
  }
}

function toString(value: unknown, fallback: string) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }
  if (value === null || value === undefined) {
    return fallback;
  }
  return String(value);
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function toStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }
  const output = value
    .map((item) => (typeof item === "string" ? item.trim() : String(item ?? "").trim()))
    .filter(Boolean);
  return output.length > 0 ? output : fallback;
}

function toLayoutVariant(value: unknown, fallback: VideoLayoutVariant): VideoLayoutVariant {
  if (typeof value === "string" && LAYOUT_VARIANTS.includes(value as VideoLayoutVariant)) {
    return value as VideoLayoutVariant;
  }
  return fallback;
}

function isLegacyScript(input: Partial<VideoScript> | null | undefined) {
  return input?.meta?.schemaVersion !== 2;
}

function assertSchemaVersion(input: Partial<VideoScript> | null | undefined) {
  if (isLegacyScript(input)) {
    throw new LegacyVideoScriptError(
      "This video job uses a legacy schema. Please regenerate the job to use schemaVersion 2."
    );
  }
}

function normalizeSceneType(value: unknown, fallback: VideoSceneType) {
  if (typeof value === "string" && isKnownSceneType(value)) {
    return value;
  }
  return fallback;
}

function normalizeComponentId(
  sceneType: VideoSceneType,
  requested: unknown,
  fallback: VideoVizComponentId
): VideoVizComponentId {
  const allowlist = VIDEO_VIZ_ALLOWLIST_BY_SCENE[sceneType];
  const defaultId = VIDEO_VIZ_DEFAULT_BY_SCENE[sceneType];

  if (typeof requested === "string" && isVideoVizComponentId(requested) && allowlist.includes(requested)) {
    return requested;
  }
  if (allowlist.includes(fallback)) {
    return fallback;
  }
  return allowlist[0] ?? defaultId;
}

function parseQualitative(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return {
      value,
      raw: undefined,
      qualitative: false,
    };
  }

  if (typeof value === "string") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return {
        value: numeric,
        raw: undefined,
        qualitative: false,
      };
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return { value: fallback, raw: undefined, qualitative: false };
    }

    if (QUALITATIVE_TO_NUMERIC[normalized]) {
      return {
        value: QUALITATIVE_TO_NUMERIC[normalized],
        raw: value,
        qualitative: true,
      };
    }

    return {
      value: fallback,
      raw: value,
      qualitative: true,
    };
  }

  return { value: fallback, raw: undefined, qualitative: false };
}

function withBaseFields<T extends VideoVizComponentId>(
  componentId: T,
  input: Record<string, unknown>,
  fallback: SceneVisualization,
  valueMode?: VideoVizValueMode
) {
  return {
    componentId,
    title: toString(input.title, fallback.title),
    caption: toString(input.caption, fallback.caption),
    themeVariant:
      input.themeVariant === "accent" ||
      input.themeVariant === "muted" ||
      input.themeVariant === "default"
        ? input.themeVariant
        : fallback.themeVariant,
    ...(valueMode ? { valueMode } : {}),
  };
}

function normalizeFlowVisualization(
  componentId: FlowVisualization["componentId"],
  input: Record<string, unknown>,
  fallback: FlowVisualization
): FlowVisualization {
  const fallbackNodes = fallback.nodes.slice(0, MAX_FLOW_NODES);
  const sourceNodes = Array.isArray(input.nodes) ? input.nodes : fallbackNodes;

  const nodes = sourceNodes
    .slice(0, MAX_FLOW_NODES)
    .map((node, index) => {
      if (typeof node !== "object" || node === null) {
        return null;
      }
      const record = node as Record<string, unknown>;
      const fallbackNode = fallbackNodes[index] ?? fallbackNodes[0];
      return {
        id: toString(record.id, `${fallback.componentId}-node-${index + 1}`),
        label: toString(record.label, fallbackNode?.label ?? `Step ${index + 1}`),
        detail: toString(record.detail, fallbackNode?.detail ?? ""),
        lane: toString(record.lane, fallbackNode?.lane ?? ""),
      };
    })
    .filter(Boolean) as FlowVisualization["nodes"];

  const safeNodes = nodes.length > 0 ? nodes : fallbackNodes;
  const safeNodeIds = new Set(safeNodes.map((node) => node.id));

  const fallbackEdges = fallback.edges;
  const sourceEdges = Array.isArray(input.edges) ? input.edges : fallbackEdges;

  const edges = sourceEdges
    .slice(0, MAX_FLOW_EDGES)
    .map((edge, index) => {
      if (typeof edge !== "object" || edge === null) {
        return null;
      }
      const record = edge as Record<string, unknown>;
      const fallbackEdge = fallbackEdges[index] ?? fallbackEdges[0];
      const source = toString(record.source, fallbackEdge?.source ?? safeNodes[0].id);
      const target = toString(record.target, fallbackEdge?.target ?? safeNodes[safeNodes.length - 1].id);
      if (!safeNodeIds.has(source) || !safeNodeIds.has(target)) {
        return null;
      }
      return {
        id: toString(record.id, `${fallback.componentId}-edge-${index + 1}`),
        source,
        target,
        label: toString(record.label, fallbackEdge?.label ?? ""),
      };
    })
    .filter(Boolean) as FlowVisualization["edges"];

  const laneLabels = toStringArray(input.laneLabels, fallback.laneLabels ?? []).slice(0, MAX_LANES);

  return {
    ...withBaseFields(componentId, input, fallback),
    nodes: safeNodes,
    edges: edges.length > 0 ? edges : fallbackEdges,
    laneLabels,
  };
}

function normalizeSeries(
  inputSeries: unknown,
  fallbackSeries: BarVisualization["series"],
  categoryLength: number,
  maxSeries: number
) {
  const sourceSeries = Array.isArray(inputSeries) ? inputSeries : fallbackSeries;
  let hasQualitative = false;

  const normalized = sourceSeries
    .slice(0, maxSeries)
    .map((series, seriesIndex) => {
      if (typeof series !== "object" || series === null) {
        return null;
      }

      const record = series as Record<string, unknown>;
      const fallback = fallbackSeries[seriesIndex] ?? fallbackSeries[0];
      const sourceValues = Array.isArray(record.values) ? record.values : fallback?.values ?? [];

      const values: number[] = [];
      const rawValues: string[] = [];

      for (let index = 0; index < categoryLength; index += 1) {
        const fallbackValue = fallback?.values[index] ?? 0;
        const parsed = parseQualitative(sourceValues[index], fallbackValue);
        values.push(parsed.value);
        if (parsed.raw) {
          rawValues.push(parsed.raw);
          hasQualitative = true;
        }
      }

      return {
        id: toString(record.id, fallback?.id ?? `series-${seriesIndex + 1}`),
        label: toString(record.label, fallback?.label ?? `Series ${seriesIndex + 1}`),
        values,
        rawValues: rawValues.length > 0 ? rawValues : fallback?.rawValues,
        color: toString(record.color, fallback?.color ?? ""),
      };
    })
    .filter(Boolean) as BarVisualization["series"];

  return {
    series: normalized.length > 0 ? normalized : fallbackSeries.slice(0, maxSeries),
    valueMode: hasQualitative ? "qualitative" : "numeric",
  } as const;
}

function normalizeBarVisualization(
  componentId: BarVisualization["componentId"],
  input: Record<string, unknown>,
  fallback: BarVisualization
): BarVisualization {
  const categories = toStringArray(input.categories, fallback.categories).slice(0, MAX_BAR_CATEGORIES);
  const normalizedSeries = normalizeSeries(
    input.series,
    fallback.series,
    categories.length,
    componentId === "chart.bar.stacked" ? MAX_STACKED_SERIES : MAX_BAR_SERIES
  );

  return {
    ...withBaseFields(componentId, input, fallback, normalizedSeries.valueMode),
    categories,
    series: normalizedSeries.series,
  };
}

function normalizeLineVisualization(
  input: Record<string, unknown>,
  fallback: LineVisualization
): LineVisualization {
  const categories = toStringArray(input.categories, fallback.categories).slice(0, MAX_LINE_CATEGORIES);
  const normalizedSeries = normalizeSeries(
    input.series,
    fallback.series,
    categories.length,
    MAX_LINE_SERIES
  );

  return {
    ...withBaseFields("chart.line.timeline", input, fallback, normalizedSeries.valueMode),
    categories,
    series: normalizedSeries.series,
  };
}

function normalizePieVisualization(
  input: Record<string, unknown>,
  fallback: PieVisualization
): PieVisualization {
  const sourceSlices = Array.isArray(input.slices) ? input.slices : fallback.slices;
  let hasQualitative = false;

  const slices = sourceSlices
    .slice(0, MAX_PIE_SLICES)
    .map((slice, index) => {
      if (typeof slice !== "object" || slice === null) {
        return null;
      }
      const record = slice as Record<string, unknown>;
      const fallbackSlice = fallback.slices[index] ?? fallback.slices[0];
      const parsed = parseQualitative(record.value, fallbackSlice.value);
      if (parsed.raw) {
        hasQualitative = true;
      }
      return {
        id: toString(record.id, fallbackSlice.id),
        label: toString(record.label, fallbackSlice.label),
        value: parsed.value,
        rawValue: parsed.raw ?? fallbackSlice.rawValue,
        color: toString(record.color, fallbackSlice.color ?? ""),
        detail: toString(record.detail, fallbackSlice.detail ?? ""),
      };
    })
    .filter(Boolean) as PieVisualization["slices"];

  return {
    ...withBaseFields(
      "chart.pie.allocation",
      input,
      fallback,
      hasQualitative ? "qualitative" : "numeric"
    ),
    slices: slices.length > 0 ? slices : fallback.slices,
  };
}

function normalizeScatterVisualization(
  input: Record<string, unknown>,
  fallback: ScatterVisualization
): ScatterVisualization {
  const sourcePoints = Array.isArray(input.points) ? input.points : fallback.points;
  let hasQualitative = false;

  const points = sourcePoints
    .slice(0, MAX_SCATTER_POINTS)
    .map((point, index) => {
      if (typeof point !== "object" || point === null) {
        return null;
      }
      const record = point as Record<string, unknown>;
      const fallbackPoint = fallback.points[index] ?? fallback.points[0];

      const x = parseQualitative(record.x, fallbackPoint.x);
      const y = parseQualitative(record.y, fallbackPoint.y);

      if (x.raw || y.raw) {
        hasQualitative = true;
      }

      return {
        id: toString(record.id, fallbackPoint.id),
        label: toString(record.label, fallbackPoint.label),
        x: x.value,
        y: y.value,
        rawX: x.raw ?? fallbackPoint.rawX,
        rawY: y.raw ?? fallbackPoint.rawY,
        size: Math.max(4, toNumber(record.size, fallbackPoint.size ?? 12)),
        detail: toString(record.detail, fallbackPoint.detail ?? ""),
      };
    })
    .filter(Boolean) as ScatterVisualization["points"];

  if (points.length > 1) {
    const uniqueY = new Set(points.map((point) => Math.round(point.y))).size;
    if (uniqueY === 1) {
      points.forEach((point, index) => {
        point.y = Math.max(1, Math.min(5, point.y + (index - 1) * 0.8));
      });
    }
  }

  return {
    ...withBaseFields(
      "chart.scatter.impactRisk",
      input,
      fallback,
      hasQualitative ? "qualitative" : "numeric"
    ),
    xLabel: toString(input.xLabel, fallback.xLabel ?? "Impact"),
    yLabel: toString(input.yLabel, fallback.yLabel ?? "Risk"),
    points: points.length > 0 ? points : fallback.points,
  };
}

function normalizeKpiVisualization(
  input: Record<string, unknown>,
  fallback: KpiVisualization
): KpiVisualization {
  const sourceItems = Array.isArray(input.items) ? input.items : fallback.items;
  const items = sourceItems
    .slice(0, MAX_KPI_ITEMS)
    .map((item, index) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const fallbackItem = fallback.items[index] ?? fallback.items[0];
      const trend =
        record.trend === "up" || record.trend === "down" || record.trend === "flat"
          ? record.trend
          : fallbackItem.trend;

      return {
        id: toString(record.id, fallbackItem.id),
        label: toString(record.label, fallbackItem.label),
        value: toString(record.value, fallbackItem.value),
        delta: toString(record.delta, fallbackItem.delta ?? ""),
        trend,
        detail: toString(record.detail, fallbackItem.detail ?? ""),
      };
    })
    .filter(Boolean) as KpiVisualization["items"];

  return {
    ...withBaseFields("chart.kpi.cards", input, fallback, "qualitative"),
    items: items.length > 0 ? items : fallback.items,
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
}

function buildFallbackVisualization(
  sceneType: VideoSceneType,
  componentId: VideoVizComponentId,
  fallback: SceneVisualization
): SceneVisualization {
  const baseTitle = fallback.title || `${sceneType} visualization`;
  const baseCaption = fallback.caption || "Generated visualization";

  switch (componentId) {
    case "flow.pipeline":
    case "flow.swimlane":
    case "flow.cycle":
      return {
        componentId,
        title: baseTitle,
        caption: baseCaption,
        themeVariant: fallback.themeVariant,
        nodes: [
          { id: `${sceneType}-n1`, label: "Input", detail: "Source context" },
          { id: `${sceneType}-n2`, label: "Orchestrate", detail: "Model + guardrails" },
          { id: `${sceneType}-n3`, label: "Outcome", detail: "Measured result" },
        ],
        edges: [
          { id: `${sceneType}-e1`, source: `${sceneType}-n1`, target: `${sceneType}-n2` },
          { id: `${sceneType}-e2`, source: `${sceneType}-n2`, target: `${sceneType}-n3` },
        ],
        laneLabels: componentId === "flow.swimlane" ? ["Business", "AI", "Governance"] : [],
      };
    case "chart.bar.comparison":
    case "chart.bar.stacked":
      return {
        componentId,
        title: baseTitle,
        caption: baseCaption,
        themeVariant: fallback.themeVariant,
        valueMode: "qualitative",
        categories: ["A", "B", "C"],
        series: [
          {
            id: `${sceneType}-s1`,
            label: "Priority",
            values: [3, 4, 2],
            rawValues: ["medium", "high", "low"],
          },
        ],
      };
    case "chart.line.timeline":
      return {
        componentId,
        title: baseTitle,
        caption: baseCaption,
        themeVariant: fallback.themeVariant,
        valueMode: "qualitative",
        categories: ["Phase 1", "Phase 2", "Phase 3"],
        series: [
          {
            id: `${sceneType}-timeline`,
            label: "Readiness",
            values: [2, 3, 4],
            rawValues: ["low", "medium", "high"],
          },
        ],
      };
    case "chart.pie.allocation":
      return {
        componentId,
        title: baseTitle,
        caption: baseCaption,
        themeVariant: fallback.themeVariant,
        valueMode: "qualitative",
        slices: [
          { id: `${sceneType}-p1`, label: "Primary", value: 4, rawValue: "high" },
          { id: `${sceneType}-p2`, label: "Secondary", value: 3, rawValue: "medium" },
          { id: `${sceneType}-p3`, label: "Support", value: 2, rawValue: "low" },
        ],
      };
    case "chart.scatter.impactRisk":
      return {
        componentId,
        title: baseTitle,
        caption: baseCaption,
        themeVariant: fallback.themeVariant,
        valueMode: "qualitative",
        xLabel: "Impact",
        yLabel: "Risk",
        points: [
          {
            id: `${sceneType}-pt1`,
            label: "Primary initiative",
            x: 4,
            y: 2,
            rawX: "high",
            rawY: "low",
            size: 14,
          },
        ],
      };
    case "chart.kpi.cards":
    default:
      return {
        componentId: "chart.kpi.cards",
        title: baseTitle,
        caption: baseCaption,
        themeVariant: fallback.themeVariant,
        valueMode: "qualitative",
        items: [
          {
            id: `${sceneType}-k1`,
            label: "Readiness",
            value: "High",
            delta: "validated",
            trend: "up",
          },
          {
            id: `${sceneType}-k2`,
            label: "Risk",
            value: "Controlled",
            delta: "governed",
            trend: "flat",
          },
        ],
      };
  }
}

function normalizeVisualization(
  sceneType: VideoSceneType,
  value: unknown,
  fallback: SceneVisualization
): SceneVisualization {
  const source = toRecord(value);
  const componentId = normalizeComponentId(sceneType, source.componentId, fallback.componentId);
  const componentFallback =
    fallback.componentId === componentId
      ? fallback
      : buildFallbackVisualization(sceneType, componentId, fallback);

  switch (componentId) {
    case "flow.pipeline":
    case "flow.swimlane":
    case "flow.cycle":
      return normalizeFlowVisualization(
        componentId,
        source,
        componentFallback as FlowVisualization
      );
    case "chart.bar.comparison":
    case "chart.bar.stacked":
      return normalizeBarVisualization(
        componentId,
        source,
        componentFallback as BarVisualization
      );
    case "chart.line.timeline":
      return normalizeLineVisualization(source, componentFallback as LineVisualization);
    case "chart.pie.allocation":
      return normalizePieVisualization(source, componentFallback as PieVisualization);
    case "chart.scatter.impactRisk":
      return normalizeScatterVisualization(
        source,
        componentFallback as ScatterVisualization
      );
    case "chart.kpi.cards":
      return normalizeKpiVisualization(source, componentFallback as KpiVisualization);
    default:
      return componentFallback;
  }
}

function coerceScene(
  source: Record<string, unknown>,
  fallback: VideoScene,
  index: number
): VideoScene {
  const sceneType = normalizeSceneType(source.type, fallback.type);
  const duration = Math.max(3, Math.round(toNumber(source.durationSec, fallback.durationSec)));

  return {
    id: toString(source.id, fallback.id || `scene-${index + 1}`),
    type: sceneType,
    durationSec: duration,
    headline: toString(source.headline, fallback.headline),
    subcopy: toString(source.subcopy, fallback.subcopy),
    voiceoverScript: toString(source.voiceoverScript, fallback.voiceoverScript),
    layoutVariant: toLayoutVariant(source.layoutVariant, fallback.layoutVariant),
    illustrationPrompt: toString(source.illustrationPrompt, fallback.illustrationPrompt),
    visualization: normalizeVisualization(sceneType, source.visualization, fallback.visualization),
    bullets: toStringArray(source.bullets, fallback.bullets).slice(0, MAX_BULLETS),
    cards: (
      (Array.isArray(source.cards) ? source.cards : fallback.cards)
        .map((card, cardIndex) => {
          if (typeof card !== "object" || card === null) {
            return null;
          }
          const record = card as Record<string, unknown>;
          const fallbackCard =
            fallback.cards[cardIndex] ?? fallback.cards[0] ?? { title: "", text: "" };
          return {
            title: toString(record.title, fallbackCard.title),
            text: toString(record.text, fallbackCard.text),
          };
        })
        .filter(Boolean) as VideoScene["cards"]
    ).slice(0, MAX_CARDS),
  };
}

function normalizeMeta(
  source: Partial<VideoScript>["meta"],
  scenes: VideoScene[]
): VideoScript["meta"] {
  const safe = source ?? DEFAULT_VIDEO_SCRIPT.meta;
  return {
    schemaVersion: 2,
    title: toString(safe.title, DEFAULT_VIDEO_SCRIPT.meta.title),
    slug: toString(safe.slug, DEFAULT_VIDEO_SCRIPT.meta.slug),
    company: toString(safe.company, DEFAULT_VIDEO_SCRIPT.meta.company),
    sector: toString(safe.sector, DEFAULT_VIDEO_SCRIPT.meta.sector),
    template: toString(safe.template, DEFAULT_VIDEO_SCRIPT.meta.template),
    aspectRatio:
      safe.aspectRatio === "1:1" || safe.aspectRatio === "9:16" || safe.aspectRatio === "16:9"
        ? safe.aspectRatio
        : DEFAULT_VIDEO_SCRIPT.meta.aspectRatio,
    durationSec: scenes.reduce((total, scene) => total + scene.durationSec, 0),
    ctaText: toString(safe.ctaText, DEFAULT_VIDEO_SCRIPT.meta.ctaText),
    voiceoverEnabled:
      typeof safe.voiceoverEnabled === "boolean"
        ? safe.voiceoverEnabled
        : DEFAULT_VIDEO_SCRIPT.meta.voiceoverEnabled,
    illustrationStyle: toString(safe.illustrationStyle, DEFAULT_VIDEO_SCRIPT.meta.illustrationStyle),
  };
}

function matchSceneByType(sourceScenes: unknown[], sceneType: VideoSceneType, used: Set<number>) {
  for (let index = 0; index < sourceScenes.length; index += 1) {
    if (used.has(index)) {
      continue;
    }
    const scene = sourceScenes[index];
    if (typeof scene !== "object" || scene === null) {
      continue;
    }
    const record = scene as Record<string, unknown>;
    if (normalizeSceneType(record.type, sceneType) === sceneType) {
      used.add(index);
      return record;
    }
  }
  return null;
}

export function normalizeVideoScript(script: Partial<VideoScript> | null | undefined): VideoScript {
  assertSchemaVersion(script);
  const sourceScenes = Array.isArray(script?.scenes) ? script.scenes : [];

  const fallbackByType = new Map(DEFAULT_VIDEO_SCRIPT.scenes.map((scene) => [scene.type, scene]));
  const usedIndexes = new Set<number>();

  const scenes = VIDEO_SCENE_ORDER.map((sceneType, index) => {
    const fallbackScene = fallbackByType.get(sceneType) ?? DEFAULT_VIDEO_SCRIPT.scenes[index];
    const byType = matchSceneByType(sourceScenes, sceneType, usedIndexes);

    let source = byType;
    if (!source && index < sourceScenes.length) {
      const candidate = sourceScenes[index];
      if (typeof candidate === "object" && candidate !== null) {
        usedIndexes.add(index);
        source = candidate as unknown as Record<string, unknown>;
      }
    }

    return coerceScene(source ?? {}, fallbackScene, index);
  });

  return {
    meta: normalizeMeta(script?.meta, scenes),
    scenes,
  };
}

export function assertVideoScriptSchema(script: Partial<VideoScript> | null | undefined) {
  assertSchemaVersion(script);
}
