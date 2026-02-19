"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Works.module.scss";

gsap.registerPlugin(ScrollTrigger);

const workThemes = {
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
} as const;

type WorkTheme = keyof typeof workThemes;

type WorkItem = {
  id: string;
  badge: string;
  title: string;
  year: string;
  client: string;
  tags: string[];
  summary: string;
  theme: WorkTheme;
};

const works: WorkItem[] = [
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
];

export function Works() {
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
        viewport.querySelectorAll(`.${styles.cardContainer}`),
      );

      // --- INITIAL STATE ---
      // Card 1: Visible (y: 0)
      gsap.set(cards[0], { y: 0, zIndex: 1 });

      // Card 2 & 3: Offscreen (y: 100vh)
      gsap.set(cards[1], { y: window.innerHeight, zIndex: 2 });
      gsap.set(cards[2], { y: window.innerHeight, zIndex: 3 });

      // --- TIMELINE ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          scroller: scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Duration for each slide
      const duration = 1;

      // Slide Card 2 Up
      tl.to(cards[1], {
        y: 0,
        duration: duration,
        ease: "power1.inOut", // Smooth slide
      });

      // Buffer/Hold
      tl.to({}, { duration: 0.2 });

      // Slide Card 3 Up
      tl.to(cards[2], {
        y: 0,
        duration: duration,
        ease: "power1.inOut",
      });

      // Final Buffer
      tl.to({}, { duration: 0.2 });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.container}>
      <div ref={trackRef} className={styles.track}>
        <div ref={viewportRef} className={styles.stickyViewport}>
          {/* Global Header/Button if needed fixed at top-right */}
          <div className={styles.header}>
            <svg
              width="280"
              height="46"
              viewBox="0 0 344 46"
              className={styles.seeAll}
            >
              <path
                fill="#000"
                d="M0 7V45.5H344L311.601 2.77064C310.277 1.02527 308.213 0 306.023 0H7C3.13401 0 0 3.13401 0 7Z"
              />
            </svg>
            <span className={styles.seeAllLabel}>SEE ALL WORKS -&gt;</span>
          </div>

          {works.map((work, index) => {
            const theme = workThemes[work.theme];
            const tagsTicker = work.tags.join(", ");

            return (
              <div
                key={work.id}
                id={`work-${work.id}`}
                className={styles.cardContainer}
                style={
                  {
                    "--work-bg": theme.bg,
                    "--work-title": theme.title,
                    "--work-meta": theme.meta,
                    "--work-tag-bg": theme.tagBg,
                    "--work-tag-text": theme.tagText,
                    "--work-divider": theme.divider,
                    "--work-placeholder-bg": theme.placeholderBg,
                    "--work-placeholder-text": theme.placeholderText,
                    "--work-summary": theme.summary,
                  } as CSSProperties
                }
              >
                <div className={styles.cardContent}>
                  {/* Tab - Offset Horizontally */}
                  <div
                    className={styles.tab}
                    style={{
                      ["--tab-offset" as string]: `${index * 250 + 40}px`,
                      zIndex: 10 + index,
                    }}
                  >
                    {/* Badge SVG */}
                    <svg
                      width="280"
                      height="46"
                      viewBox="0 0 344 46"
                      fill="none"
                      className={styles.tabSvg}
                    >
                      <path
                        className={styles.tabPath}
                        d="M0 7V45.5H344L311.601 2.77064C310.277 1.02527 308.213 0 306.023 0H7C3.13401 0 0 3.13401 0 7Z"
                      />
                    </svg>
                    <span className={styles.tabLabel}>{work.badge}</span>
                  </div>

                  {/* Body - Fills remaining space */}
                  <div className={styles.body}>
                    <div className={styles.bodyHeader}>
                      <h3 className={styles.mainTitle}>{work.title}</h3>
                      <div className={styles.metaInfo}>
                        <div className={styles.metaMain}>
                          <span className={styles.metaYear}>{work.year}</span>
                          <span className={styles.metaClient}>{work.client}</span>
                        </div>
                        <a
                          href={`#work-${work.id}`}
                          className={styles.viewProject}
                          aria-label={`View ${work.title} project`}
                        >
                          VIEW PROJECT -&gt;
                        </a>
                        <div className={styles.tagTicker} aria-hidden="true">
                          <div className={styles.tagTickerTrack}>
                            <span>{tagsTicker}</span>
                            <span>{tagsTicker}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.gallery}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.placeholder}>
                          IMAGE PLACEHOLDER
                        </div>
                      ))}
                    </div>

                    <p className={styles.summary}>{work.summary}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
