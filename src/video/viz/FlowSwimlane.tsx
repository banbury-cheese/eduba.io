import { useMemo } from "react";
import {
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "@xyflow/react";
import type { FlowVisualization } from "@/lib/videoTypes";
import { EDUBA_COLORS } from "@/video/viz/styles";

const CANVAS_WIDTH = 920;
const NODE_WIDTH = 176;
const NODE_GAP = 20;

function buildLaneIndex(visualization: FlowVisualization) {
  const explicit = visualization.laneLabels ?? [];
  const inferred = visualization.nodes
    .map((node) => node.lane?.trim())
    .filter((lane): lane is string => Boolean(lane));
  const lanes = explicit.length > 0 ? explicit : [...new Set(inferred)];
  return lanes.slice(0, 3);
}

function nodeStartX(count: number) {
  const occupied = count * NODE_WIDTH + (count - 1) * NODE_GAP;
  return Math.max(10, (CANVAS_WIDTH - occupied) / 2);
}

function buildNodes(visualization: FlowVisualization, flowHeight: number): Node[] {
  const lanes = buildLaneIndex(visualization);
  const safeNodes = visualization.nodes.slice(0, 4);
  const laneCount = Math.max(lanes.length, 1);
  const nodeHeight = laneCount >= 3 ? 62 : 74;
  const laneTop = 16;
  const laneBottom = flowHeight - nodeHeight - 16;
  const laneGap = laneCount > 1 ? (laneBottom - laneTop) / (laneCount - 1) : 0;
  const startX = nodeStartX(safeNodes.length);

  return safeNodes.map((node, index) => {
    const lane = node.lane ?? lanes[index % Math.max(lanes.length, 1)] ?? "Lane";
    const laneIndex = Math.max(lanes.indexOf(lane), 0);
    const y = laneCount === 1 ? (flowHeight - nodeHeight) / 2 : laneTop + laneIndex * laneGap;

    return {
      id: node.id,
      type: "default",
      position: {
        x: startX + index * (NODE_WIDTH + NODE_GAP),
        y,
      },
      draggable: false,
      selectable: false,
      data: {
        label: (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: 10,
                color: EDUBA_COLORS.textMuted,
              }}
            >
              {lane}
            </span>
            <strong style={{ fontSize: 18, lineHeight: 1.08, color: EDUBA_COLORS.text }}>
              {node.label}
            </strong>
            {node.detail ? (
              <span style={{ fontSize: 11, lineHeight: 1.15, color: EDUBA_COLORS.textMuted }}>
                {node.detail}
              </span>
            ) : null}
          </div>
        ),
      },
      style: {
        borderRadius: 12,
        border: `1px solid ${EDUBA_COLORS.line}`,
        background: "rgba(254,251,246,0.88)",
        width: NODE_WIDTH,
        height: nodeHeight,
        padding: "10px 12px",
        overflow: "hidden",
      },
    };
  });
}

function buildEdges(visualization: FlowVisualization): Edge[] {
  return visualization.edges.slice(0, 6).map((edge, index) => ({
    id: edge.id || `${visualization.componentId}-edge-${index + 1}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: "smoothstep",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: EDUBA_COLORS.accentA,
    },
    style: {
      strokeWidth: 2.1,
      stroke: EDUBA_COLORS.accentA,
    },
    labelStyle: {
      fill: EDUBA_COLORS.text,
      fontSize: 11,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  }));
}

export function FlowSwimlane({ visualization }: { visualization: FlowVisualization }) {
  const lanes = useMemo(() => buildLaneIndex(visualization), [visualization]);
  const flowHeight = useMemo(() => {
    const laneCount = Math.max(lanes.length, 1);
    return Math.min(280, Math.max(184, laneCount * 72 + 62));
  }, [lanes.length]);

  const nodes = useMemo(() => buildNodes(visualization, flowHeight), [visualization, flowHeight]);
  const edges = useMemo(() => buildEdges(visualization), [visualization]);

  return (
    <div
      style={{
        width: "100%",
        height: flowHeight + (lanes.length > 1 ? 48 : 0),
        borderRadius: 10,
        border: `1px dashed ${EDUBA_COLORS.line}`,
      }}
    >
      {lanes.length > 1 ? (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "6px 8px",
            borderBottom: `1px dashed ${EDUBA_COLORS.line}`,
            background: "rgba(254,251,246,0.64)",
          }}
        >
          {lanes.map((lane) => (
            <span
              key={lane}
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: EDUBA_COLORS.text,
                border: `1px solid ${EDUBA_COLORS.line}`,
                borderRadius: 999,
                padding: "3px 8px",
                background: "rgba(249,236,223,0.9)",
              }}
            >
              {lane}
            </span>
          ))}
        </div>
      ) : null}
      <div style={{ width: "100%", height: flowHeight, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: CANVAS_WIDTH,
            height: "100%",
            background: "rgba(249,236,223,0.46)",
          }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView={false}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={false}
              zoomOnPinch={false}
              zoomOnScroll={false}
              preventScrolling={false}
              style={{ background: "transparent" }}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
