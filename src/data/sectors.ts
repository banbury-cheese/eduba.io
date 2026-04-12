import type { Sector } from "@/lib/sectorTypes";

export const fallbackSectors: Sector[] = [
  {
    slug: "defense-military",
    title: "Defence & Intelligence",
    pageIndex: "001",
    pageTag: "DEFENSE AI INTEGRATION",
    hero: {
      title: "Mission-ready AI\nfor defense teams.",
      subtitle:
        "We help defense and intelligence teams decide where AI belongs, build the systems that hold up under real constraints, and train operators to run them with confidence.",
      ctaLabel: "START A CONVERSATION",
      ctaHref: "mailto:theceo@eduba.io",
      exploreLabel: "EXPLORE",
    },
    consulting: {
      label: "Consulting",
      title: "Your Defense AI Partners",
      description: [
        "Find a partner who ships mission-ready AI systems your teams can run, extend, and certify.",
        "We turn ad hoc pilots into governed multi-agent systems with human oversight, evaluation harnesses, and clean handover. Your people keep the skills and the IP.",
      ],
      cards: [
        {
          id: "/001",
          title: "multi-agent compliance",
          body: "we build platforms like VigilOre — specialized agents for document intake, aggregation, comparison, and reporting across multilingual regulatory frameworks. 160+ hours reduced to under 5 minutes.",
        },
        {
          id: "/002",
          title: "security & compliance built-in",
          body: "we design with rmf, zero trust, and audit trails from day one so approvals move faster and risk stays visible.",
        },
        {
          id: "/003",
          title: "resilient multi-model ops",
          body: "one model is a single point of failure. we add comparison, arbitration, and fallback across models and rules so outputs are explainable, measurable, and robust under drift.",
        },
      ],
    },
    whyUs: {
      label: "Why us",
      title: "Why defense teams work with us",
      items: [
        {
          id: "01",
          title: "VETERAN-OWNED",
          description:
            "8 years USMC experience on cryptographic systems and fighter jet avionics. We understand mission-critical environments.",
        },
        {
          id: "02",
          title: "TRUTH OVER HYPE",
          description:
            "clear go/no-go guidance for mission fit; we will say no when automation is unsafe.",
        },
        {
          id: "03",
          title: "WORKING SYSTEMS > POWERPOINTS",
          description:
            "we ship something real your operators can extend — measured by decision time, accuracy, or mission impact.",
        },
        {
          id: "04",
          title: "PROVEN DELIVERY",
          description:
            "VigilOre reduced 160+ hours of manual compliance to under 5 minutes per cycle.",
        },
        {
          id: "05",
          title: "CAPABILITY TRANSFER",
          description:
            "pair-building, readable code, internal playbooks; your team keeps the patterns and the IP.",
        },
        {
          id: "06",
          title: "GOVERNANCE BUILT-IN",
          description:
            "role-based access, red-team tests, and policy-grade audit trails from day one.",
        },
      ],
    },
    services: {
      label: "Services",
      title: "Examples of the work",
      intro:
        "The scope follows the mission. Sometimes that means a briefing or a design sprint. Sometimes it means a governed product build with human review, testing, and handover.",
      cards: [
        {
          id: "/001",
          title: "executive advisory",
          price: "",
          body: "mission fit assessment, program triage, and a 90-day build vs buy vs orchestrate map.",
        },
        {
          id: "/002",
          title: "capability workshops",
          price: "",
          body: "ai literacy to mission capability, pipeline design sprint, and governance bootcamps aligned to your environment.",
        },
        {
          id: "/003",
          title: "rapid prototyping",
          price: "",
          body: "4-week POCs for intel triage, logistics planning, compliance automation, or training copilots.",
        },
        {
          id: "/004",
          title: "multi-agent systems",
          price: "",
          body: "full product builds like VigilOre — specialized agents for document intake, aggregation, comparison, and reporting.",
        },
        {
          id: "/005",
          title: "ethics & evaluation engine",
          price: "",
          body: "bias and robustness tests, red-team exercises, and reporting that safety boards can sign off on.",
        },
      ],
    },
    methodology: {
      label: "Our methodology",
      title: "How defense delivery works",
      steps: [
        {
          id: "01",
          title: "DISCOVERY",
          description: "stakeholders, constraints, and a truth-first mission scan.",
        },
        {
          id: "02",
          title: "WORKFLOW AUDIT",
          description:
            "we learn what your people actually do — where time disappears, what's high-stakes, what's tedious.",
        },
        {
          id: "03",
          title: "BUILD THE POC",
          description:
            "pair-build a mission-ready system with evaluation from day one.",
        },
        {
          id: "04",
          title: "PILOT & MEASURE",
          description:
            "ship to a small unit; instrument success (time saved, error rate, mission outcome).",
        },
        {
          id: "05",
          title: "SCALE & CONNECT",
          description:
            "connect the system to data sources, tools, and human oversight; add multi-model logic where needed.",
        },
        {
          id: "06",
          title: "HANDOVER",
          description:
            "docs, runbooks, training, and a roadmap you can execute without us.",
        },
      ],
    },
    engagement: {
      label: "Choice",
      title: "Choose the Engagement Model That Suits You Best",
      intro:
        "What you get — mission-ready system, governance model, team capability, 100% IP retained. What you won't — buzzword decks, lock-in, dependency.",
      cards: [
        {
          id: "/001",
          title: "advisory sprint",
          body: "fixed-scope clarity: mission map, risk register, and first POC spec.",
        },
        {
          id: "/002",
          title: "co-build squad",
          body: "2-4 of your builders + our architect/engineer to ship a POC in 4-6 weeks.",
        },
        {
          id: "/003",
          title: "full product build",
          body: "we lead end-to-end delivery, with governance and adoption baked in — then hand it back.",
        },
      ],
    },
    faq: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "how do we select a mission-critical use case?",
          answer:
            "We score candidate workflows by impact, feasibility, and risk, then pick 1-2 to prove value fast.",
        },
        {
          question: "can you work in air-gapped or classified environments?",
          answer:
            "Yes. We design for on-prem and restricted networks and align to your security controls.",
        },
        {
          question: "how do you handle safety, security, and compliance?",
          answer:
            "We build in RMF, audit trails, red-team tests, and human-in-the-loop gates from day one.",
        },
        {
          question: "can our team maintain this without you?",
          answer:
            "Yes. We pair-build, document, and train so you keep the patterns and IP.",
        },
        {
          question: "what's your track record?",
          answer:
            "VigilOre reduced 160+ hours of manual compliance to under 5 minutes. Our founder has 8 years USMC experience on cryptographic systems.",
        },
        {
          question: "what if automation increases risk?",
          answer:
            "We use human gates and fallback logic; if risk is too high, we recommend not automating.",
        },
      ],
    },
    cta: {
      label: "CONTACT",
      title: "If the mission problem is real, write to us.",
      buttonLabel: "theceo@eduba.io",
      buttonHref: "mailto:theceo@eduba.io",
    },
  },
  {
    slug: "enterprise",
    title: "Enterprise",
    pageIndex: "002",
    pageTag: "ENTERPRISE AI TRAINING",
    hero: {
      title: "Your team already has AI tools.\nWe help them use them well.",
      subtitle:
        "We learn the workflow first, train people on their real work, and build the systems that hold up after the workshop is over. That is how adoption stays high and the work becomes usable.",
      ctaLabel: "START A CONVERSATION",
      ctaHref: "mailto:theceo@eduba.io",
      exploreLabel: "EXPLORE",
    },
    consulting: {
      label: "Consulting",
      title: "Your Enterprise AI Training Partners",
      description: [
        "Find a partner who trains your teams on AI that sticks — 95% sustained adoption after 30 days vs the ~10% industry average.",
        "We learn your workflows first, train on what the audit uncovered, then build what makes sense to automate. Your people keep the skills and the IP.",
      ],
      cards: [
        {
          id: "/001",
          title: "workflow-first training",
          body: "before we train anyone, we spend time understanding what your team actually does. what tools they use, where time disappears, what's tedious, what's high-stakes.",
        },
        {
          id: "/002",
          title: "no generic curriculum",
          body: "every session is built around the specific opportunities we found. your team works with their own tasks, their own data, in real time.",
        },
        {
          id: "/003",
          title: "build what makes sense",
          body: "some things should be automated. most shouldn't. we help you tell the difference, then build the agents and workflows that actually earn back the investment.",
        },
      ],
    },
    whyUs: {
      label: "Why us",
      title: "Why enterprise teams work with us",
      items: [
        {
          id: "01",
          title: "95% SUSTAINED ADOPTION",
          description:
            "95% of trainees still using what we taught after 30 days. The industry average is around 10%.",
        },
        {
          id: "02",
          title: "600+ PEOPLE TRAINED",
          description:
            "across Pacific Life, Colgate-Palmolive, KPMG UK, IAG, and university programs.",
        },
        {
          id: "03",
          title: "TRUTH OVER HYPE",
          description:
            "clear use/don't use guidance for your context; we will say no when AI isn't the answer.",
        },
        {
          id: "04",
          title: "6-9K HOURS SAVED ANNUALLY",
          description:
            "from the workflows teams built during the Pacific Life and Colgate-Palmolive programs.",
        },
        {
          id: "05",
          title: "CAPABILITY TRANSFER",
          description:
            "pair-building, readable code, internal playbooks; your team keeps the patterns and the IP.",
        },
        {
          id: "06",
          title: "TRUSTED BY",
          description:
            "Pacific Life, Colgate-Palmolive, KPMG UK, IAG, University of Edinburgh, Correlation One.",
        },
      ],
    },
    services: {
      label: "Services",
      title: "Examples of the work",
      intro:
        "The format follows the work. Some teams need an executive session. Some need multi-day training. Some need paired implementation after the training reveals what should be built.",
      cards: [
        {
          id: "/001",
          title: "executive briefing",
          price: "",
          body: "executive alignment on what AI can actually do. Cut through vendor noise and hype cycles, tailored to your industry.",
        },
        {
          id: "/002",
          title: "implementation readiness",
          price: "",
          body: "workflow audit, opportunity mapping, and a clear build vs buy vs automate assessment for your org.",
        },
        {
          id: "/003",
          title: "multi-day training",
          price: "",
          body: "hands-on sessions built entirely around your existing workflows. Your team works with their own tasks, their own data, in real time.",
        },
        {
          id: "/004",
          title: "technical implementation",
          price: "",
          body: "we build the agents and workflows that actually earn back the investment. Your team pairs with us and keeps the IP.",
        },
        {
          id: "/005",
          title: "ongoing advisory",
          price: "",
          body: "sustained support to ensure adoption sticks and your team continues to build on what they learned.",
        },
      ],
    },
    methodology: {
      label: "Our methodology",
      title: "How enterprise delivery works",
      steps: [
        {
          id: "01",
          title: "LEARN YOUR WORKFLOWS",
          description:
            "we spend time understanding what your team actually does. what tools they use, where time disappears.",
        },
        {
          id: "02",
          title: "TRAIN ON WHAT WE FOUND",
          description:
            "no generic curriculum. every session is built around the specific opportunities the audit uncovered.",
        },
        {
          id: "03",
          title: "BUILD WHAT MAKES SENSE",
          description:
            "some things should be automated. most shouldn't. we help you tell the difference.",
        },
        {
          id: "04",
          title: "MEASURE ADOPTION",
          description:
            "we instrument time saved, adoption rates, and real outcomes — not slide count.",
        },
        {
          id: "05",
          title: "ITERATE & EXPAND",
          description:
            "double down on what works, cut what doesn't. expand to new teams and workflows.",
        },
        {
          id: "06",
          title: "HANDOVER",
          description:
            "your team owns the capability. docs, playbooks, and a roadmap you can execute without us.",
        },
      ],
    },
    engagement: {
      label: "Choice",
      title: "Choose the Engagement Model That Suits You Best",
      intro:
        "What you get — trained team, working agents, adoption that sticks, 100% IP retained. What you won't — buzzword decks, lock-in, dependency.",
      cards: [
        {
          id: "/001",
          title: "executive briefing",
          body: "60-90 minutes: clear-eyed view of AI capabilities and strategic implications for your org.",
        },
        {
          id: "/002",
          title: "training program",
          body: "multi-day sessions for your teams built around their actual workflows and data.",
        },
        {
          id: "/003",
          title: "full engagement",
          body: "audit, train, build, and measure — end-to-end with governance and adoption baked in.",
        },
      ],
    },
    faq: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "what makes your training different?",
          answer:
            "We learn your workflows first. Every session uses your team's actual tasks, data, and tools — not generic demos.",
        },
        {
          question: "what's your adoption rate?",
          answer:
            "95% of trainees still using what we taught after 30 days. The industry average for AI training adoption is around 10%.",
        },
        {
          question: "who have you trained?",
          answer:
            "600+ people across Pacific Life, Colgate-Palmolive, KPMG UK, IAG, University of Edinburgh, and related partner programs.",
        },
        {
          question: "can our team maintain this without you?",
          answer:
            "Yes. That's the point. We pair-build, document, and train so your team owns the capability.",
        },
        {
          question: "how do you prove ROI?",
          answer:
            "We instrument time saved, adoption rates, and real outcomes. Pacific Life and Colgate-Palmolive track 95 percent thirty-day adoption and 6-9K hours saved annually.",
        },
        {
          question: "what if AI isn't right for our problem?",
          answer:
            "We will tell you. If automation isn't the answer, we'll recommend a different path.",
        },
      ],
    },
    cta: {
      label: "CONTACT",
      title: "If this matches what your team needs, write to us.",
      buttonLabel: "theceo@eduba.io",
      buttonHref: "mailto:theceo@eduba.io",
    },
  },
  {
    slug: "education-research",
    title: "Education & Research",
    pageIndex: "003",
    pageTag: "EDUCATION AI INTEGRATION",
    hero: {
      title: "AI work for faculty,\nresearchers, and students.",
      subtitle:
        "We work with academic teams that want durable AI literacy, better evaluation habits, and delivery that fits research and teaching rather than distorting it.",
      ctaLabel: "START A CONVERSATION",
      ctaHref: "mailto:theceo@eduba.io",
      exploreLabel: "EXPLORE",
    },
    consulting: {
      label: "Consulting",
      title: "Your Education & Research AI Partners",
      description: [
        "Faculty workshops, published research, and curriculum programs that bridge theory-practice gaps.",
        "From Flagler College to Edinburgh Futures Institute — we've been working with educators since 2022, turning skeptics into thoughtful adopters.",
      ],
      cards: [
        {
          id: "/001",
          title: "faculty AI workshops",
          body: "hands-on sessions where faculty discover how AI connects to their actual research and teaching. Built around their disciplines, not generic demos.",
        },
        {
          id: "/002",
          title: "published research",
          body: "psychometric assessment of large language models, AI governance research, and soft power measurement. Published at UKICER 2025 and arxiv.",
        },
        {
          id: "/003",
          title: "curriculum development",
          body: "programs that teach principles over procedures and critical output assessment. Students and faculty building first versions gain deeper understanding.",
        },
      ],
    },
    whyUs: {
      label: "Why us",
      title: "Why academic teams work with us",
      items: [
        {
          id: "01",
          title: "PUBLISHED RESEARCHERS",
          description:
            "The Ethics Engine published at UKICER 2025. Psychometric assessment of LLMs via University of Edinburgh's Neuroplastics Lab.",
        },
        {
          id: "02",
          title: "SINCE 2022",
          description:
            "from Flagler College faculty workshops to Edinburgh Futures Institute — this is where it all started.",
        },
        {
          id: "03",
          title: "PRINCIPLES OVER PROCEDURES",
          description:
            "we teach abstract fundamentals independent of platform changes so knowledge doesn't expire with the next update.",
        },
        {
          id: "04",
          title: "SKEPTICS WELCOME",
          description:
            "the people most skeptical of AI often become its most thoughtful adopters, if someone takes the time to connect it to their actual work.",
        },
        {
          id: "05",
          title: "INTERNATIONAL REACH",
          description:
            "British Council, Academy of International Affairs NRW, Ben Gurion University, 25+ countries represented.",
        },
        {
          id: "06",
          title: "40+ PROFESSORS TRAINED",
          description:
            "at University of Edinburgh on AI integration into their research and teaching practice.",
        },
      ],
    },
    services: {
      label: "Services",
      title: "Examples of the work",
      intro:
        "The work ranges from faculty workshops to research partnerships and curriculum design. The common thread is that the material stays useful after the tool changes.",
      cards: [
        {
          id: "/001",
          title: "faculty workshops",
          price: "",
          body: "hands-on sessions where faculty discover how AI connects to their actual research and teaching disciplines.",
        },
        {
          id: "/002",
          title: "AI ethics briefings",
          price: "",
          body: "governance frameworks, ethical considerations, and policy implications for academic and policy audiences.",
        },
        {
          id: "/003",
          title: "research partnerships",
          price: "",
          body: "psychometric assessment, AI evaluation methodology, and published research collaborations.",
        },
        {
          id: "/004",
          title: "curriculum programs",
          price: "",
          body: "design and delivery of AI curriculum that teaches critical thinking and principles over tool-specific procedures.",
        },
        {
          id: "/005",
          title: "student programs",
          price: "",
          body: "AI literacy programs that prepare students for a world where understanding AI systems is a baseline skill.",
        },
      ],
    },
    methodology: {
      label: "Our methodology",
      title: "How work gets adopted in academic settings",
      steps: [
        {
          id: "01",
          title: "UNDERSTAND THE DISCIPLINE",
          description:
            "we learn the research area, teaching context, and where AI might genuinely help — or hinder.",
        },
        {
          id: "02",
          title: "CONNECT TO ACTUAL WORK",
          description:
            "every session is built around the faculty's real research, teaching, or administrative challenges.",
        },
        {
          id: "03",
          title: "TEACH PRINCIPLES",
          description:
            "abstract fundamentals and critical output assessment that survive platform changes.",
        },
        {
          id: "04",
          title: "BUILD TOGETHER",
          description:
            "faculty and students build first versions — gaining deeper understanding through practice.",
        },
        {
          id: "05",
          title: "PUBLISH & SHARE",
          description:
            "research findings published at conferences and journals. Knowledge shared, not hoarded.",
        },
        {
          id: "06",
          title: "SUSTAIN",
          description:
            "ongoing advisory to ensure institutions continue to evolve their AI capability.",
        },
      ],
    },
    engagement: {
      label: "Choice",
      title: "Choose the Engagement Model That Suits You Best",
      intro:
        "What you get — trained faculty, published research, curriculum that lasts, institutional capability. What you won't — vendor lock-in or knowledge that expires.",
      cards: [
        {
          id: "/001",
          title: "workshop series",
          body: "faculty workshops tailored to specific departments and research areas.",
        },
        {
          id: "/002",
          title: "research partnership",
          body: "co-authored research, evaluation methodology, and published findings.",
        },
        {
          id: "/003",
          title: "institutional program",
          body: "comprehensive curriculum design, faculty training, and ongoing advisory.",
        },
      ],
    },
    faq: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "what's your academic background?",
          answer:
            "MSc Future Governance from University of Edinburgh. Published research at UKICER 2025 and in collaboration with the Neuroplastics Lab.",
        },
        {
          question: "do you work with skeptical faculty?",
          answer:
            "That's our specialty. The people most skeptical of AI often become its most thoughtful adopters when someone connects it to their actual work.",
        },
        {
          question: "what research have you published?",
          answer:
            "The Ethics Engine (psychometric assessment of LLMs), ICR soft power research for British Council, and AI governance work presented at international conferences.",
        },
        {
          question: "can you work with our existing curriculum?",
          answer:
            "Yes. We design around your existing programs and disciplines, not the other way around.",
        },
        {
          question: "what institutions have you worked with?",
          answer:
            "University of Edinburgh, Flagler College, Edinburgh Futures Institute, Academy of International Affairs NRW, British Council.",
        },
        {
          question: "do you offer student programs?",
          answer:
            "Yes. AI literacy programs that teach critical thinking about AI systems, not just how to use specific tools.",
        },
      ],
    },
    cta: {
      label: "CONTACT",
      title: "If your institution is working through this now, write to us.",
      buttonLabel: "theceo@eduba.io",
      buttonHref: "mailto:theceo@eduba.io",
    },
  },
  {
    slug: "government",
    title: "Government & Policy",
    pageIndex: "004",
    pageTag: "GOVERNMENT AI GOVERNANCE",
    hero: {
      title: "AI work for government\nand policy teams.",
      subtitle:
        "We work with public institutions on governance, evaluation, briefings, and carefully scoped systems. The emphasis is on public trust, clear ownership, and procurement reality.",
      ctaLabel: "START A CONVERSATION",
      ctaHref: "mailto:theceo@eduba.io",
      exploreLabel: "EXPLORE",
    },
    consulting: {
      label: "Consulting",
      title: "Your Government & Policy AI Partners",
      description: [
        "AI ethics briefings, governance frameworks, and practical policy guidance for public institutions.",
        "Working with the British Council, Academy of International Affairs NRW, and institutions across 25+ countries on AI governance and soft power measurement.",
      ],
      cards: [
        {
          id: "/001",
          title: "AI ethics & governance",
          body: "briefings for ambassadors, policymakers, and international affairs experts on AI's impact on governance, soft power, and institutional decision-making.",
        },
        {
          id: "/002",
          title: "policy frameworks",
          body: "practical governance frameworks that balance innovation with accountability, transparency, and citizen trust.",
        },
        {
          id: "/003",
          title: "research & evaluation",
          body: "psychometric assessment of AI systems, soft power measurement with ML and NLP, and published research that informs policy decisions.",
        },
      ],
    },
    whyUs: {
      label: "Why us",
      title: "Why public institutions work with us",
      items: [
        {
          id: "01",
          title: "INTERNATIONAL CREDIBILITY",
          description:
            "AI ethics briefings to ambassadors from 25+ countries at the Academy of International Affairs NRW in Bonn.",
        },
        {
          id: "02",
          title: "PUBLISHED RESEARCH",
          description:
            "British Council-commissioned soft power research using ML and NLP. Ethics Engine published via University of Edinburgh.",
        },
        {
          id: "03",
          title: "TRUTH OVER HYPE",
          description:
            "clear guidance on where AI helps governance and where it creates risk. We will say no when AI isn't the answer.",
        },
        {
          id: "04",
          title: "GOVERNANCE BUILT-IN",
          description:
            "audit trails, ethical frameworks, and accountability structures designed for public trust.",
        },
        {
          id: "05",
          title: "VETERAN-OWNED",
          description:
            "8 years USMC. We understand classified environments, security requirements, and mission-critical systems.",
        },
        {
          id: "06",
          title: "ACADEMIC RIGOR",
          description:
            "MSc Future Governance from University of Edinburgh. Research-backed, not vendor-driven.",
        },
      ],
    },
    services: {
      label: "Services",
      title: "Examples of the work",
      intro:
        "The work can be a briefing, a research partnership, a capability workshop, or a carefully scoped build. The frame stays the same. Public trust, usable governance, and clear accountability.",
      cards: [
        {
          id: "/001",
          title: "AI ethics briefing",
          price: "",
          body: "governance implications, ethical frameworks, and practical guidance for policymakers and international affairs experts.",
        },
        {
          id: "/002",
          title: "capability workshops",
          price: "",
          body: "AI literacy to institutional capability, with governance and compliance tailored to your environment.",
        },
        {
          id: "/003",
          title: "policy research",
          price: "",
          body: "AI governance research, soft power measurement, and evaluation methodology that informs real policy decisions.",
        },
        {
          id: "/004",
          title: "rapid prototyping",
          price: "",
          body: "4-week POCs for case triage, benefits routing, compliance reviews, or citizen-facing assistants.",
        },
        {
          id: "/005",
          title: "ethics & evaluation engine",
          price: "",
          body: "psychometric assessment of AI systems, bias testing, and reporting that oversight bodies can sign off on.",
        },
      ],
    },
    methodology: {
      label: "Our methodology",
      title: "How government and policy delivery works",
      steps: [
        {
          id: "01",
          title: "UNDERSTAND THE CONTEXT",
          description:
            "stakeholders, constraints, political landscape, and a truth-first assessment of where AI fits.",
        },
        {
          id: "02",
          title: "ASSESS & TRIAGE",
          description:
            "score opportunities by public impact, feasibility, and governance requirements.",
        },
        {
          id: "03",
          title: "BUILD OR BRIEF",
          description:
            "deliver governance briefings, policy frameworks, or working systems depending on the need.",
        },
        {
          id: "04",
          title: "PILOT & MEASURE",
          description:
            "ship to a small cohort; instrument success (time saved, service quality, citizen satisfaction).",
        },
        {
          id: "05",
          title: "GOVERN & SCALE",
          description:
            "connect systems to data sources, oversight structures, and accountability frameworks.",
        },
        {
          id: "06",
          title: "HANDOVER",
          description:
            "docs, frameworks, training, and a roadmap your institution can execute independently.",
        },
      ],
    },
    engagement: {
      label: "Choice",
      title: "Choose the Engagement Model That Suits You Best",
      intro:
        "What you get — honest assessment, governance frameworks, institutional capability, 100% IP retained. What you won't — vendor agendas, lock-in, or hype.",
      cards: [
        {
          id: "/001",
          title: "policy briefing",
          body: "governance and ethics briefings for policymakers, ambassadors, and institutional leaders.",
        },
        {
          id: "/002",
          title: "research partnership",
          body: "co-authored research, evaluation methodology, and published findings that inform policy.",
        },
        {
          id: "/003",
          title: "full engagement",
          body: "end-to-end: assessment, training, building, and governance — then handover.",
        },
      ],
    },
    faq: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      items: [
        {
          question: "what's your experience with government and policy?",
          answer:
            "AI ethics briefings to ambassadors from 25+ countries. British Council-commissioned research. MSc Future Governance from University of Edinburgh.",
        },
        {
          question: "can you work within procurement constraints?",
          answer:
            "Yes. We align with your procurement processes and build audit-ready documentation from day one.",
        },
        {
          question: "how do you handle privacy and sensitive data?",
          answer:
            "We implement RBAC, data minimization, and audit trails. Our founder has 8 years USMC experience with classified systems.",
        },
        {
          question: "can our team maintain this without you?",
          answer:
            "Yes. We train, document, and hand over so your institution owns the capability.",
        },
        {
          question: "what research have you published?",
          answer:
            "The Ethics Engine (psychometric assessment of LLMs), ICR soft power research for British Council, and AI governance work for international audiences.",
        },
        {
          question: "what if AI isn't right for our program?",
          answer:
            "We will tell you and recommend a simpler or safer alternative. That's the conversation we like having.",
        },
      ],
    },
    cta: {
      label: "CONTACT",
      title: "If the institution-level problem is clear, write to us.",
      buttonLabel: "theceo@eduba.io",
      buttonHref: "mailto:theceo@eduba.io",
    },
  },
];
