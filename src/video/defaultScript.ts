import type { VideoScript } from "@/lib/videoTypes";

export const DEFAULT_VIDEO_SCRIPT: VideoScript = {
  meta: {
    schemaVersion: 2,
    title: "Eduba Sector Video",
    slug: "eduba-sector-video",
    company: "Eduba",
    sector: "Enterprise",
    template: "eduba-core-v1",
    aspectRatio: "16:9",
    durationSec: 72,
    ctaText: "LET'S TALK",
    voiceoverEnabled: true,
    illustrationStyle: "eduba editorial diagrams",
  },
  scenes: [
    {
      id: "scene-hero",
      type: "hero",
      durationSec: 10,
      headline: "Enterprise AI, minus the theater.",
      subcopy:
        "We ship working pipelines, not decks. Your team keeps the IP, capability, and operating rhythm.",
      voiceoverScript:
        "Most teams do not need another AI deck. They need a working pipeline with measurable impact. Eduba helps you ship production AI while your team keeps the capability and IP.",
      layoutVariant: "focus",
      illustrationPrompt:
        "A controlled command center where people, systems, and approvals converge into one measurable flow.",
      visualization: {
        componentId: "chart.kpi.cards",
        title: "Signal to value",
        caption: "Source context to measurable decision support.",
        valueMode: "qualitative",
        items: [
          {
            id: "hero-kpi-1",
            label: "Decision confidence",
            value: "High",
            delta: "human-in-loop",
            trend: "up",
          },
          {
            id: "hero-kpi-2",
            label: "Adoption readiness",
            value: "Strong",
            delta: "governance built in",
            trend: "up",
          },
          {
            id: "hero-kpi-3",
            label: "Execution risk",
            value: "Controlled",
            delta: "evaluation harness",
            trend: "flat",
          },
        ],
      },
      bullets: [],
      cards: [],
    },
    {
      id: "scene-consulting",
      type: "consulting",
      durationSec: 9,
      headline: "Your enterprise orchestration partner",
      subcopy:
        "From scattered experiments to reliable workflows with governance and handover built in.",
      voiceoverScript:
        "We convert scattered model use into a governed operating system. We connect tools, data, and decision points so teams can run, extend, and trust what ships.",
      layoutVariant: "split",
      illustrationPrompt:
        "A layered process map showing software, model, and approval lanes joining into one operational stream.",
      visualization: {
        componentId: "flow.swimlane",
        title: "Operating lanes",
        caption: "People, models, and controls stay synchronized in one pipeline.",
        laneLabels: ["Business", "Model Ops", "Governance"],
        nodes: [
          {
            id: "consulting-node-1",
            label: "Opportunity signal",
            detail: "Use-case intake + constraints",
            lane: "Business",
          },
          {
            id: "consulting-node-2",
            label: "Model orchestration",
            detail: "Prompting + fallback policy",
            lane: "Model Ops",
          },
          {
            id: "consulting-node-3",
            label: "Human review",
            detail: "Approval and exceptions",
            lane: "Governance",
          },
          {
            id: "consulting-node-4",
            label: "Operational release",
            detail: "Measured rollout",
            lane: "Business",
          },
        ],
        edges: [
          {
            id: "consulting-edge-1",
            source: "consulting-node-1",
            target: "consulting-node-2",
            label: "handoff",
          },
          {
            id: "consulting-edge-2",
            source: "consulting-node-2",
            target: "consulting-node-3",
            label: "guardrail",
          },
          {
            id: "consulting-edge-3",
            source: "consulting-node-3",
            target: "consulting-node-4",
            label: "go-live",
          },
        ],
      },
      bullets: [
        "Orchestration over tool sprawl",
        "Adoption and governance from day one",
        "Reliability across multiple models",
      ],
      cards: [],
    },
    {
      id: "scene-why-us",
      type: "why-us",
      durationSec: 9,
      headline: "Why companies choose Eduba",
      subcopy: "Truth over hype, POCs over slides, and faster executive decisions.",
      voiceoverScript:
        "Our approach is practical. We prioritize real outcomes, validated reliability, and clear executive decisions. That is why teams move from pilot to adoption faster.",
      layoutVariant: "stacked",
      illustrationPrompt:
        "A decision matrix balancing ROI, risk, and feasibility with clear recommendation zones.",
      visualization: {
        componentId: "chart.scatter.impactRisk",
        title: "Outcome confidence map",
        caption: "Higher impact and lower risk opportunities are prioritized first.",
        valueMode: "qualitative",
        xLabel: "Impact",
        yLabel: "Operational risk",
        points: [
          {
            id: "why-us-point-1",
            label: "Truth over hype",
            x: 4,
            y: 2,
            rawX: "high",
            rawY: "low",
            size: 16,
          },
          {
            id: "why-us-point-2",
            label: "Working POCs",
            x: 5,
            y: 2,
            rawX: "very high",
            rawY: "low",
            size: 18,
          },
          {
            id: "why-us-point-3",
            label: "Capability transfer",
            x: 4,
            y: 3,
            rawX: "high",
            rawY: "medium",
            size: 15,
          },
        ],
      },
      bullets: [
        "Working POCs over PowerPoints",
        "Governance and evaluation built in",
        "Capability transfer keeps knowledge internal",
      ],
      cards: [],
    },
    {
      id: "scene-services",
      type: "services",
      durationSec: 9,
      headline: "Services built for production",
      subcopy:
        "Advisory, capability workshops, and rapid prototypes that become operational systems.",
      voiceoverScript:
        "We offer advisory sprints, capability workshops, and rapid prototyping for real operations. Every service is designed to move toward production and internal ownership.",
      layoutVariant: "cards-first",
      illustrationPrompt:
        "Service modules connected to delivery checkpoints and accountable owners.",
      visualization: {
        componentId: "chart.bar.stacked",
        title: "Service contribution mix",
        caption: "Each service contributes to speed, governance, and capability transfer.",
        valueMode: "qualitative",
        categories: ["Advisory", "Workshops", "Prototype", "Orchestration"],
        series: [
          {
            id: "services-series-speed",
            label: "Speed-to-value",
            values: [4, 3, 5, 4],
            rawValues: ["high", "medium", "very high", "high"],
          },
          {
            id: "services-series-governance",
            label: "Governance confidence",
            values: [3, 4, 4, 5],
            rawValues: ["medium", "high", "high", "very high"],
          },
          {
            id: "services-series-transfer",
            label: "Capability transfer",
            values: [3, 5, 4, 5],
            rawValues: ["medium", "very high", "high", "very high"],
          },
        ],
      },
      bullets: [],
      cards: [
        { title: "Advisory", text: "Opportunity map and first use-case plan" },
        { title: "Prototype", text: "Production-minded POC in weeks" },
        { title: "Orchestration", text: "Scale with governance and handover" },
      ],
    },
    {
      id: "scene-methodology",
      type: "methodology",
      durationSec: 9,
      headline: "A no-nonsense delivery methodology",
      subcopy:
        "Discover, triage, build, pilot, orchestrate, and hand over for scale.",
      voiceoverScript:
        "Execution follows a clear sequence: discovery, triage, build, pilot, orchestration, and handover. This keeps risk controlled and delivery momentum high.",
      layoutVariant: "split",
      illustrationPrompt:
        "A six-stage timeline with checkpoints and measurable readiness gates.",
      visualization: {
        componentId: "chart.line.timeline",
        title: "Execution rhythm",
        caption: "Readiness and confidence climb as the pipeline matures.",
        valueMode: "qualitative",
        categories: ["Discover", "Triage", "Build", "Pilot", "Orchestrate", "Scale"],
        series: [
          {
            id: "method-series-readiness",
            label: "Delivery readiness",
            values: [1, 2, 3, 4, 4, 5],
            rawValues: ["low", "medium", "medium", "high", "high", "very high"],
          },
          {
            id: "method-series-confidence",
            label: "Executive confidence",
            values: [1, 2, 2, 3, 4, 5],
            rawValues: ["low", "medium", "medium", "medium", "high", "very high"],
          },
        ],
      },
      bullets: [
        "Discovery and opportunity triage",
        "Build with evaluation from day one",
        "Pilot, orchestrate, and scale with runbooks",
      ],
      cards: [],
    },
    {
      id: "scene-choice",
      type: "choice",
      durationSec: 8,
      headline: "Engagement model that fits your team",
      subcopy:
        "Choose advisory, co-build squad, or project delivery with adoption baked in.",
      voiceoverScript:
        "You can engage through advisory, co-build, or project delivery. Each option keeps your team involved so capability and control stay in-house.",
      layoutVariant: "cards-first",
      illustrationPrompt:
        "Three parallel engagement lanes with ownership intensity and speed indicators.",
      visualization: {
        componentId: "chart.bar.comparison",
        title: "Engagement tradeoffs",
        caption: "Compare speed, ownership, and internal lift across engagement models.",
        valueMode: "qualitative",
        categories: ["Advisory", "Co-build", "Project"],
        series: [
          {
            id: "choice-series-speed",
            label: "Speed",
            values: [3, 4, 5],
            rawValues: ["medium", "high", "very high"],
          },
          {
            id: "choice-series-control",
            label: "Internal control",
            values: [5, 4, 3],
            rawValues: ["very high", "high", "medium"],
          },
          {
            id: "choice-series-transfer",
            label: "Capability transfer",
            values: [4, 5, 3],
            rawValues: ["high", "very high", "medium"],
          },
        ],
      },
      bullets: [],
      cards: [
        { title: "Advisory sprint", text: "Fixed-scope clarity and risk map" },
        { title: "Co-build squad", text: "Ship with your team in 4-6 weeks" },
        { title: "Project-based", text: "End-to-end delivery with handover" },
      ],
    },
    {
      id: "scene-faq",
      type: "faq",
      durationSec: 8,
      headline: "Questions leaders ask before committing",
      subcopy: "Security, ROI proof, adoption, and long-term maintainability.",
      voiceoverScript:
        "Common questions are security, ROI, and long-term ownership. Our process is designed to answer each with measurable evidence, not assumptions.",
      layoutVariant: "split",
      illustrationPrompt:
        "A structured FAQ stack with compliance, ROI, and ownership checkpoints.",
      visualization: {
        componentId: "chart.kpi.cards",
        title: "Objection coverage",
        caption: "Security, value proof, and maintainability are answered early.",
        valueMode: "qualitative",
        items: [
          {
            id: "faq-kpi-1",
            label: "Security posture",
            value: "Audit-ready",
            delta: "RBAC + trails",
            trend: "up",
          },
          {
            id: "faq-kpi-2",
            label: "ROI proof",
            value: "Measurable",
            delta: "tracked each cohort",
            trend: "up",
          },
          {
            id: "faq-kpi-3",
            label: "Maintainability",
            value: "In-house",
            delta: "handover + runbooks",
            trend: "up",
          },
        ],
      },
      bullets: [
        "How do we choose the first use case?",
        "How do we handle security and compliance?",
        "Can internal teams maintain this after handover?",
      ],
      cards: [],
    },
    {
      id: "scene-cta",
      type: "cta",
      durationSec: 10,
      headline: "Book a no-obligation consultation.",
      subcopy: "Define your highest-impact first use case with Eduba.",
      voiceoverScript:
        "If you want a practical AI program that ships and scales, book a no-obligation consultation. We will map your first high-impact use case and execution path.",
      layoutVariant: "focus",
      illustrationPrompt:
        "A launch board showing approved roadmap, owners, and measurable outcomes.",
      visualization: {
        componentId: "flow.cycle",
        title: "Scale loop",
        caption: "Pilot, measure, expand, and operationalize.",
        nodes: [
          { id: "cta-node-1", label: "Pilot", detail: "target one workflow" },
          { id: "cta-node-2", label: "Measure", detail: "prove ROI and risk" },
          { id: "cta-node-3", label: "Expand", detail: "roll out to adjacent teams" },
          {
            id: "cta-node-4",
            label: "Operationalize",
            detail: "handover and internal ownership",
          },
        ],
        edges: [
          { id: "cta-edge-1", source: "cta-node-1", target: "cta-node-2" },
          { id: "cta-edge-2", source: "cta-node-2", target: "cta-node-3" },
          { id: "cta-edge-3", source: "cta-node-3", target: "cta-node-4" },
          { id: "cta-edge-4", source: "cta-node-4", target: "cta-node-1" },
        ],
      },
      bullets: [],
      cards: [],
    },
  ],
};
