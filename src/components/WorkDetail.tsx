import Link from "next/link";
import { NavArrow } from "./NavArrow";
import type { CSSProperties } from "react";
import { worksContent, type WorkItem } from "@/data/homeContent";
import styles from "./WorkDetail.module.scss";

type WorkDetailProps = {
  work: WorkItem;
};

export function WorkDetail({ work }: WorkDetailProps) {
  const theme = worksContent.themes[work.theme];
  const [leadImage, ...stackImages] = work.gallery;
  const tagsTicker = work.tags.join(", ");
  const getImageSrc = (image: (typeof work.gallery)[number]) => {
    const src = (image as { src?: string }).src;
    return typeof src === "string" && src.length > 0 ? src : null;
  };

  return (
    <section
      className={styles.container}
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
      <div className={styles.maxContainer}>
        <div className={styles.chromeRow}>
          <div className={styles.badgeTab}>
            <svg viewBox="0 0 344 46" fill="none" preserveAspectRatio="none" className={styles.tabSvg}>
              <path
                d="M0 7V45.5H344L311.601 2.77064C310.277 1.02527 308.213 0 306.023 0H7C3.13401 0 0 3.13401 0 7Z"
                fill="var(--work-bg)"
              />
            </svg>
            <span className={styles.badgeLabel}>{work.badge}</span>
          </div>

          <Link href="/works" className={styles.backTab} aria-label="Back to works">
            {/* Desktop: original wide tab with text */}
            <span className={styles.tabDesktop}>
              <svg viewBox="0 0 344 46" fill="none" className={styles.tabSvg} aria-hidden="true">
                <path d="M0 7V45.5H344L311.601 2.77064C310.277 1.02527 308.213 0 306.023 0H7C3.13401 0 0 3.13401 0 7Z" fill="#111" />
              </svg>
              <span className={styles.backLabel}>{worksContent.backToWorksLabel}</span>
            </span>
            {/* Mobile: compact icon tab */}
            <span className={styles.tabMobile}>
              <NavArrow direction="back" />
            </span>
          </Link>
        </div>

        <article className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>{work.title}</h1>
            <div className={styles.metaInfo}>
              <span>{work.year}</span>
              <span>{work.client}</span>
              <div className={styles.tags} aria-hidden="true">
                <div className={styles.tagTickerTrack}>
                  <span>{tagsTicker}</span>
                  <span>{tagsTicker}</span>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.divider} />

          <p className={styles.summary}>{work.summary}</p>

          {leadImage ? (
            <div className={styles.mediaBlock}>
              {getImageSrc(leadImage) ? (
                <div
                  className={styles.mediaImage}
                  style={{ backgroundImage: `url(${getImageSrc(leadImage)})` }}
                  role="img"
                  aria-label={leadImage.label}
                />
              ) : (
                <div className={styles.mediaPlaceholder}>{leadImage.label}</div>
              )}
            </div>
          ) : null}

          <section className={styles.detailsSection}>
            <h2 className={styles.detailsLabel}>{worksContent.detailsLabel}</h2>
            {work.details.map((paragraph, index) => (
              <p key={`${work.id}-detail-${index}`} className={styles.detailsText}>
                {paragraph}
              </p>
            ))}
            {work.url && (
              <Link
                href={work.url}
                className={styles.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW LIVE &rarr;
              </Link>
            )}
          </section>

          <section className={styles.galleryStack}>
            {stackImages.map((image) => (
              <div key={image.id} className={styles.mediaBlock}>
                {getImageSrc(image) ? (
                  <div
                    className={styles.mediaImage}
                    style={{ backgroundImage: `url(${getImageSrc(image)})` }}
                    role="img"
                    aria-label={image.label}
                  />
                ) : (
                  <div className={styles.mediaPlaceholder}>{image.label}</div>
                )}
              </div>
            ))}
          </section>
        </article>
      </div>
    </section>
  );
}
