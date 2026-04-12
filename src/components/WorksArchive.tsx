"use client";

import { useState, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { NavArrow } from "./NavArrow";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { allWorksContent, worksContent, worksArchiveThemes } from "@/data/homeContent";
import styles from "./WorksArchive.module.scss";

// Desktop: tab 46px  → -49 closed (matches CSS default) / -46 open
// Mobile (≤800px): tab 42px → 0 closed (next tab sits flush below divider) / -42 open
const TABLET_BP = 800;
const getMargins = () => {
  const mobile = typeof window !== "undefined" && window.innerWidth <= TABLET_BP;
  return { closed: mobile ? 0 : -49, open: mobile ? -42 : -46 };
};

gsap.registerPlugin(ScrambleTextPlugin);

export function WorksArchive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const expandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const getImageSrc = (
    image: (typeof allWorksContent.items)[number]["gallery"][number],
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

  const handleCardClick = (index: number) => {
    const { closed: closedMargin, open: openMargin } = getMargins();
    const previousIndex = activeIndex;
    const newIndex = activeIndex === index ? null : index;

    // ── Close previous card ────────────────────────────────────────────────
    if (previousIndex !== null && previousIndex !== index) {
      const prevWrap = expandRefs.current[previousIndex];
      const prevNext = cardRefs.current[previousIndex + 1];

      if (prevWrap) {
        gsap.to(prevWrap, { height: 0, duration: 0.35, ease: "power2.inOut", overwrite: "auto" });
      }
      if (prevNext) {
        const pn = prevNext;
        gsap.to(pn, {
          marginTop: closedMargin,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => { gsap.set(pn, { clearProps: "marginTop" }); },
        });
      }
    }

    const wrap = expandRefs.current[index];
    const nextCard = cardRefs.current[index + 1];

    if (newIndex === null) {
      // ── Closing ───────────────────────────────────────────────────────────
      if (wrap) {
        gsap.to(wrap, { height: 0, duration: 0.35, ease: "power2.inOut", overwrite: "auto" });
      }
      if (nextCard) {
        const nc = nextCard;
        gsap.to(nc, {
          marginTop: closedMargin,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => { gsap.set(nc, { clearProps: "marginTop" }); },
        });
      }
    } else {
      // ── Opening ───────────────────────────────────────────────────────────
      if (wrap) {
        const targetHeight = wrap.scrollHeight;
        gsap.fromTo(
          wrap,
          { height: 0 },
          {
            height: targetHeight,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => { gsap.set(wrap, { height: "auto" }); },
          },
        );
      }
      if (nextCard) {
        gsap.to(nextCard, { marginTop: openMargin, duration: 0.45, ease: "power2.out", overwrite: "auto" });
      }
    }

    setActiveIndex(newIndex);
  };

  return (
    <section className={styles.container}>
      <div className={styles.maxContainer}>
        <div className={styles.headerRow}>
          <div className={styles.pageIntro}>
            <span className={styles.pageLabel}>{allWorksContent.title}</span>
            <p className={styles.pageSubtitle}>{allWorksContent.subtitle}</p>
          </div>

          <Link href="/" className={styles.backTab} aria-label="Back to home">
            {/* Desktop: original wide tab with text */}
            <span className={styles.tabDesktop}>
              <svg viewBox="0 0 344 46" fill="none" className={styles.tabSvg} aria-hidden="true">
                <path d="M0 7V45.5H344L311.601 2.77064C310.277 1.02527 308.213 0 306.023 0H7C3.13401 0 0 3.13401 0 7Z" fill="#111" />
              </svg>
              <span className={styles.backLabel}>{allWorksContent.backHomeLabel}</span>
            </span>
            {/* Mobile: compact icon tab */}
            <span className={styles.tabMobile}>
              <NavArrow direction="back" />
            </span>
          </Link>
        </div>

        <div className={styles.stack}>
          {allWorksContent.items.map((work, index) => {
            const theme = worksArchiveThemes[index % 5];
            const isActive = index === activeIndex;
            const tagsTicker = work.tags.join(", ");

            return (
              <article
                key={work.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`${styles.card} ${isActive ? styles.cardOpen : ""}`}
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
                    "--tab-offset": `${24 + (index % 5) * 116}px`,
                    zIndex: index + 1,
                  } as CSSProperties
                }
              >
                <div className={styles.cardShell}>
                  <div className={styles.tab}>
                    <svg viewBox="0 0 344 46" fill="none" className={styles.tabSvg}>
                      <path
                        className={styles.tabPath}
                        d="M0 7V45.5H344L311.601 2.77064C310.277 1.02527 308.213 0 306.023 0H7C3.13401 0 0 3.13401 0 7Z"
                      />
                    </svg>
                    <span className={styles.tabLabel}>{work.badge}</span>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    className={styles.preview}
                    onClick={() => handleCardClick(index)}
                    onKeyDown={(e) => e.key === "Enter" && handleCardClick(index)}
                    aria-expanded={isActive}
                    aria-controls={`work-archive-panel-${work.id}`}
                  >
                    <div className={styles.previewHeader}>
                      <h2 className={styles.mainTitle}>{work.title}</h2>
                      <div className={styles.metaInfo}>
                        <div className={styles.metaMain}>
                          <span>{work.year}</span>
                          <span>{work.client}</span>
                        </div>
                        <Link
                          href={`/works/${work.id}`}
                          className={styles.viewProjectMeta}
                          aria-label={`View ${work.title} project`}
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={(event) => scrambleLabel(event.currentTarget)}
                          onMouseLeave={(event) => resetLabel(event.currentTarget)}
                          onFocus={(event) => scrambleLabel(event.currentTarget)}
                          onBlur={(event) => resetLabel(event.currentTarget)}
                        >
                          {worksContent.viewProjectLabel}
                        </Link>
                        <span className={styles.tagsPreview}>{tagsTicker}</span>
                      </div>
                    </div>
                    <div className={styles.previewDivider} />
                  </div>

                  <div
                    ref={(el) => {
                      expandRefs.current[index] = el;
                    }}
                    id={`work-archive-panel-${work.id}`}
                    className={styles.expandWrap}
                    aria-hidden={!isActive}
                  >
                    <div
                      ref={(el) => {
                        innerRefs.current[index] = el;
                      }}
                      className={styles.expandInner}
                    >
                      <div className={styles.summaryRow}>
                        <p className={styles.summary}>{work.summary}</p>
                      </div>

                      <div className={styles.gallery}>
                        {work.gallery.slice(0, 3).map((image) =>
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
                              {image.label}
                            </div>
                          ),
                        )}
                      </div>

                      <div className={styles.detailsSection}>
                        {work.details.map((detail, detailIndex) => (
                          <p key={`${work.id}-${detailIndex}`} className={styles.detailsText}>
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
