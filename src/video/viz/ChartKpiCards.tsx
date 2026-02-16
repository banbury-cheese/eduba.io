import { Box, Card, CardContent, Typography } from "@mui/material";
import type { KpiVisualization } from "@/lib/videoTypes";
import { EDUBA_COLORS } from "@/video/viz/styles";

function trendColor(trend: "up" | "down" | "flat" | undefined) {
  if (trend === "up") {
    return "#2f7a46";
  }
  if (trend === "down") {
    return "#9b2f33";
  }
  return EDUBA_COLORS.textMuted;
}

function trendSymbol(trend: "up" | "down" | "flat" | undefined) {
  if (trend === "up") {
    return "^";
  }
  if (trend === "down") {
    return "v";
  }
  return "->";
}

export function ChartKpiCards({ visualization }: { visualization: KpiVisualization }) {
  const items = visualization.items.slice(0, 3);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`,
        gap: 1.25,
        minHeight: 264,
      }}
    >
      {items.map((item) => (
        <Card
          key={item.id}
          variant="outlined"
          sx={{
            borderColor: EDUBA_COLORS.line,
            backgroundColor: "rgba(254, 251, 246, 0.84)",
            borderRadius: 1,
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: 1.7 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 10,
                color: EDUBA_COLORS.textMuted,
                letterSpacing: "0.09em",
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                marginTop: 1,
                color: EDUBA_COLORS.text,
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1,
                fontFamily: "Diatype, sans-serif",
              }}
            >
              {item.value}
            </Typography>
            {item.delta ? (
              <Typography
                sx={{
                  marginTop: 0.8,
                  color: trendColor(item.trend),
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono, monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {`${trendSymbol(item.trend)} ${item.delta}`}
              </Typography>
            ) : null}
            {item.detail ? (
              <Typography
                sx={{
                  marginTop: 1,
                  color: EDUBA_COLORS.textMuted,
                  fontSize: 14,
                  lineHeight: 1.28,
                }}
              >
                {item.detail}
              </Typography>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
