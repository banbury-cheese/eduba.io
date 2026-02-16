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
const CANVAS_HEIGHT = 236;
const NODE_WIDTH = 176;
const NODE_HEIGHT = 80;
const NODE_GAP = 20;

function nodeStartX(count: number) {
  const occupied = count * NODE_WIDTH + (count - 1) * NODE_GAP;
  return Math.max(8, (CANVAS_WIDTH - occupied) / 2);
}

function buildNodes(visualization: FlowVisualization): Node[] {
  const safeNodes = visualization.nodes.slice(0, 4);
  const startX = nodeStartX(safeNodes.length);

  return safeNodes.map((node, index) => {
    const x = startX + index * (NODE_WIDTH + NODE_GAP);
    const y = 72;

    return {
      id: node.id,
      type: "default",
      position: { x, y },
      draggable: false,
      selectable: false,
      data: {
        label: (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "center" }}>
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
        borderRadius: 999,
        border: `1px solid ${EDUBA_COLORS.line}`,
        background: "rgba(254,251,246,0.92)",
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        display: "grid",
        placeItems: "center",
        padding: "10px 12px",
        overflow: "hidden",
      },
    };
  });
}

function buildEdges(visualization: FlowVisualization, nodeIds: string[]): Edge[] {
  const fallbackEdges = nodeIds.map((id, index) => ({
    id: `${visualization.componentId}-edge-${index + 1}`,
    source: id,
    target: nodeIds[(index + 1) % nodeIds.length] || id,
    label: "",
  }));

  const inputEdges = visualization.edges.length > 0 ? [...visualization.edges] : fallbackEdges;

  if (nodeIds.length > 2) {
    const first = nodeIds[0];
    const last = nodeIds[nodeIds.length - 1];
    const hasClosing = inputEdges.some((edge) => edge.source === last && edge.target === first);
    if (!hasClosing) {
      inputEdges.push({
        id: `${visualization.componentId}-closing`,
        source: last,
        target: first,
        label: "",
      });
    }
  }

  return inputEdges.slice(0, 6).map((edge, index) => ({
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
      strokeWidth: 2.2,
      stroke: EDUBA_COLORS.accentA,
    },
    labelStyle: {
      fill: EDUBA_COLORS.text,
      fontSize: 11,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
  }));
}

export function FlowCycle({ visualization }: { visualization: FlowVisualization }) {
  const nodes = useMemo(() => buildNodes(visualization), [visualization]);
  const edges = useMemo(
    () =>
      buildEdges(
        visualization,
        nodes.map((node) => node.id)
      ).map((edge) => ({
        ...edge,
        type: "default",
        animated: false,
        label: "",
      })),
    [visualization, nodes]
  );

  return (
    <div
      style={{
        width: "100%",
        height: CANVAS_HEIGHT,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: CANVAS_WIDTH,
          height: "100%",
          borderRadius: 10,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(254,251,246,0.52) 0%, rgba(249,236,223,0.48) 100%)",
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
            style={{ background: "rgba(249,236,223,0.58)" }}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
