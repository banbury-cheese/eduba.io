export const layoutContent = {
  logoText: "The Faces of Interface",
  topNav: {
    readingsLabel: "Readings",
    chaptersLabel: "Chapters",
    primaryCtaLabel: "Grab a Seat",
  },
  bottomNav: {
    bookCallTitle: "BOOK A CALL",
    bookCallSubtitle: "GET STARTED TODAY",
    secondaryCtaLabel: "CALL TO ACTION",
  },
} as const;

export const heroContent = {
  readings: [
    "WHEN AI SHOWS ITS POLITICS",
    "THE $300 QUESTION",
    "THE QUESTIONS SCHOOLS AREN'T ASKING ABOUT AI",
    "THE PHD PARADOX",
    "THE LAB PARTY THAT CHANGED HOW I THINK ABOUT MONEY",
  ],
  chaptersLabel: "The Chapters",
  chapters: [
    "WHAT WE SELL",
    "WHO IS OUR CLIENT",
    "WHAT WE'VE MADE",
    "WHICH SECTORS",
    "WHO ARE THE PEOPLE",
  ],
} as const;

export const threeWheelStrategyContent = {
  title: "The Three Wheel Strategy",
  subtitle:
    "We're not selling software or consulting. We're building a new operational paradigm where every employee becomes a solution architect.",
  consultButtonLabel: "BOOK CONSULTATION",
  wheel: {
    node1: {
      title: "DEMOCRATISE BUILDING",
      subLabelLeft: "Non Technical Builders",
      subLabelRight: "6Wk POCs",
    },
    node2: {
      title: "LEARN & OPTIMIZE",
      subLabel: "buy what matters",
    },
    node3: {
      titleLine1: "THE ORCHESTRATION",
      titleLine2: "LAYER",
      subLabel: "Human in the loop",
    },
  },
  sections: [
    {
      id: "01",
      title: "Democratize Building",
      description:
        "In 6 weeks, we teach non-technical employees to build POCs that used to require entire startups. Janet in accounting creates expense tools. Mike in ops builds workflow automation. They own it, they understand it, they iterate it.",
      wheelKey: "democratise",
    },
    {
      id: "02",
      title: "Learn & Optimize",
      description:
        "We analyze what works, double down on winners, and cut what doesn't. Your team learns by doing, building institutional knowledge that compounds over time.",
      wheelKey: "learn",
    },
    {
      id: "03",
      title: "The Orchestration Layer",
      description:
        "Human-in-the-loop multimodal systems that connect your tools, your data, and your people. Not replacing humans-amplifying them.",
      wheelKey: "orchestration",
    },
  ],
} as const;

export const servicesContent = {
  title: "The Untapped Opportunity",
  description:
    "Every YC startup is building what your employees could create in an afternoon. But those startups can't build what emerges when 100 employees each build their perfect tool and we orchestrate them together. That's a moat no vendor can cross.",
  metaLabel: "COMPUTATIONAL ORCHESTRATION SERVICES",
  labels: {
    title: "TITLE",
    description: "DESCRIPTION",
    whereWeDidIt: "WHERE WE DID IT",
  },
  items: [
    {
      id: "speaking",
      title: "Speaking & Advisory",
      theme: {
        background: "#d8bfc1",
        title: "#5d3136",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(66, 29, 36, 0.22)",
      },
      headline: "Executive alignment on what AI can actually do",
      description:
        "We cut through vendor noise and hype cycles. Your leadership team gets a clear-eyed view of capabilities, limitations, and strategic implications-tailored to your industry and org structure.",
      projects: [
        "FORTUNE 500 BOARD BRIEFING",
        "FINTECH SUMMIT KEYNOTE",
        "PRIVATE EQUITY DUE DILIGENCE",
      ],
    },
    {
      id: "workshops",
      title: "Technical Workshops",
      theme: {
        background: "#7b5a5c",
        title: "#fefbf6",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(254, 251, 246, 0.24)",
      },
      headline: "Hands-on training that sticks",
      description:
        "Two-day intensives where your team builds real systems. Not slides about AI-actual working prototypes using your data, your tools, your constraints. Engineers leave with patterns they can apply Monday morning.",
      projects: [
        "MERIDIAN HEALTH SYSTEMS",
        "COASTAL CAPITAL PARTNERS",
        "PHOENIX INDUSTRIAL GROUP",
      ],
    },
    {
      id: "prototyping",
      title: "Rapid Prototyping",
      theme: {
        background: "#F9ECDF",
        title: "#5d3136",
        dots: "rgba(66, 29, 36, 0.35)",
        border: "rgba(66, 29, 36, 0.2)",
      },
      headline: "Working systems, not slideware. Prove value with real POCs",
      description:
        "We design and ship production-minded proofs: multi-model orchestration, ethics engines, and custom agentic flows. Your team pairs with us, learns the patterns, and keeps the IP.",
      projects: [
        "NORTHWAY LOGISTICS POC",
        "EMBERFIELD MEDIA RESEARCH AI",
        "LAKE & SHORE BANK KYC PIPELINE",
        "REDHAVEN FIELD OPS AGENT",
      ],
    },
    {
      id: "strategic",
      title: "Strategic Programs",
      theme: {
        background: "#5d3136",
        title: "#fefbf6",
        dots: "rgba(254, 251, 246, 0.9)",
        border: "rgba(254, 251, 246, 0.22)",
      },
      headline: "Long-term transformation partnerships",
      description:
        "Six-month engagements that rebuild how your organization thinks about and builds with AI. We embed with your teams, establish centers of excellence, and create sustainable competitive advantages.",
      projects: [
        "ENTERPRISE TRANSFORMATION",
        "COE ESTABLISHMENT",
        "CAPABILITY BUILDING",
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
      id: "colgate",
      badge: "COLGATE",
      title: "Colgate Workshop",
      year: "2025",
      client: "JHON DOE",
      tags: ["AI PIPELINE", "AUDITS", "FRONTEND"],
      summary:
        "eduba turned our AI strategy into a working pipeline in four weeks. They told us what not to build, paired with our team, and left us with skills, not dependency.",
      theme: "rose",
    },
    {
      id: "vigilore",
      badge: "VIGILORE",
      title: "VigilOre Audit POC",
      year: "2024",
      client: "ANDREW ZDUNICH",
      tags: ["RISK OPS", "COMPLIANCE", "DASHBOARD"],
      summary:
        "We reduced audit prep time by 38% in month one by building live risk maps and automated documentation flows. The team shipped new workflows without us.",
      theme: "dark",
    },
    {
      id: "armetor",
      badge: "ARMETOR",
      title: "Rapid Prototyping Sprint",
      year: "2023",
      client: "PRIYA CHANDRA",
      tags: ["ORCHESTRATION", "MULTIMODAL", "PROTOTYPES"],
      summary:
        "A two-week build sprint delivered working agentic workflows across sales and ops. Their team kept the IP and rolled it out across regions.",
      theme: "skin",
    },
  ],
} as const;

export const reviewsContent = {
  title:
    "We start with truth, not hype. We teach your people to build. Then we orchestrate what works into an advantage.",
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
      client: "Jhon Doe",
      company: "KPMG",
      quote:
        "eduba turned our ai strategy into a working pipeline in four weeks. they told us what not to build, paired with our team, and left us with skills-not dependency. we cut analysis time by 38% in month one.",
      source: "LINKEDIN",
      headerCode: "(POC_CLIENT)",
    },
    {
      id: 2,
      client: "Sarah Smith",
      company: "Deloitte",
      quote:
        "The team at eduba didn't just deliver a product; they delivered a culture shift. Their approach to AI is pragmatic, effective, and deeply human-centric.",
      source: "DIRECT",
      headerCode: "(STRATEGY_LEAD)",
    },
    {
      id: 3,
      client: "Michael Chen",
      company: "Google",
      quote:
        "A paradigm shift in how we approach interface design. The 'window stack' metaphor they engineered for our dashboard is now a standard across our internal tools.",
      source: "CLUTCH",
      headerCode: "(UX_DIRECTOR)",
    },
    {
      id: 4,
      client: "Elena Rodriguez",
      company: "Spotify",
      quote:
        "Efficient, elegant, and educational. They left our engineers better than they found them.",
      source: "E-MAIL",
      headerCode: "(ENG_MANAGER)",
    },
  ],
} as const;

export const paradigmShiftContent = {
  title: {
    line1: "the_paradigm",
    line2: "shift_",
  },
  description:
    "We're not competing with other consultants or software vendors. We're teaching companies to build a capability that makes both obsolete. When every employee can build their own tools, and we orchestrate those tools into an intelligence layer, you get something no vendor could ever deliver: perfect fit, zero adoption friction, and capabilities that emerge from actual use rather than imagined requirements.",
  defaultActiveIndex: 2,
  items: [
    {
      id: "EB001",
      title: "Defence & Military",
      slug: "defense-military",
      description:
        "Mission-critical AI systems with security-first architecture. We build decision support tools that operate in contested environments, maintain human oversight, and meet the strictest compliance requirements.",
      cta: "LEARN MORE",
    },
    {
      id: "EB001",
      title: "Aerospace",
      slug: "aerospace",
      description:
        "From predictive maintenance to supply chain optimization. We help aerospace companies build AI capabilities that reduce costs, improve safety margins, and accelerate certification timelines.",
      cta: "LEARN MORE",
    },
    {
      id: "EB001",
      title: "Enterprise",
      slug: "enterprise",
      description:
        "Stop buying dashboards. Start building what your people actually use. In one sprint, your team will ship a working AI pipeline and a clear build vs buy vs orchestrate plan. We'll tell you what not to automate-and where AI truly pays back.",
      cta: "LEARN MORE",
    },
    {
      id: "EB001",
      title: "Government",
      slug: "government",
      description:
        "Citizen-centric AI that improves service delivery while maintaining transparency and accountability. We navigate procurement complexity and build systems that work within existing infrastructure.",
      cta: "LEARN MORE",
    },
  ],
} as const;

export const teamContent = {
  title: "our people",
  subtitle:
    "We're a rag-tag bunch and proud of it. Spanning backgrounds across the research, data, blockchain, army, business and strategy landscape we work hard, get on, and prioritise culture.",
  linkedinLabel: "in",
  defaultActiveIndex: 2,
  people: [
    {
      id: "jake",
      code: "EB-CEO/",
      name: "Jake Van Clief",
      role: "THE CEO",
      email: "theceo@eduba.io",
      description:
        "Former fintech operator focused on turning AI strategy into shipped systems with real operational lift.",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "david",
      code: "EB001/",
      name: "David McDermott",
      role: "THE CTO",
      email: "thecto@eduba.io",
      description:
        "Built data platforms and audit tooling for regulated teams, with a bias toward practical, maintainable stacks.",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "kay",
      code: "EB001/",
      name: "Kay K.",
      role: "FRONTEND & DESIGN LEAD",
      email: "thefrontendguy@eduba.io",
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "nick",
      code: "EB001/",
      name: "Nick",
      role: "THE CTO",
      email: "thecto@eduba.io",
      description:
        "Leads platform reliability and workflow automation with a product-first mindset and pragmatic delivery.",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "claire",
      code: "EB001/",
      name: "Claire",
      role: "FRONTEND & DESIGN LEAD",
      email: "thefrontendguy@eduba.io",
      description:
        "Designs end-to-end experiences and front-end systems that scale with complex workflows.",
      linkedin: "https://www.linkedin.com/",
    },
  ],
} as const;
