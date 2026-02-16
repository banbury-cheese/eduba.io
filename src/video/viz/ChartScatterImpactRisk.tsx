import { ScatterChart } from "@mui/x-charts/ScatterChart";
import type { ScatterVisualization } from "@/lib/videoTypes";
import { CHART_PALETTE, EDUBA_COLORS, formatQualitative } from "@/video/viz/styles";

export function ChartScatterImpactRisk({ visualization }: { visualization: ScatterVisualization }) {
  const points = visualization.points.slice(0, 3);
  const orderedPoints = [...points].sort((a, b) => b.x - b.y - (a.x - a.y));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14, alignItems: "stretch" }}>
      <ScatterChart
        height={296}
        xAxis={[
          {
            min: 1,
            max: 5,
            label: visualization.xLabel || "Impact",
            tickNumber: 5,
            valueFormatter: (value: number | null) =>
              visualization.valueMode === "qualitative"
                ? formatQualitative(Number(value))
                : `${value}`,
            tickLabelStyle: {
              fontSize: 12,
              fill: EDUBA_COLORS.text,
              fontFamily: "IBM Plex Mono, monospace",
            },
            labelStyle: {
              fontFamily: "IBM Plex Mono, monospace",
              fill: EDUBA_COLORS.text,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            },
          },
        ]}
        yAxis={[
          {
            min: 1,
            max: 5,
            label: visualization.yLabel || "Risk",
            tickNumber: 5,
            valueFormatter: (value: number | null) =>
              visualization.valueMode === "qualitative"
                ? formatQualitative(Number(value))
                : `${value}`,
            tickLabelStyle: {
              fontSize: 12,
              fill: EDUBA_COLORS.textMuted,
              fontFamily: "IBM Plex Mono, monospace",
            },
            labelStyle: {
              fontFamily: "IBM Plex Mono, monospace",
              fill: EDUBA_COLORS.textMuted,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            },
          },
        ]}
        margin={{ top: 20, right: 22, bottom: 44, left: 54 }}
        series={[
          {
            data: points.map((point, index) => ({
              id: point.id,
              x: point.x,
              y: point.y,
              z: point.size ?? 14 + index * 2,
            })),
            valueFormatter: (item) => {
              const point = points.find((candidate) => candidate.id === item?.id);
              if (!point) {
                return "";
              }
              if (visualization.valueMode === "qualitative") {
                return `${point.label}: ${formatQualitative(point.x, point.rawX)} / ${formatQualitative(
                  point.y,
                  point.rawY
                )}`;
              }
              return `${point.label}: ${point.x}, ${point.y}`;
            },
            color: CHART_PALETTE[0],
          },
        ]}
        hideLegend
        sx={{
          ".MuiChartsAxis-line, .MuiChartsAxis-tick": {
            stroke: EDUBA_COLORS.line,
          },
          ".MuiChartsGrid-line": {
            stroke: EDUBA_COLORS.line,
            strokeDasharray: "4 4",
          },
          ".MuiMarkElement-root": {
            stroke: EDUBA_COLORS.white,
            strokeWidth: 2,
          },
        }}
      />
      <div
        style={{
          border: `1px dashed ${EDUBA_COLORS.line}`,
          borderRadius: 8,
          background: "rgba(254,251,246,0.68)",
          padding: "12px 12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {orderedPoints.map((point, index) => (
          <div
            key={point.id}
            style={{
              borderTop: index === 0 ? "none" : `1px dashed ${EDUBA_COLORS.line}`,
              paddingTop: index === 0 ? 0 : 8,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "Diatype, sans-serif",
                fontSize: 17,
                lineHeight: 1.1,
                color: EDUBA_COLORS.text,
                fontWeight: 700,
                textWrap: "balance",
              }}
            >
              {point.label}
            </span>
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: EDUBA_COLORS.textMuted,
              }}
            >
              {`impact ${formatQualitative(point.x, point.rawX)} / risk ${formatQualitative(
                point.y,
                point.rawY
              )}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
