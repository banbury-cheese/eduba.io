"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ThreeWheelStrategy.module.scss";

gsap.registerPlugin(ScrollTrigger);

const sections = [
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
      "Human-in-the-loop multimodal systems that connect your tools, your data, and your people. Not replacing humans—amplifying them.",
    wheelKey: "orchestration",
  },
];

export function ThreeWheelStrategy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!track || !viewport) return;

    const scroller = track.closest("main") || window;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        viewport.querySelectorAll(`.${styles.card}`),
      );
      const bodies = gsap.utils.toArray<HTMLElement>(
        viewport.querySelectorAll(`.${styles.sectionBody}`),
      );
      const wheelGroups = gsap.utils.toArray<SVGGElement>(
        viewport.querySelectorAll(`.${styles.wheelGroup}`),
      );

      const connector1 = viewport.querySelector(`.${styles.connector1}`);
      const connector2 = viewport.querySelector(`.${styles.connector2}`);
      const connector3 = viewport.querySelector(`.${styles.connector3}`);

      // --- CONFIG ---
      // We want distinct headers visible at the bottom.
      const headerHeight = 80;
      const cardGap = 0;
      const vh = window.innerHeight;

      // Bottom Stack Positions
      // Card 3 (Bottom): 100vh - 80px (just visible)
      // Card 2 (Above 3): 100vh - 160px
      const stack3Pos = vh - 150; // More space for bottom card
      const stack2Pos = vh - 280; // More space for middle card

      // Top Stack Positions
      // Card 1: 0
      // Card 2: 80
      // Card 3: 160
      const top2Pos = 80;
      const top3Pos = 160;

      // --- INITIAL STATE: CARDS ---

      // Card 1: Open at Top
      gsap.set(cards[0], { y: 0, zIndex: 1 });

      // Card 2: Pinned at Bottom Stack 1
      gsap.set(cards[1], { y: stack2Pos, zIndex: 2 });

      // Card 3: Pinned at Bottom Stack 2 (Very bottom)
      gsap.set(cards[2], { y: stack3Pos, zIndex: 3 });

      // Bodies
      // Card 1 Open, others Collapsed (Hidden)
      gsap.set(bodies[0], { opacity: 1, height: "auto" });
      gsap.set(bodies[1], { opacity: 0, height: 0 });
      gsap.set(bodies[2], { opacity: 0, height: 0 });

      // --- INITIAL STATE: WHEEL ---
      // No scaling, full opacity initially (or maybe slight opacity diff for inactive?)
      // User said "remove scaling effect entirely... add color change"
      // Let's set all to neutral first.
      const inactiveFill = "rgba(162, 119, 122, 0.1)";
      const activeFill = "rgba(162, 119, 122, 0.4)"; // Darker/Richer when active

      // Helper to set initial state
      wheelGroups.forEach((g, i) => {
        // Reset transforms
        gsap.set(g, { transformOrigin: "center", scale: 1, opacity: 1 });
        // Set initial fill
        const path = g.querySelector("path");
        if (path) {
          gsap.set(path, { fill: i === 0 ? activeFill : inactiveFill });
        }
      });

      // --- INITIAL STATE: CONNECTORS ---
      const dashArray = "10 10";
      gsap.set([connector1, connector2, connector3], {
        strokeDasharray: dashArray,
        strokeDashoffset: 0,
        opacity: 1, // Ensure visibility
      });

      // --- TIMELINE ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          scroller: scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // Duration config
      const moveDur = 1;
      const expandDur = 0.5;
      const readHold = 0.5;
      const buffer = 0.1;

      // Exact total duration of the sequence
      // Stage 1 Move (1) + Expand (0.5) + Hold (0.5) + Stage 2 Move (1) + Expand (0.5) + Buffer (0.1)
      // Note: We are sequencing in absolute time, so total is logical end point.
      const totalDur =
        moveDur + expandDur + readHold + moveDur + expandDur + buffer;

      // --- GLOBAL: CONNECTORS FLOW ---
      // We start at time 0. The dash animation must last exactly `totalDur`
      // so it finishes exactly when the scroll finishes.

      // Connectors 1 & 3: Forward Flow
      if (connector1 && connector3) {
        tl.to(
          [connector1, connector3],
          {
            strokeDashoffset: -400,
            duration: totalDur,
            ease: "none",
          },
          0,
        );
      }

      // Connector 2: Reverse Flow (Opposite Direction)
      if (connector2) {
        tl.to(
          connector2,
          {
            strokeDashoffset: 400, // Positive value for opposite direction
            duration: totalDur,
            ease: "none",
          },
          0,
        );
      }

      // --- STAGE 1: Card 2 Enters ---
      // Explicitly start at 0 to ensure we run parallel to the dash anim

      // 1. Move Up (Collapsed)
      tl.to(
        cards[1],
        { y: top2Pos, duration: moveDur, ease: "power2.inOut" },
        0,
      );
      // tl.to(cards[2], { y: stack2Pos, duration: moveDur, ease: "power2.inOut" }, 0);

      // Wheel Color Transition (1 -> 2)
      const path1 = wheelGroups[0].querySelector("path");
      const path2 = wheelGroups[1].querySelector("path");

      if (path1) tl.to(path1, { fill: inactiveFill, duration: moveDur }, 0);
      if (path2) tl.to(path2, { fill: activeFill, duration: moveDur }, 0);

      // 2. Expand/Collapse (starts after moveDur)
      const stage1ExpandStart = moveDur - expandDur;
      tl.to(
        bodies[1],
        {
          opacity: 1,
          height: "auto",
          duration: expandDur,
          ease: "power4.inOut",
        },
        stage1ExpandStart,
      );
      tl.to(
        bodies[0],
        { opacity: 0, height: 0, duration: expandDur, ease: "power4.inOut" },
        stage1ExpandStart,
      );

      // 3. Read Hold
      // We just advance the insertion point logically, but we are placing things absolutely/relatively now.
      const stage2MoveStart = stage1ExpandStart + expandDur + readHold;

      // --- STAGE 2: Card 3 Enters ---

      // 1. Move Up (Collapsed)
      tl.to(
        cards[2],
        { y: top3Pos, duration: moveDur, ease: "power2.inOut" },
        stage2MoveStart,
      );

      // Wheel Color Transition (2 -> 3)
      const path3 = wheelGroups[2].querySelector("path");
      if (path2)
        tl.to(
          path2,
          { fill: inactiveFill, duration: moveDur },
          stage2MoveStart,
        );
      if (path3)
        tl.to(path3, { fill: activeFill, duration: moveDur }, stage2MoveStart);

      // 2. Expand/Collapse
      const stage2ExpandStart = stage2MoveStart + moveDur;
      tl.to(
        bodies[2],
        {
          opacity: 1,
          height: "auto",
          duration: expandDur,
          ease: "power4.inOut",
        },
        stage2ExpandStart - expandDur,
      );
      tl.to(
        bodies[1],
        { opacity: 0, height: 0, duration: expandDur, ease: "power4.inOut" },
        stage2ExpandStart - expandDur,
      );

      // Buffer to maintain timeline length
      tl.to({}, { duration: buffer });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={trackRef} className={styles.track}>
      <div ref={viewportRef} className={styles.stickyViewport}>
        <div className={styles.wheelSide}>
          <div className={styles.wheelContent}>
            <div className={styles.header}>
              <h2 className={styles.title}>The Three Wheel Strategy</h2>
              <p className={styles.subtitle}>
                We&apos;re not selling software or consulting. We&apos;re
                building a new operational paradigm where every employee becomes
                a solution architect.
              </p>
            </div>

            <div className={styles.wheelContainer}>
              <svg
                width="611"
                height="688"
                viewBox="0 0 611 688"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.wheelSvg}
              >
                {/* Connectors - All flowing simultaneously */}

                {/* Connector 1 */}
                <line
                  x1="309"
                  y1="142"
                  x2="74"
                  y2="550"
                  stroke="#390509"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className={styles.connector1}
                />

                {/* Connector 2 */}
                <line
                  x1="309"
                  y1="142"
                  x2="499"
                  y2="489"
                  stroke="#390509"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className={styles.connector2}
                />

                {/* Connector 3 */}
                <line
                  x1="74"
                  y1="555"
                  x2="499"
                  y2="494"
                  stroke="#390509"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className={styles.connector3}
                />

                {/* Node 1: Top Center (309, 142) */}
                <g className={styles.wheelGroup}>
                  {/* Background Shape */}
                  <path
                    style={{ transform: "translate(11px, 5px);" }}
                    d="M308 0.5C387.261 0.5 451.5 63.6361 451.5 141.5C451.5 219.364 387.261 282.5 308 282.5C228.739 282.5 164.5 219.364 164.5 141.5C164.5 63.6361 228.739 0.5 308 0.5Z"
                    stroke="#A2777A"
                    fill="rgba(162, 119, 122, 0.1)"
                  />
                  {/* Dashed Orbit */}
                  <ellipse
                    cx="325"
                    cy="149"
                    rx="144"
                    ry="141.5"
                    stroke="#5D3136"
                    strokeDasharray="4 4"
                  />
                  {/* Hub */}
                  <circle
                    cx="325"
                    cy="149"
                    r="9"
                    stroke="#390509"
                    strokeWidth="2"
                    fill="#FBF8F6"
                  />
                  {/* Label */}
                  <text
                    x="319"
                    y="90"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 14 }}
                  >
                    DEMOCRATISE BUILDING
                  </text>
                  <text
                    x="245"
                    y="160"
                    textAnchor="middle"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 9 }}
                  >
                    Non Technical Builders
                  </text>
                  <text
                    x="400"
                    y="200"
                    textAnchor="middle"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 9 }}
                  >
                    6Wk POCs
                  </text>
                </g>

                {/* Node 2: Bottom Left (80, 608) */}
                <g
                  style={{ transform: "translate(-0px, -60px);" }}
                  className={styles.wheelGroup}
                >
                  <path
                    d="M78 531.5C120.811 531.5 155.5 565.535 155.5 607.5C155.5 649.465 120.811 683.5 78 683.5C35.1887 683.5 0.5 649.465 0.5 607.5C0.5 565.535 35.1887 531.5 78 531.5Z"
                    stroke="#A2777A"
                    fill="rgba(162, 119, 122, 0.1)"
                  />
                  <ellipse
                    cx="82"
                    cy="610.5"
                    rx="78"
                    ry="76.5"
                    stroke="#5D3136"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx="80"
                    cy="608"
                    r="9"
                    stroke="#390509"
                    strokeWidth="2"
                    fill="#FBF8F6"
                  />
                  <text
                    x="80"
                    y="650"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 11 }}
                  >
                    LEARN &amp; OPTIMIZE
                  </text>
                  <text
                    x="70"
                    y="570"
                    transform="rotate(-35 80 600)"
                    textAnchor="middle"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 8 }}
                  >
                    buy what matters
                  </text>
                </g>

                {/* Node 3: Bottom Right (525, 519) */}
                <g className={styles.wheelGroup}>
                  <path
                    d="M521.5 433.5C569.557 433.5 608.5 471.788 608.5 519C608.5 566.212 569.557 604.5 521.5 604.5C473.443 604.5 434.5 566.212 434.5 519C434.5 471.788 473.443 433.5 521.5 433.5Z"
                    stroke="#A2777A"
                    fill="rgba(162, 119, 122, 0.1)"
                  />
                  <ellipse
                    cx="525"
                    cy="521.5"
                    rx="85"
                    ry="83.5"
                    stroke="#5D3136"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx="525"
                    cy="519"
                    r="9"
                    stroke="#390509"
                    strokeWidth="2"
                    fill="#FBF8F6"
                  />
                  <text
                    x="525"
                    y="560"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 11 }}
                  >
                    THE ORCHESTRATION
                  </text>
                  <text
                    x="525"
                    y="575"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 11 }}
                  >
                    LAYER
                  </text>
                  <text
                    x="500"
                    y="490"
                    textAnchor="middle"
                    transform="rotate(40 525 560)"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 11 }}
                  >
                    Human in the loop
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Cards */}
        <div className={styles.cardsSide}>
          {sections.map((section) => (
            <div key={section.id} className={styles.card}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>{section.id}</div>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
              </div>

              <div className={styles.sectionBody}>
                <p className={styles.sectionDescription}>
                  {section.description}
                </p>
                <button className={styles.consultButton}>
                  BOOK CONSULTATION
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
