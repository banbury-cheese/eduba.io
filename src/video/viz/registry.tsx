import type { SceneVisualization } from "@/lib/videoTypes";
import { ChartBarComparison } from "@/video/viz/ChartBarComparison";
import { ChartBarStacked } from "@/video/viz/ChartBarStacked";
import { ChartKpiCards } from "@/video/viz/ChartKpiCards";
import { ChartLineTimeline } from "@/video/viz/ChartLineTimeline";
import { ChartPieAllocation } from "@/video/viz/ChartPieAllocation";
import { ChartScatterImpactRisk } from "@/video/viz/ChartScatterImpactRisk";
import { FlowCycle } from "@/video/viz/FlowCycle";
import { FlowPipeline } from "@/video/viz/FlowPipeline";
import { FlowSwimlane } from "@/video/viz/FlowSwimlane";

export function VisualizationRenderer({ visualization }: { visualization: SceneVisualization }) {
  switch (visualization.componentId) {
    case "flow.pipeline":
      return <FlowPipeline visualization={visualization} />;
    case "flow.swimlane":
      return <FlowSwimlane visualization={visualization} />;
    case "flow.cycle":
      return <FlowCycle visualization={visualization} />;
    case "chart.bar.comparison":
      return <ChartBarComparison visualization={visualization} />;
    case "chart.bar.stacked":
      return <ChartBarStacked visualization={visualization} />;
    case "chart.line.timeline":
      return <ChartLineTimeline visualization={visualization} />;
    case "chart.pie.allocation":
      return <ChartPieAllocation visualization={visualization} />;
    case "chart.scatter.impactRisk":
      return <ChartScatterImpactRisk visualization={visualization} />;
    case "chart.kpi.cards":
    default:
      return <ChartKpiCards visualization={visualization} />;
  }
}
