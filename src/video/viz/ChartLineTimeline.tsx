import { LineChart } from "@mui/x-charts/LineChart";
import type { LineVisualization } from "@/lib/videoTypes";
import { yAxisConfig, yAxisFormatter } from "@/video/viz/chartUtils";
import { CHART_PALETTE, EDUBA_COLORS, formatQualitative } from "@/video/viz/styles";

export function ChartLineTimeline({ visualization }: { visualization: LineVisualization }) {
  const yAxis = yAxisConfig(visualization.valueMode);
  const categories = visualization.categories.slice(0, 6);
  const series = visualization.series
    .slice(0, 2)
    .map((item) => ({
      ...item,
      values: item.values.slice(0, categories.length),
      rawValues: item.rawValues?.slice(0, categories.length),
    }));

  return (
    <LineChart
      height={298}
      xAxis={[
        {
          scaleType: "point",
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
        color: seriesItem.color || CHART_PALETTE[index % CHART_PALETTE.length],
        curve: "monotoneX",
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
