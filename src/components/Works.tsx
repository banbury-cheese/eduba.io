"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { worksContent } from "@/data/homeContent";
import styles from "./Works.module.scss";

gsap.registerPlugin(ScrollTrigger);

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
            <span className={styles.seeAllLabel}>{worksContent.seeAllLabel}</span>
          </div>

          {worksContent.items.map((work, index) => {
            const theme = worksContent.themes[work.theme];
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
                          {worksContent.viewProjectLabel}
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
                          {worksContent.imagePlaceholderLabel}
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
