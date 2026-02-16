export const EDUBA_COLORS = {
  background: "#f9ecdf",
  panel: "#ebdfd2",
  panelSoft: "#f4e8dc",
  text: "#5d3136",
  textMuted: "#7d5658",
  line: "rgba(93, 49, 54, 0.28)",
  accentA: "#6b393f",
  accentB: "#916669",
  accentC: "#b78f90",
  white: "#fefbf6",
};

export const CHART_PALETTE = [
  "#5d3136",
  "#916669",
  "#b78f90",
  "#7d5658",
  "#4a0a11",
  "#a2777a",
];

export const QUALITATIVE_LABELS: Record<number, string> = {
  1: "very low",
  2: "low",
  3: "medium",
  4: "high",
  5: "very high",
};

export function formatQualitative(value: number, raw?: string) {
  if (raw) {
    return raw;
  }
  const rounded = Math.max(1, Math.min(5, Math.round(value)));
  return QUALITATIVE_LABELS[rounded] ?? String(value);
}
