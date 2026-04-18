export const layoutContent = {
  logoText: "THE FACES OF INTERFACE",
  topNav: {
    readingsLabel: "Readings",
    readingsHref: "https://jakevanclief.substack.com/",
    chaptersLabel: "Clief Notes",
    chaptersHref:
      "https://www.skool.com/quantum-quill-lyceum-1116/about?ref=74977a0154074322bd5d66df96d42a5f",
    primaryCtaLabel: "info@eduba.io",
    primaryCtaHref: "mailto:info@eduba.io",
  },
  bottomNav: {
    bookCallTitle: "START A CONVERSATION",
    bookCallSubtitle: "info@eduba.io",
    bookCallHref: "mailto:info@eduba.io",
    secondaryCtaLabel: "EMAIL US",
    secondaryCtaHref: "mailto:info@eduba.io",
  },
} as const;

export const heroContent = {
  readings: [
    {
      title: "The Foundation",
      href: "https://www.skool.com/quantum-quill-lyceum-1116/classroom/036893d9?md=5d535542a72d417e8635b80e56412558",
    },
    {
      title: "The Archive",
      href: "https://www.skool.com/quantum-quill-lyceum-1116/classroom/d7ae60cf?md=fe4ef81a2ab84085a85abb15f0e86bb0",
    },
    {
      title: "Implementation Playbooks",
      href: "https://www.skool.com/quantum-quill-lyceum-1116/classroom/d3907117?md=f7a33a9888604a08a7e48bb876682691",
    },
    {
      title: "Building Your Stack",
      href: "https://www.skool.com/quantum-quill-lyceum-1116/classroom/2a86a1d1?md=c7a59d0fa0c145549dc9126470b7f82f",
    },
    {
      title: "The Vault",
      href: "https://www.skool.com/quantum-quill-lyceum-1116/classroom/7634b927?md=a7c8cac8330b4270bda9a02e75bdcdcf",
    },
  ],
  resourcesLabel: "Resources",
  resources: [
    {
      title: "Scribe",
      href: "https://chat.eduba.io/",
      icon: "scribe",
    },
    {
      title: "Study-Arcade",
      href: "https://study-arcade.itskay.co/",
      icon: "studyArcade",
    },
    {
      title: "Vox-Meet",
      href: "",
      icon: "voxMeet",
      comingSoon: true,
    },
    {
      title: "Clief-Notes",
      href: "https://www.skool.com/quantum-quill-lyceum-1116/about?ref=74977a0154074322bd5d66df96d42a5f",
      icon: "cliefNotes",
    },
    {
      title: "Substack",
      href: "https://jakevanclief.substack.com/",
      icon: "substack",
    },
  ],
} as const;

export const threeWheelStrategyContent = {
  title: "Build. Teach. Govern.",
  subtitle:
    "Eduba is a veteran-owned AI consulting and training firm. We help organizations figure out which problems belong to AI, which belong to traditional software, which belong to people, and which should not be built at all. Then we train their teams to build and govern what works.",
  consultButtonLabel: "",
  wheel: {
    node1: {
      title: "BUILD",
      subLabelLeft: "Multi-Agent Systems",
      subLabelRight: "Production Infrastructure",
    },
    node2: {
      title: "TEACH",
      subLabel: "Real Workflows",
    },
    node3: {
      titleLine1: "GOVERN",
      titleLine2: "",
      subLabel: "Risk & Policy",
    },
  },
  sections: [
    {
      id: "01",
      title: "Build",
      description:
        "We build multi-agent systems and production infrastructure. We also help teams decide what not to build. Most workflows do not belong to AI end to end. A large share belongs to databases, rules, and ordinary software. Vendors skip that math. We do not.",
      wheelKey: "democratise",
    },
    {
      id: "02",
      title: "Teach",
      description:
        "We teach principles that survive platform changes. Teams train on their own workflows, with their own data, and build first versions during the work. That is why the material holds after the tool changes and why adoption stays high after thirty days.",
      wheelKey: "learn",
    },
    {
      id: "03",
      title: "Govern",
      description:
        "Governance sits inside delivery. We build with risk assessment, evaluation methods, and policy decisions in view from day one. Our research work with the University of Edinburgh informs how we test systems, measure behaviour, and decide where human judgment should stay in the loop.",
      wheelKey: "orchestration",
    },
  ],
} as const;

export const servicesContent = {
  title: "What We Do",
  description:
    "We treat every engagement as a sequence. We learn the workflow, sort the work by the right layer, train people on the problems that matter, build the systems that hold up, and put governance around what stays live.",
  metaLabel: "COMPUTATIONAL ORCHESTRATION",
  labels: {
    title: "TITLE",
    description: "DESCRIPTION",
    whereWeDidIt: "WHERE THIS SHOWS UP",
  },
  items: [
    {
      id: "learn",
      title: "Learn The Workflow",
      theme: {
        background: "#d8bfc1",
        title: "#5d3136",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(66, 29, 36, 0.22)",
      },
      headline: "We start with what people actually do all day.",
      description:
        "Before training or building anything, we map real workflows. Where time goes. What is tedious. What is high stakes. What already works. That gives us an accurate picture of the problem instead of a guessed one.",
      projects: [
        {
          label: "PACIFIC LIFE WORKFLOW AUDIT",
          href: "/works/pacific-colgate",
        },
        {
          label: "COLGATE-PALMOLIVE TEAM SESSIONS",
          href: "/works/pacific-colgate",
        },
        {
          label: "UNIVERSITY OF EDINBURGH FACULTY PROGRAM",
          href: "/works/flagler-edinburgh",
        },
      ],
    },
    {
      id: "sort",
      title: "Sort The Work",
      theme: {
        background: "#7b5a5c",
        title: "#fefbf6",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(254, 251, 246, 0.24)",
      },
      headline: "We decide which layer each problem belongs on.",
      description:
        "Most failed AI projects start by automating the wrong thing. We sort the work into traditional software, rule-based logic, AI, or do not build this. The answer is often simpler than people expect. That is useful in itself.",
      projects: [
        {
          label: "KPMG UK EXECUTIVE WORKSHOP",
          href: "/works/kpmg",
        },
        {
          label: "IAG INNOVATION TEAM",
          href: "/works/iag",
        },
        {
          label: "ACADEMY OF INTERNATIONAL AFFAIRS NRW",
          href: "/works/aia-nrw",
        },
      ],
    },
    {
      id: "train",
      title: "Train People To Build",

      theme: {
        background: "#ffffff",
        title: "#5d3136",
        dots: "rgba(93, 49, 54, 0.32)",
        border: "rgba(93, 49, 54, 0.18)",
      },
      headline: "Workshops double as discovery and delivery.",
      description:
        "People learn by building something real with their own data. The exercises surface pain points, missing tooling, and decisions worth automating. That material becomes the spec for the work that follows.",
      projects: [
        {
          label: "600+ ENTERPRISE TRAINEES",
          href: "/works/pacific-colgate",
        },
        {
          label: "FLAGLER COLLEGE FACULTY PROGRAM",
          href: "/works/flagler-edinburgh",
        },
        {
          label: "CORRELATION ONE DELIVERY PARTNERSHIP",
          href: "/works/pacific-colgate",
        },
      ],
    },
    {
      id: "build",
      title: "Build What Makes Sense",

      theme: {
        background: "#F9ECDF",
        title: "#5d3136",
        dots: "rgba(66, 29, 36, 0.35)",
        border: "rgba(66, 29, 36, 0.2)",
      },
      headline: "We ship systems with the team still in the loop.",
      description:
        "For the problems that do belong to AI, we build the systems. Multi-agent platforms, data pipelines, governance tooling, and production workflows. The team that trained with us stays involved so they understand what was built and can maintain it.",
      projects: [
        {
          label: "VIGILORE COMPLIANCE PLATFORM",
          href: "/works/vigilore",
        },
        {
          label: "ETHICS ENGINE RESEARCH",
          href: "/works/ethics-engine",
        },
        {
          label: "ICR SOFT POWER RESEARCH",
          href: "/works/icr-research",
        },
      ],
    },
    {
      id: "govern",
      title: "Govern What Works",
      theme: {
        background: "#5d3136",
        title: "#fefbf6",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(254, 251, 246, 0.22)",
      },
      headline: "Every live system needs a way to measure, hold, and stop.",
      description:
        "We attach evaluation, risk review, and operating rules to the systems that stay in use. Governance is part of the build process, not the meeting that happens after the system has already spread.",
      projects: [
        {
          label: "UNIVERSITY OF EDINBURGH RESEARCH",
          href: "/works/ethics-engine",
        },
        {
          label: "BRITISH COUNCIL POLICY WORK",
          href: "/works/icr-research",
        },
        {
          label: "ENTERPRISE RISK AND ADOPTION REVIEWS",
        },
      ],
    },
  ],
} as const;

// Ordered archive themes matching servicesContent theme sequence
export const worksArchiveThemes = [
  {
    // 0: rose — matches services "learn"
    bg: "#d8bfc1",
    title: "#5d3136",
    meta: "rgba(93, 49, 54, 0.65)",
    tagBg: "rgba(93, 49, 54, 0.1)",
    tagText: "#5d3136",
    divider: "rgba(93, 49, 54, 0.2)",
    placeholderBg: "rgba(93, 49, 54, 0.07)",
    placeholderText: "rgba(93, 49, 54, 0.4)",
    summary: "rgba(93, 49, 54, 0.8)",
  },
  {
    // 1: medium brown — matches services "sort"
    bg: "#7b5a5c",
    title: "#fefbf6",
    meta: "rgba(254, 251, 246, 0.65)",
    tagBg: "rgba(254, 251, 246, 0.14)",
    tagText: "#fefbf6",
    divider: "rgba(254, 251, 246, 0.28)",
    placeholderBg: "rgba(254, 251, 246, 0.08)",
    placeholderText: "rgba(254, 251, 246, 0.4)",
    summary: "rgba(254, 251, 246, 0.8)",
  },
  {
    // 2: white — matches services "train"
    bg: "#ffffff",
    title: "#5d3136",
    meta: "rgba(93, 49, 54, 0.65)",
    tagBg: "rgba(93, 49, 54, 0.08)",
    tagText: "#5d3136",
    divider: "rgba(93, 49, 54, 0.16)",
    placeholderBg: "rgba(93, 49, 54, 0.05)",
    placeholderText: "rgba(93, 49, 54, 0.4)",
    summary: "rgba(93, 49, 54, 0.8)",
  },
  {
    // 3: skin/cream — matches services "build"
    bg: "#f9ecdf",
    title: "#5d3136",
    meta: "rgba(93, 49, 54, 0.65)",
    tagBg: "rgba(93, 49, 54, 0.09)",
    tagText: "#5d3136",
    divider: "rgba(93, 49, 54, 0.16)",
    placeholderBg: "rgba(93, 49, 54, 0.06)",
    placeholderText: "rgba(93, 49, 54, 0.4)",
    summary: "rgba(93, 49, 54, 0.8)",
  },
  {
    // 4: dark wine — matches services "govern"
    bg: "#5d3136",
    title: "#fefbf6",
    meta: "rgba(254, 251, 246, 0.65)",
    tagBg: "rgba(254, 251, 246, 0.14)",
    tagText: "#fefbf6",
    divider: "rgba(254, 251, 246, 0.28)",
    placeholderBg: "rgba(254, 251, 246, 0.08)",
    placeholderText: "rgba(254, 251, 246, 0.4)",
    summary: "rgba(254, 251, 246, 0.8)",
  },
] as const;

type WorkThemeKey = "rose" | "dark" | "skin";

type WorkGalleryItem = {
  id: string;
  label: string;
  src?: string;
};

export type WorkItem = {
  id: string;
  badge: string;
  title: string;
  year: string;
  client: string;
  tags: string[];
  summary: string;
  details: string[];
  gallery: WorkGalleryItem[];
  theme: WorkThemeKey;
};

const featuredWorkItems: WorkItem[] = [
  {
    id: "pacific-colgate",
    badge: "Pacific Life",
    title: "Pacific Life & Colgate-Palmolive",
    year: "2025",
    client: "CORRELATION ONE",
    tags: ["WORKFLOW INTEGRATION", "AGENT DEVELOPMENT", "MULTI-DAY SESSIONS", "EXECUTIVE & FRONTLINE"],
    summary:
      "600+ employees trained, 95% adoption after 30 days, agents built during coursework projected to save 2,000–3,000 hours annually. What started as a training engagement became embedded consulting.",
    details: [
      "What started as a training engagement has become something more like embedded consulting. Hundreds of employees across both organizations, from frontline teams all the way to executive leadership, trained through single and multi-day sessions built entirely around their existing workflows.",
      "The sessions didn't just teach people how to use AI tools. They uncovered where automation actually made sense, and where it didn't. Out of the coursework itself, teams began building agents that are projected to save 2,000 to 3,000 hours annually. But the bigger outcome was what nobody planned for: new value-adds beyond just automation, places where AI could improve decision quality, not just speed.",
    ],
    gallery: [
      { id: "pacific-colgate-01", label: "WORKSHOP FLOOR SESSION 01" },
      { id: "pacific-colgate-02", label: "TEAM IMPLEMENTATION WHITEBOARD" },
      { id: "pacific-colgate-03", label: "WORKFLOW HANDOFF REVIEW" },
      { id: "pacific-colgate-04", label: "PROTOTYPE VALIDATION RUN" },
    ],
    theme: "rose",
  },
  {
    id: "kpmg",
    badge: "KPMG",
    title: "KPMG UK Executive Workshop",
    year: "2025",
    client: "KPMG UK",
    tags: ["STRATEGIC AI", "EXECUTIVE WORKSHOP", "GLOBAL CONSULTANCY"],
    summary:
      "40+ senior executives trained on strategic AI decision-making — built around one core question: when should the answer be no? No tool demos. Just judgment.",
    details: [
      "Forty-plus senior executives needed something that most AI training doesn't offer: an honest conversation about when to invest in AI and when the answer is no. The engagement was built around strategic decision-making, not tool demos. We focused on helping leadership develop the judgment to evaluate AI investments against real operational needs, cutting through vendor narratives to get to what actually matters.",
      "Executives left with a practical operating framework for AI investment decisions, including risk thresholds, evaluation criteria, and ownership models across business and technology teams.",
    ],
    gallery: [
      { id: "kpmg-01", label: "EXECUTIVE WORKSHOP SESSION" },
      { id: "kpmg-02", label: "DECISION MATRIX WALKTHROUGH" },
      { id: "kpmg-03", label: "SCENARIO REVIEW BOARD" },
      { id: "kpmg-04", label: "OPERATING MODEL BRIEFING" },
    ],
    theme: "dark",
  },
  {
    id: "vigilore",
    badge: "VigilOre",
    title: "VigilOre Compliance Platform",
    year: "2024",
    client: "ARMETOUR",
    tags: ["DEFENSE", "MULTI-AGENT SYSTEMS", "FULL PRODUCT BUILD", "INTELLIGENCE"],
    summary:
      "Multi-agent compliance platform for DRC mining operations. 160+ hours of manual work per cycle reduced to under 5 minutes. Full product — architecture to demo — designed and produced by Eduba.",
    details: [
      "Working with Armetour's defense and intelligence teams to integrate AI capabilities into operational workflows. This engagement draws on the same zero-defect thinking that comes from working on systems where failure isn't an abstraction. When the stakes are this high, computational orchestration matters: knowing which layer each problem belongs on, whether that's AI, traditional code, human judgment, or a decision not to build it at all.",
      "VigilOre is the system that came out of this work: a multi-agent compliance platform for DRC mining operations. Four specialized agents handle document intake, aggregation, comparison, and reporting across multilingual regulatory frameworks. The entire product, from architecture to the demo video, was designed and produced by Eduba.",
    ],
    gallery: [
      {
        id: "vigilore-01",
        label: "COMPLIANCE DASHBOARD OVERVIEW",
        src: "/images/vigilore/01-dashboard.png",
      },
      {
        id: "vigilore-02",
        label: "START AUDIT FLOW",
        src: "/images/vigilore/02-submit-audit-start.png",
      },
      {
        id: "vigilore-03",
        label: "AUDIT FORM REVIEW",
        src: "/images/vigilore/03-submit-audit-form-review.png",
      },
      {
        id: "vigilore-04",
        label: "AUDIT REPORT LIST",
        src: "/images/vigilore/04-audit-reports.png",
      },
      {
        id: "vigilore-05",
        label: "REPORT DASHBOARD",
        src: "/images/vigilore/05-audit-report-dashboard.png",
      },
      {
        id: "vigilore-06",
        label: "DRILL DOWN ANALYSIS",
        src: "/images/vigilore/06-audit-report-drill-down.png",
      },
    ],
    theme: "skin",
  },
];

const archiveOnlyWorkItems: WorkItem[] = [
  {
    id: "aia-nrw",
    badge: "AIA NRW",
    title: "Academy of International Affairs NRW",
    year: "2025",
    client: "AIA NRW",
    tags: ["AI ETHICS", "INTERNATIONAL POLICY", "AMBASSADOR BRIEFING", "SOFT POWER"],
    summary:
      "AI ethics and governance briefing for ambassadors and international affairs experts across 25+ countries — connecting psychometric AI evaluation to how governments should think about the tools they adopt.",
    details: [
      "An AI ethics and governance briefing for ambassadors and international affairs experts, focused on how AI tools are reshaping soft power and influence measurement across 25+ countries. The workshop brought together researchers from the British Council, the British Foreign Policy Group, Ben Gurion University, and other institutions to discuss what happens when the tools we use to measure influence start changing the influence itself.",
      "Presented the Ethics Engine research alongside ongoing work with ICR and the British Council on international soft power, connecting the psychometric evaluation of AI models to the broader question of how governments and institutions should think about the tools they're adopting.",
    ],
    gallery: [
      { id: "aia-01", label: "WORKSHOP GROUP BONN" },
      { id: "aia-02", label: "ETHICS ENGINE PRESENTATION" },
      { id: "aia-03", label: "SOFT POWER RESEARCH PANEL" },
      { id: "aia-04", label: "AMBASSADOR BRIEFING SESSION" },
    ],
    theme: "rose",
  },
  {
    id: "iag",
    badge: "IAG",
    title: "International Airlines Group",
    year: "2024",
    client: "IAG",
    tags: ["INNOVATION STRATEGY", "CUSTOMER EXPERIENCE", "AVIATION"],
    summary:
      "AI training for IAG's innovation division — helping one of the world's largest airline groups think through where AI fits in development, thought leadership, and customer experience. Where getting it wrong is felt by millions of passengers.",
    details: [
      "Training delivered to IAG's innovation division, helping one of the world's largest airline groups think through where AI fits within development, thought leadership, and customer experience operations. The kind of environment where getting it wrong isn't just expensive, it's felt by millions of passengers.",
      "\"A pleasure working with Jake and his team at Eduba.\" — Lissa Pritchard, Head of Innovation: Development, Thought Leadership & Customer Experience, IAG",
    ],
    gallery: [
      { id: "iag-01", label: "INNOVATION TEAM SESSION" },
      { id: "iag-02", label: "CUSTOMER EXPERIENCE REVIEW" },
      { id: "iag-03", label: "STRATEGY WORKSHOP BOARD" },
      { id: "iag-04", label: "DELIVERY DEBRIEF" },
    ],
    theme: "dark",
  },
  {
    id: "ethics-engine",
    badge: "Ethics Engine",
    title: "The Ethics Engine",
    year: "2025",
    client: "UNIVERSITY OF EDINBURGH",
    tags: ["PSYCHOMETRIC ASSESSMENT", "LLM EVALUATION", "PUBLISHED RESEARCH", "UKICER 2025"],
    summary:
      "A methodology to evaluate AI models using validated psychometric frameworks — giving organizations an empirical, repeatable way to assess the behavioral tendencies of the models they're trusting with their work. Published at UKICER 2025.",
    details: [
      "Most organizations choose AI tools based on marketing. We built a methodology to evaluate them using validated psychological instruments — the same psychometric frameworks applied to humans, now applied at scale to large language models. The Ethics Engine gives organizations something they've never had before: an empirical, repeatable way to assess the behavioral tendencies of the models they're trusting with their work.",
      "Being able to evaluate these models at all was the hard part. Doing it at scale is what makes it useful. This research was also presented at UKICER 2025 under \"AI Workflows: Honest, Transparent, Reusable Work\" and formed the basis of the AI governance briefing at the Academy of International Affairs NRW.",
    ],
    gallery: [
      { id: "ethics-01", label: "PSYCHOMETRIC DASHBOARD" },
      { id: "ethics-02", label: "LLM EVALUATION INTERFACE" },
      { id: "ethics-03", label: "UKICER 2025 PRESENTATION" },
      { id: "ethics-04", label: "RESEARCH FINDINGS OUTPUT" },
    ],
    theme: "skin",
  },
  {
    id: "icr-research",
    badge: "ICR Research",
    title: "ICR Research",
    year: "2024",
    client: "BRITISH COUNCIL",
    tags: ["BRITISH COUNCIL", "SOFT POWER RESEARCH", "NLP & MACHINE LEARNING", "PUBLISHED"],
    summary:
      "British Council-commissioned research applying ML and NLP to map how ideas transform as they cross borders. The findings were compelling enough that ICR broke a ten-year pattern to produce a hard copy.",
    details: [
      "Applying machine learning and NLP to map how ideas transform as they cross borders, for British Council-commissioned research on international soft power. The work uses AI to do what would take a research team months: trace influence patterns across languages, institutions, and policy frameworks.",
      "The engagement went well enough that ICR made a decision they hadn't made in over a decade: they wanted to produce a hard copy of the study. That's not a metric you find on a dashboard, but it tells you something about the quality of the work. When a research organization breaks a ten-year pattern to put your findings in print, the work did its job.",
    ],
    gallery: [
      { id: "icr-01", label: "RESEARCH ROUNDTABLE BONN" },
      { id: "icr-02", label: "NLP INFLUENCE MAP" },
      { id: "icr-03", label: "SOFT POWER ANALYSIS" },
      { id: "icr-04", label: "PUBLISHED FINDINGS" },
    ],
    theme: "dark",
  },
  {
    id: "flagler-edinburgh",
    badge: "Where It Started",
    title: "Flagler College & Edinburgh Futures Institute",
    year: "2022",
    client: "FLAGLER COLLEGE",
    tags: ["HIGHER EDUCATION", "FACULTY TRAINING", "EDINBURGH FUTURES INSTITUTE", "WHERE IT STARTED"],
    summary:
      "Where it started. Faculty AI workshops at Flagler College and the Edinburgh Futures Institute — proving that the most skeptical people in the room often become the most thoughtful adopters.",
    details: [
      "Before the Fortune 500 engagements, before the global consultancies, the work started here. After using AI to produce research that was accepted to Flagler's Saints Academic Review, faculty started asking how it was done. That turned into contracted AI workshops for the college, teaching professors how to think about these tools in the classroom.",
      "It was the first time the tables turned from student to teacher, and it proved something that still holds: the people most skeptical of AI often become its most thoughtful adopters, if someone takes the time to connect it to their actual work. The work continued at the University of Edinburgh, where Eduba Labs ran experimental workshops at the Edinburgh Futures Institute for faculty exploring AI in education.",
    ],
    gallery: [
      { id: "flagler-01", label: "EDINBURGH FUTURES INSTITUTE" },
      { id: "flagler-02", label: "FACULTY WORKSHOP SESSION" },
      { id: "flagler-03", label: "SAINTS ACADEMIC REVIEW" },
      { id: "flagler-04", label: "CLASSROOM IMPLEMENTATION" },
    ],
    theme: "rose",
  },
];

export const allWorkItems: WorkItem[] = [
  ...featuredWorkItems,
  ...archiveOnlyWorkItems,
];

export const worksContent = {
  seeAllLabel: "SEE ALL WORKS ->",
  viewProjectLabel: "VIEW PROJECT",
  backToWorksLabel: "See All works ->",
  detailsLabel: "DETAILED BREAKDOWN",
  imagePlaceholderLabel: "IMAGE PLACEHOLDER",
  themes: {
    // Values mirror worksArchiveThemes exactly so all three contexts stay in sync
    rose: {
      bg: "#d8bfc1",
      title: "#5d3136",
      meta: "rgba(93, 49, 54, 0.65)",
      tagBg: "rgba(93, 49, 54, 0.1)",
      tagText: "#5d3136",
      divider: "rgba(93, 49, 54, 0.2)",
      placeholderBg: "rgba(93, 49, 54, 0.07)",
      placeholderText: "rgba(93, 49, 54, 0.4)",
      summary: "rgba(93, 49, 54, 0.8)",
    },
    dark: {
      bg: "#5d3136",
      title: "#fefbf6",
      meta: "rgba(254, 251, 246, 0.65)",
      tagBg: "rgba(254, 251, 246, 0.14)",
      tagText: "#fefbf6",
      divider: "rgba(254, 251, 246, 0.28)",
      placeholderBg: "rgba(254, 251, 246, 0.08)",
      placeholderText: "rgba(254, 251, 246, 0.4)",
      summary: "rgba(254, 251, 246, 0.8)",
    },
    skin: {
      bg: "#f9ecdf",
      title: "#5d3136",
      meta: "rgba(93, 49, 54, 0.65)",
      tagBg: "rgba(93, 49, 54, 0.09)",
      tagText: "#5d3136",
      divider: "rgba(93, 49, 54, 0.16)",
      placeholderBg: "rgba(93, 49, 54, 0.06)",
      placeholderText: "rgba(93, 49, 54, 0.4)",
      summary: "rgba(93, 49, 54, 0.8)",
    },
  },
  items: featuredWorkItems,
} as const;

export const allWorksContent = {
  title: "ALL CASE STUDIES",
  subtitle:
    "Every case here follows the same structure: context first, implementation second, outcomes third. Expand any folder to inspect it.",
  backHomeLabel: "BACK HOME ->",
  items: allWorkItems,
} as const;

export function getWorkById(id: string): WorkItem | undefined {
  return allWorkItems.find((work) => work.id === id);
}

export const reviewsContent = {
  title:
    "We start with truth, not hype. We teach your people to build. Then we orchestrate what works into an advantage.",
  sideLabel: {
    line1: "WHAT",
    line2: "PEOPLE SAY",
  },
  counter: {
    startValue: 5,
    max: 10,
  },
  items: [
    {
      id: 1,
      client: "Lissa Pritchard",
      company: "IAG",
      quote:
        "A pleasure working with Jake and his team at Eduba. They brought clarity to our AI strategy and helped our innovation team see exactly where these tools fit into development, thought leadership, and customer experience.",
      source: "LINKEDIN",
      profileHref: "https://www.linkedin.com/in/lissapritchard/",
      sourceHref: "https://www.linkedin.com/in/lissapritchard/",
      headerCode: "(HEAD_OF_INNOVATION)",
    },
    {
      id: 2,
      client: "Andrew Sdunich",
      company: "Armetour",
      quote:
        "Always ahead of the competition and ready to deliver and exceed expectations. They built VigilOre from the ground up — four specialized agents handling multilingual compliance that turned 160 hours of manual work into minutes.",
      source: "LINKEDIN",
      profileHref: "https://www.linkedin.com/in/andrewzdunich/",
      sourceHref: "https://www.linkedin.com/in/andrewzdunich/",
      headerCode: "(DEFENSE_OPS)",
    },
    {
      id: 3,
      client: "Faculty Member",
      company: "Flagler College",
      quote:
        "Whoa, this is a really good use of AI. How do you do this? They didn't push tools on us — they connected AI to our actual research and teaching, and that's when it clicked for the whole department.",
      source: "FLAGLER COLLEGE NEWS",
      sourceHref:
        "https://www.flagler.edu/news-events/news/uncovering-benefits-ai-education-flagler-grads-journey",
      headerCode: "(FACULTY)",
    },
    {
      id: 4,
      client: "Enterprise Client",
      company: "Pacific Life",
      quote:
        "95% of our team is still using what Eduba taught after 30 days — the industry average sits around 10%. They learned our workflows first, trained on what they found, and built agents that are saving us thousands of hours a year.",
      source: "WEBSITE",
      sourceHref: "https://www.pacificlife.com/",
      headerCode: "(ENTERPRISE_TRAINING)",
    },
    {
      id: 5,
      client: "Adam Tupuola",
      company: "VALOREM SEO",
      quote:
        "I just want to say thank you! I'm here because you are the real deal and you are actually teaching, which is so much different than every other guru who basically has AI write their course for them. Cheers!",
      source: "LINKEDIN",
      profileHref: "https://www.linkedin.com/in/adam-tupuola-3997a61b6/",
      sourceHref: "https://www.linkedin.com/in/adam-tupuola-3997a61b6/",
      headerCode: "(CLIEF_NOTES)",
    },
    {
      id: 6,
      client: "Alexander Paschka",
      company: "AI, MARKETING & STRATEGY",
      quote:
        "Jake's teaching set me up with the knowledge. One of my clients is picking up 10 seats of Claude Enterprise and I'll be leading the team on how to get set up correctly for the long term.",
      source: "LINKEDIN",
      profileHref: "https://www.linkedin.com/in/paschka/",
      sourceHref: "https://www.linkedin.com/in/paschka/",
      headerCode: "(CLIEF_NOTES)",
    },
    {
      id: 7,
      client: "Anes Baltić",
      company: "GOOGLE",
      quote:
        "It's incredible to think this community didn't exist not long ago and now its value is constantly increasing and getting better. As I'm sure everyone agrees, you're truly amazing with the value and effort you provide. It's greatly appreciated man!",
      source: "LINKEDIN",
      profileHref: "https://www.linkedin.com/in/anes-balti%C4%87-363046262/",
      sourceHref: "https://www.linkedin.com/in/anes-balti%C4%87-363046262/",
      headerCode: "(CLIEF_NOTES)",
    },
    {
      id: 8,
      client: "Travis Brown",
      company: "SKOOL COMMUNITY",
      quote:
        "Thanks for doing what you do Jake. I can tell from your videos that you are a genuine guy who really cares and are trying to do good things to help the rest of us. For that, I am truly grateful dude!",
      source: "CLIEF NOTES",
      sourceHref:
        "https://www.skool.com/quantum-quill-lyceum-1116/about?ref=74977a0154074322bd5d66df96d42a5f",
      headerCode: "(CLIEF_NOTES)",
    },
  ],
} as const;

export const paradigmShiftContent = {
  title: {
    line1: "community_and",
    line2: "learning_",
  },
  description:
    "We run a learning ecosystem alongside client work. The public community is open to anyone who wants to start building. Teams who work with us get access as part of the relationship. The Lyceum is the deeper twelve-week track for people who want structured practice and a capstone.",
  defaultActiveIndex: 0,
  items: [
    {
      id: "CL001",
      title: "Skool Community",
      slug: "enterprise",
      description:
        "12,500+ members use the community to learn the fundamentals, ship first projects, and compare notes with other builders. It is public, active, and designed to help people start immediately.",
      cta: "ASK FOR ACCESS",
      href: "mailto:info@eduba.io?subject=Eduba%20Community",
    },
    {
      id: "CL002",
      title: "The Lyceum",
      slug: "enterprise",
      description:
        "The Lyceum is our twelve-week certification program. Cohorts are split by skill level, the work is capstone-based, and instruction comes from people who build with these tools daily.",
      cta: "ASK ABOUT COHORTS",
      href: "mailto:info@eduba.io?subject=The%20Lyceum",
    },
    {
      id: "CL003",
      title: "Team Access",
      slug: "enterprise",
      description:
        "Teams who work with us get access to the community as part of the relationship. That matters because adoption does not hold on workshops alone. People need somewhere to keep practicing after delivery ends.",
      cta: "START A CONVERSATION",
      href: "mailto:info@eduba.io?subject=Eduba%20Engagement",
    },
  ],
} as const;

export const teamContent = {
  title: "our people",
  subtitle:
    "Veteran-owned, research-backed, and delivery-minded. The people on this page do the work. They teach, build, review risk, and stay close enough to the details to be useful.",
  linkedinLabel: "in",
  defaultActiveIndex: 0,
  people: [
    {
      id: "jake",
      code: "EB-CEO/",
      name: "Jake Van Clief",
      role: "FOUNDER & CEO",
      email: "theceo@eduba.io",
      description:
        "8 years USMC on cryptographic systems and fighter jet avionics. MSc Future Governance at University of Edinburgh. Takes the biggest AI skeptics in a room and makes their criticisms the most valuable part of the conversation.",
      linkedin: "https://www.linkedin.com/in/jake-van-clief/",
      websiteLabel: null,
      websiteHref: null,
    },
    {
      id: "david",
      code: "EB-CTO/",
      name: "David McDermott",
      role: "CHIEF ARCHITECT",
      email: "thecto@eduba.io",
      description:
        "Over a decade in software engineering across defense, gaming, and enterprise systems. MS Computer Science, University of Iowa. Previously at BAE Systems, Epic Games, and Derivco.",
      linkedin: "https://www.linkedin.com/in/david-mcdermott/",
      websiteLabel: null,
      websiteHref: null,
    },
    {
      id: "kay",
      code: "EB-CPO/",
      name: "Kay K .",
      role: "DESIGN & TECHNICAL LEAD",
      email: "thefrontendguy@eduba.io",
      description:
        'Full stack developer and designer who has shipped AI compliance tools for governments, e-commerce platforms doing $400k+ in sales, and platforms handling 4M+ in transactions. Wildly obsessed with good design, art, and software. He has an innate attitude to stretch the boundaries. Clients describe him as the "guy who gets it done".',
      linkedin: "https://www.linkedin.com/in/banburycheese/",
      websiteLabel: "itskay.co",
      websiteHref: "https://itskay.co/",
    },
    {
      id: "matthew",
      code: "EB-CRO/",
      name: "Matthew Creamer",
      role: "CRO",
      email: "thecro@eduba.io",
      description:
        "Chief Revenue Officer building the revenue engine behind Eduba's enterprise motion. He leads go-to-market strategy, outbound enterprise sales, partnerships, and early revenue operations while the commercial team is built from the ground up. His focus is turning founder-led selling into repeatable enterprise infrastructure with clear pricing, messaging, and playbooks. The work is less about chasing pipeline and more about designing the revenue architecture that can scale.",
      linkedin: "https://www.linkedin.com/in/matt-creamer-ai/",
      websiteLabel: null,
      websiteHref: null,
    },
    {
      id: "nicholas",
      code: "EB-COO/",
      name: "Nicholas Rondino",
      role: "COO",
      email: "thecoo@edub.io",
      description:
        "Chief Operating Officer focused on execution discipline across delivery, internal systems, and client operations. He is building the cadence, reporting, and coordination structure that lets the team move quickly without creating chaos. Nicholas works across commercial and delivery functions to keep the company operationally tight as it grows.",
      linkedin: "https://www.linkedin.com/in/nicholas-rondino-00578824b/",
      websiteLabel: null,
      websiteHref: null,
    },
  ],
} as const;
