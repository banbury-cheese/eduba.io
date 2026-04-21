"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { NavArrow } from "./NavArrow";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { worksContent } from "@/data/homeContent";
import styles from "./Works.module.scss";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrambleTextPlugin);

export function Works() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const getImageSrc = (
    image: (typeof worksContent.items)[number]["gallery"][number],
  ) => {
    const src = (image as { src?: string }).src;
    return typeof src === "string" && src.length > 0 ? src : null;
  };
  const scrambleLabel = (text: HTMLElement | null) => {
    if (!text) return;

    if (!text.dataset.originalLabel) {
      text.dataset.originalLabel = text.textContent || "";
    }

    gsap.killTweensOf(text);
    gsap.to(text, {
      duration: 0.8,
      scrambleText: {
        text: text.dataset.originalLabel || "",
        chars: "upperCase",
        revealDelay: 0,
        speed: 0.8,
      },
    });
  };

  const resetLabel = (text: HTMLElement | null) => {
    if (!text) return;

    gsap.killTweensOf(text);
    text.textContent = text.dataset.originalLabel || text.textContent || "";
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const scroller = track.closest("main") || window;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        viewport.querySelectorAll(`.${styles.cardContainer}`),
      );
      if (cards.length === 0) return;

      cards.forEach((card, index) => {
        gsap.set(card, {
          y: index === 0 ? 0 : window.innerHeight,
          zIndex: index + 1,
        });
      });

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

      cards.slice(1).forEach((card) => {
        tl.to(card, {
          y: 0,
          duration: duration,
          ease: "power1.inOut",
        });

        tl.to({}, { duration: 0.2 });
      });
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.container}>
      <div
        ref={trackRef}
        className={styles.track}
        style={{ height: `${worksContent.items.length * 100}vh` }}
      >
        <div ref={viewportRef} className={styles.stickyViewport}>
          <Link
            href="/works"
            className={styles.header}
            aria-label={worksContent.seeAllLabel}
          >
            {/* Desktop: original wide tab with text */}
            <span className={styles.tabDesktop} aria-hidden="true">
              <svg width="280" height="46" viewBox="0 0 344 46" fill="none" className={styles.seeAll}>
                <path fill="#111111" d="M0 7V45.5H344L311.601 2.77064C310.277 1.02527 308.213 0 306.023 0H7C3.13401 0 0 3.13401 0 7Z" />
              </svg>
              <span className={styles.seeAllLabel}>{worksContent.seeAllLabel}</span>
            </span>
            {/* Mobile: compact icon tab */}
            <span className={styles.tabMobile} aria-hidden="true">
              <NavArrow iconMarginTop="7px" direction="forward" />
            </span>
          </Link>

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
                        <Link
                          href={`/works/${work.id}`}
                          className={styles.viewProject}
                          aria-label={`View ${work.title} project`}
                          onMouseEnter={(event) => scrambleLabel(event.currentTarget)}
                          onMouseLeave={(event) => resetLabel(event.currentTarget)}
                          onFocus={(event) => scrambleLabel(event.currentTarget)}
                          onBlur={(event) => resetLabel(event.currentTarget)}
                        >
                          {worksContent.viewProjectLabel}
                        </Link>
                        <div className={styles.tagTicker} aria-hidden="true">
                          <div className={styles.tagTickerTrack}>
                            <span>{tagsTicker}</span>
                            <span>{tagsTicker}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.divider} />

                    <div
                      className={`${styles.gallery} ${
                        work.gallery.length === 1 ? styles.gallerySingle : ""
                      }`}
                    >
                      {work.gallery.map((image) =>
                        getImageSrc(image) ? (
                          <div
                            key={image.id}
                            className={styles.galleryImage}
                            style={{ backgroundImage: `url(${getImageSrc(image)})` }}
                            role="img"
                            aria-label={image.label}
                          />
                        ) : (
                          <div key={image.id} className={styles.placeholder}>
                            {image.label || worksContent.imagePlaceholderLabel}
                          </div>
                        ),
                      )}
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
