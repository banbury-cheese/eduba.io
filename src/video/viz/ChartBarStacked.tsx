import { BarChart } from "@mui/x-charts/BarChart";
import type { BarVisualization } from "@/lib/videoTypes";
import { yAxisConfig, yAxisFormatter } from "@/video/viz/chartUtils";
import { CHART_PALETTE, EDUBA_COLORS, formatQualitative } from "@/video/viz/styles";

export function ChartBarStacked({ visualization }: { visualization: BarVisualization }) {
  const yAxis = yAxisConfig(visualization.valueMode);
  const categories = visualization.categories.slice(0, 4);
  const series = visualization.series
    .slice(0, 3)
    .map((item) => ({
      ...item,
      values: item.values.slice(0, categories.length),
      rawValues: item.rawValues?.slice(0, categories.length),
    }));

  return (
    <BarChart
      height={300}
      xAxis={[
        {
          scaleType: "band",
          data: categories,
          tickLabelStyle: {
            fontSize: 12,
            fill: EDUBA_COLORS.text,
            fontFamily: "IBM Plex Mono, monospace",
            letterSpacing: "0.04em",
          },
        },
      ]}
      yAxis={[
        {
          min: yAxis.min,
          max: yAxis.max,
          tickNumber: yAxis.tickNumber,
          valueFormatter: (value: number | null) =>
            yAxisFormatter(Number(value), visualization.valueMode),
          tickLabelStyle: {
            fontSize: 12,
            fill: EDUBA_COLORS.textMuted,
            fontFamily: "IBM Plex Mono, monospace",
          },
        },
      ]}
      grid={{ horizontal: true }}
      series={series.map((seriesItem, index) => ({
        data: seriesItem.values,
        label: seriesItem.label,
        stack: "total",
        color: seriesItem.color || CHART_PALETTE[index % CHART_PALETTE.length],
        valueFormatter: (value: number | null) => {
          const safe = Number(value ?? 0);
          if (visualization.valueMode === "qualitative") {
            return formatQualitative(safe);
          }
          return `${safe}`;
        },
      }))}
      margin={{ top: 24, right: 24, bottom: 48, left: 52 }}
      hideLegend={series.length <= 1}
      sx={{
        ".MuiChartsGrid-line": {
          stroke: EDUBA_COLORS.line,
          strokeDasharray: "4 4",
        },
        ".MuiBarElement-root": {
          rx: 4,
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
