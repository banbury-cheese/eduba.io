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
const CANVAS_HEIGHT = 246;
const NODE_WIDTH = 182;
const NODE_HEIGHT = 86;
const NODE_GAP = 20;

function nodeStartX(count: number) {
  const occupied = count * NODE_WIDTH + (count - 1) * NODE_GAP;
  return Math.max(10, (CANVAS_WIDTH - occupied) / 2);
}

function buildNodes(visualization: FlowVisualization): Node[] {
  const safeNodes = visualization.nodes.slice(0, 4);
  const startX = nodeStartX(safeNodes.length);

  return safeNodes.map((node, index) => ({
    id: node.id,
    type: "default",
    position: {
      x: startX + index * (NODE_WIDTH + NODE_GAP),
      y: 78,
    },
    data: {
      label: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <strong
            style={{
              fontSize: 19,
              lineHeight: 1.06,
              color: EDUBA_COLORS.text,
              textWrap: "balance",
            }}
          >
            {node.label}
          </strong>
          {node.detail ? (
            <span
              style={{
                fontSize: 13,
                lineHeight: 1.16,
                color: EDUBA_COLORS.textMuted,
                textWrap: "balance",
              }}
            >
              {node.detail}
            </span>
          ) : null}
        </div>
      ),
    },
    draggable: false,
    selectable: false,
    style: {
      borderRadius: 14,
      border: `1px solid ${EDUBA_COLORS.line}`,
      background: "rgba(254, 251, 246, 0.92)",
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      boxShadow: "none",
      padding: "10px 12px",
      overflow: "hidden",
    },
  }));
}

function buildEdges(visualization: FlowVisualization): Edge[] {
  return visualization.edges.slice(0, 6).map((edge, index) => ({
    id: edge.id || `${visualization.componentId}-edge-${index + 1}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: EDUBA_COLORS.accentA,
      width: 14,
      height: 14,
    },
    style: {
      stroke: EDUBA_COLORS.accentA,
      strokeWidth: 2.4,
    },
    labelStyle: {
      fill: EDUBA_COLORS.text,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    },
  }));
}

export function FlowPipeline({ visualization }: { visualization: FlowVisualization }) {
  const nodes = useMemo(() => buildNodes(visualization), [visualization]);
  const edges = useMemo(() => buildEdges(visualization), [visualization]);

  return (
    <div
      style={{
        width: "100%",
        height: CANVAS_HEIGHT,
        borderRadius: 10,
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
            style={{ background: "transparent" }}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
