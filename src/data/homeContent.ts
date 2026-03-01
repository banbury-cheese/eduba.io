export const layoutContent = {
  logoText: "The Faces of Interface",
  topNav: {
    readingsLabel: "Readings",
    chaptersLabel: "Chapters",
    primaryCtaLabel: "Start a Conversation",
  },
  bottomNav: {
    bookCallTitle: "BOOK A DEMO",
    bookCallSubtitle: "GET STARTED TODAY",
    secondaryCtaLabel: "BOOK A DEMO",
  },
} as const;

export const heroContent = {
  readings: [
    "YOUR TEAM HAS AI TOOLS. THEY'RE NOT SURE WHAT TO DO WITH THEM.",
    "THE REALITY OF AI IMPLEMENTATION COSTS",
    "WHY 95% SUSTAINED ADOPTION BEATS 10% INDUSTRY AVERAGE",
    "WHEN SHOULD THE ANSWER BE NO?",
    "THE PEOPLE MOST SKEPTICAL OF AI BECOME ITS MOST THOUGHTFUL ADOPTERS",
  ],
  chaptersLabel: "The Chapters",
  chapters: [
    "BUILD. TEACH. GOVERN.",
    "WHO WE WORK WITH",
    "THE WORK",
    "WHICH SECTORS",
    "WHO ARE THE PEOPLE",
  ],
} as const;

export const threeWheelStrategyContent = {
  title: "Build. Teach. Govern.",
  subtitle:
    "That's not a training problem. It's a translation problem. Someone needs to sit with your people, learn what they actually do all day, and show them exactly where these tools fit. Not in theory. In their workflows, with their data, on their deadlines.",
  consultButtonLabel: "BOOK A DEMO",
  wheel: {
    node1: {
      title: "BUILD",
      subLabelLeft: "Multi-Agent Systems",
      subLabelRight: "Data Pipelines",
    },
    node2: {
      title: "TEACH",
      subLabel: "Workflow Integration",
    },
    node3: {
      titleLine1: "GOVERN",
      titleLine2: "",
      subLabel: "Risk & Ethics",
    },
  },
  sections: [
    {
      id: "01",
      title: "Build",
      description:
        "Multi-agent systems, data pipelines, production infrastructure. We reduced 160-hour processes to 5 minutes. We focus on real implementation costs and the failures omitted from vendor case studies.",
      wheelKey: "democratise",
    },
    {
      id: "02",
      title: "Teach",
      description:
        "We teach abstract fundamentals independent of platform changes. Emphasis on critical output assessment and principles over procedures. Teams building first versions gain deeper understanding than any slide deck provides.",
      wheelKey: "learn",
    },
    {
      id: "03",
      title: "Govern",
      description:
        "Risk assessment, policy frameworks, ethics considerations. Our research measures psychological patterns in AI systems missed by standard evaluation methods.",
      wheelKey: "orchestration",
    },
  ],
} as const;

export const servicesContent = {
  title: "How We Work",
  description:
    "Learn First. Build Right. We start with understanding your needs, observe problems in actual tool usage, determine genuine AI requirements, then engineer validated solutions your teams understand and own.",
  metaLabel: "WORKSHOPS & ENGAGEMENTS",
  labels: {
    title: "TITLE",
    description: "DESCRIPTION",
    whereWeDidIt: "WHERE WE DID IT",
  },
  items: [
    {
      id: "briefing",
      title: "Executive Briefing",
      theme: {
        background: "#d8bfc1",
        title: "#5d3136",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(66, 29, 36, 0.22)",
      },
      headline: "Executive alignment on what AI can actually do",
      description:
        "60-90 minute sessions that cut through vendor noise and hype cycles. Your leadership team gets a clear-eyed view of capabilities, limitations, and strategic implications — tailored to your industry and org structure.",
      projects: [
        "KPMG UK EXECUTIVE WORKSHOP",
        "IAG INNOVATION TEAM",
        "ACADEMY OF INTL. AFFAIRS NRW",
      ],
    },
    {
      id: "readiness",
      title: "Implementation Readiness",
      theme: {
        background: "#7b5a5c",
        title: "#fefbf6",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(254, 251, 246, 0.24)",
      },
      headline: "Full-day deep dives into your workflows",
      description:
        "Before we train anyone, we spend time understanding what your team actually does. What tools they use, where time disappears, what's tedious, what's high-stakes. No generic curriculum — every session is built around the specific opportunities we find.",
      projects: [
        "PACIFIC LIFE",
        "COLGATE-PALMOLIVE",
        "UNIVERSITY OF EDINBURGH",
      ],
    },
    {
      id: "technical",
      title: "Technical Implementation",
      theme: {
        background: "#F9ECDF",
        title: "#5d3136",
        dots: "rgba(66, 29, 36, 0.35)",
        border: "rgba(66, 29, 36, 0.2)",
      },
      headline: "Working systems, not slideware. Scoped and shipped.",
      description:
        "Some things should be automated. Most shouldn't. We help you tell the difference, then build the agents and workflows that actually earn back the investment. Your team pairs with us, learns the patterns, and keeps the IP.",
      projects: [
        "VIGILORE COMPLIANCE PLATFORM",
        "ETHICS ENGINE RESEARCH",
        "ICR SOFT POWER RESEARCH",
      ],
    },
    {
      id: "educator",
      title: "Educator Programs",
      theme: {
        background: "#5d3136",
        title: "#fefbf6",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(254, 251, 246, 0.22)",
      },
      headline: "Custom programs for universities and faculty",
      description:
        "Faculty AI workshops and academic research programs. The people most skeptical of AI often become its most thoughtful adopters, if someone takes the time to connect it to their actual work.",
      projects: [
        "FLAGLER COLLEGE",
        "EDINBURGH FUTURES INSTITUTE",
        "CORRELATION ONE PARTNERSHIP",
      ],
    },
  ],
} as const;

export const worksContent = {
  seeAllLabel: "SEE ALL WORKS ->",
  viewProjectLabel: "VIEW PROJECT ->",
  imagePlaceholderLabel: "IMAGE PLACEHOLDER",
  themes: {
    rose: {
      bg: "#d8bfc1",
      title: "#5d3136",
      meta: "rgba(66, 29, 36, 0.7)",
      tagBg: "#ead5d6",
      tagText: "#5d3136",
      divider: "rgba(93, 49, 54, 0.2)",
      placeholderBg: "rgba(93, 49, 54, 0.08)",
      placeholderText: "rgba(93, 49, 54, 0.45)",
      summary: "#4a4a4a",
    },
    dark: {
      bg: "#421d24",
      title: "#fefbf6",
      meta: "rgba(254, 251, 246, 0.75)",
      tagBg: "rgba(254, 251, 246, 0.18)",
      tagText: "#fefbf6",
      divider: "rgba(254, 251, 246, 0.35)",
      placeholderBg: "rgba(254, 251, 246, 0.08)",
      placeholderText: "rgba(254, 251, 246, 0.6)",
      summary: "#fefbf6",
    },
    skin: {
      bg: "#f9ecdf",
      title: "#5d3136",
      meta: "rgba(66, 29, 36, 0.7)",
      tagBg: "rgba(66, 29, 36, 0.12)",
      tagText: "#5d3136",
      divider: "rgba(66, 29, 36, 0.2)",
      placeholderBg: "rgba(66, 29, 36, 0.06)",
      placeholderText: "rgba(66, 29, 36, 0.4)",
      summary: "#4a4a4a",
    },
  },
  items: [
    {
      id: "pacific-colgate",
      badge: "Pacific Life",
      title: "Pacific Life & Colgate-Palmolive",
      year: "2025",
      client: "CORRELATION ONE",
      tags: ["WORKFLOW INTEGRATION", "AGENT DEVELOPMENT", "MULTI-DAY SESSIONS"],
      summary:
        "300+ employees trained on AI workflow integration. 95% sustained adoption after 30 days. 2-3K projected hours saved annually from course-built agents.",
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
        "40+ senior executives trained on strategic AI decision-making. Focused on the core question: when should the answer be no?",
      theme: "dark",
    },
    {
      id: "vigilore",
      badge: "VigilOre",
      title: "VigilOre Compliance Platform",
      year: "2024",
      client: "ANDREW SDUNICH",
      tags: ["MULTI-AGENT SYSTEMS", "COMPLIANCE", "FULL PRODUCT BUILD"],
      summary:
        "Multi-agent compliance platform for DRC mining operations. Reduced 160+ hours of manual compliance work per cycle to under 5 minutes.",
      theme: "skin",
    },
  ],
} as const;

export const reviewsContent = {
  title:
    "We start with truth, not hype. We teach your people to build. Then we help them govern what works.",
  sideLabel: {
    line1: "A FEW WORDS FROM",
    line2: "OUR CLIENTS",
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
      source: "DIRECT",
      headerCode: "(HEAD_OF_INNOVATION)",
    },
    {
      id: 2,
      client: "Andrew Sdunich",
      company: "Armetour",
      quote:
        "Always ahead of the competition and ready to deliver and exceed expectations. They built VigilOre from the ground up — four specialized agents handling multilingual compliance that turned 160 hours of manual work into minutes.",
      source: "DIRECT",
      headerCode: "(DEFENSE_OPS)",
    },
    {
      id: 3,
      client: "Faculty Member",
      company: "Flagler College",
      quote:
        "Whoa, this is a really good use of AI. How do you do this? They didn't push tools on us — they connected AI to our actual research and teaching, and that's when it clicked for the whole department.",
      source: "FLAGLER COLLEGE NEWS",
      headerCode: "(FACULTY)",
    },
    {
      id: 4,
      client: "Enterprise Client",
      company: "Pacific Life",
      quote:
        "95% of our team is still using what Eduba taught after 30 days — the industry average sits around 10%. They learned our workflows first, trained on what they found, and built agents that are saving us thousands of hours a year.",
      source: "METRICS",
      headerCode: "(ENTERPRISE_TRAINING)",
    },
  ],
} as const;

export const paradigmShiftContent = {
  title: {
    line1: "the_paradigm",
    line2: "shift_",
  },
  description:
    "The future isn't about humans versus AI, or even humans with AI. It's about understanding how multiple humans and multiple AI systems collaborate to create value. We address the core challenges: output validation, build-versus-buy decisions, actual implementation costs, and the systems thinking that integrates technical systems, workforce development, and governance.",
  defaultActiveIndex: 2,
  items: [
    {
      id: "EB001",
      title: "Defence & Intelligence",
      slug: "defense-military",
      description:
        "AI integration for defense operations. Multi-agent compliance platforms, document intake and aggregation across multilingual regulatory frameworks. Mission-critical systems with security-first architecture and human oversight.",
      cta: "LEARN MORE",
    },
    {
      id: "EB002",
      title: "Enterprise",
      slug: "enterprise",
      description:
        "Your team has AI tools. They're not sure what to do with them. We sit with your people, learn what they actually do, and show them exactly where these tools fit. In their workflows, with their data, on their deadlines.",
      cta: "LEARN MORE",
    },
    {
      id: "EB003",
      title: "Education & Research",
      slug: "education-research",
      description:
        "Faculty AI workshops, psychometric assessment of large language models, and curriculum programs that bridge theory-practice gaps. Published research at UKICER 2025 and partnerships with University of Edinburgh and Flagler College.",
      cta: "LEARN MORE",
    },
    {
      id: "EB004",
      title: "Government & Policy",
      slug: "government",
      description:
        "AI ethics briefings for international affairs experts. Governance frameworks, soft power measurement, and policy research. Working with the British Council, Academy of International Affairs NRW, and Ben Gurion University.",
      cta: "LEARN MORE",
    },
  ],
} as const;

export const teamContent = {
  title: "our people",
  subtitle:
    "Veteran-owned. From cryptographic systems and fighter jet avionics to software engineering across defense, gaming, and enterprise. We work hard, get on, and prioritise culture.",
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
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "david",
      code: "EB-CTO/",
      name: "David McDermott",
      role: "CTO",
      email: "thecto@eduba.io",
      description:
        "Over a decade in software engineering across defense, gaming, and enterprise systems. MS Computer Science, University of Iowa. Previously at BAE Systems, Epic Games, and Derivco.",
      linkedin: "https://www.linkedin.com/",
    },
  ],
} as const;
