// Theme-aware Recharts styling. The values are CSS variables defined in
// styles.css (:root for light, .dark for dark), so charts recolor instantly
// when the theme toggles — never hardcode chart chrome colors in routes.

export const chartTooltipStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid var(--chart-tooltip-border)",
  backgroundColor: "var(--chart-tooltip-bg)",
  color: "var(--chart-tooltip-fg)",
  fontSize: 12,
  backdropFilter: "blur(8px)",
};

/** Stroke for CartesianGrid lines. */
export const CHART_GRID = "var(--chart-grid)";

/** Stroke for XAxis / YAxis text and ticks. */
export const CHART_AXIS = "var(--chart-axis)";

/** Contrasting outline for line-chart dots (page background color). */
export const CHART_DOT_STROKE = "var(--chart-dot-stroke)";
