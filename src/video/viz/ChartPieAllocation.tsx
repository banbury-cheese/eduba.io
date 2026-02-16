import { PieChart } from "@mui/x-charts/PieChart";
import type { PieVisualization } from "@/lib/videoTypes";
import { CHART_PALETTE, EDUBA_COLORS, formatQualitative } from "@/video/viz/styles";

export function ChartPieAllocation({ visualization }: { visualization: PieVisualization }) {
  const slices = visualization.slices.slice(0, 4);

  return (
    <PieChart
      height={296}
      margin={{ top: 22, right: 22, bottom: 18, left: 22 }}
      series={[
        {
          data: slices.map((slice, index) => ({
            id: slice.id,
            label: slice.label,
            value: slice.value,
            color: slice.color || CHART_PALETTE[index % CHART_PALETTE.length],
          })),
          paddingAngle: 2,
          cornerRadius: 3,
          innerRadius: 56,
          outerRadius: 102,
          arcLabel: (item) => {
            if (visualization.valueMode === "qualitative") {
              const raw = slices.find((slice) => slice.id === item.id)?.rawValue;
              return formatQualitative(item.value, raw);
            }
            return `${Math.round(item.value)}`;
          },
          valueFormatter: (item) => {
            if (visualization.valueMode === "qualitative") {
              const raw = slices.find((slice) => slice.id === item.id)?.rawValue;
              return `${item.label}: ${formatQualitative(item.value, raw)}`;
            }
            return `${item.label}: ${item.value}`;
          },
        },
      ]}
      hideLegend={slices.length <= 2}
      sx={{
        ".MuiPieArcLabel-root": {
          fill: EDUBA_COLORS.white,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 11,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        },
        ".MuiChartsLegend-series text": {
          fill: EDUBA_COLORS.text,
          fontSize: 11,
          fontFamily: "IBM Plex Mono, monospace",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      }}
    />
  );
}
