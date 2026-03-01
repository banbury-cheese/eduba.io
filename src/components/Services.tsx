"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { servicesContent } from "@/data/homeContent";
import styles from "./Services.module.scss";
import { ArrowCorner } from "./ArrowCorner";

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCardClick = (index: number) => {
    const previousIndex = activeIndex;
    const newIndex = activeIndex === index ? null : index;

    // Close previous card
    if (previousIndex !== null && previousIndex !== index) {
      const prevContent = contentRefs.current[previousIndex];
      if (prevContent) {
        const prevFrame = prevContent.querySelector(
          `.${styles.cardContentFrame}`,
        );
        if (prevFrame) {
          gsap.to(prevFrame, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }
        gsap.to(prevContent, {
          height: 0,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    }

    // Toggle clicked card
    const content = contentRefs.current[index];
    if (content) {
      const frame = content.querySelector(`.${styles.cardContentFrame}`);
      if (newIndex === null) {
        // Closing
        if (frame) {
          gsap.to(frame, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }
        gsap.to(content, {
          height: 0,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      } else {
        // Opening
        const targetHeight = content.scrollHeight;
        if (frame) {
          gsap.set(frame, { opacity: 0 });
        }
        gsap.fromTo(
          content,
          { height: 0 },
          {
            height: targetHeight,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => {
              gsap.set(content, { height: "auto" });
            },
          },
        );
        if (frame) {
          gsap.to(frame, {
            opacity: 1,
            duration: 0.4,
            delay: 0,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      }
    }

    setActiveIndex(newIndex);
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.arrowHeaderLeft}>
              <ArrowCorner mirror />
            </div>
            <h2 className={styles.sectionLabel}>{servicesContent.title}</h2>
          </div>
          <div className={styles.headerRight}>
            <p className={styles.sectionDescription}>
              {servicesContent.description}
            </p>

            <div className={styles.arrowHeaderRight}>
              <ArrowCorner />
            </div>
          </div>
        </div>

        <div className={styles.servicesMeta}>
          <span>{servicesContent.metaLabel}</span>
        </div>

        {/* Service Cards */}
        <div className={styles.cardsContainer}>
          {servicesContent.items.map((service, index) => (
            <div
              key={service.id}
              className={styles.card}
              data-expanded={activeIndex === index}
              style={
                {
                  "--card-bg": service.theme.background,
                  "--card-title": service.theme.title,
                  "--card-dot": service.theme.dots,
                  "--card-border": service.theme.border,
                } as CSSProperties
              }
            >
              {/* Card Tab/Header */}
              <button
                type="button"
                className={styles.cardHeader}
                onClick={() => handleCardClick(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`${service.id}-content`}
              >
                <svg
                  viewBox="0 0 1483 132"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.cardHeaderSvg} ${styles.cardHeaderSvgDesktop}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M547.739 0.5H10.5Q0.5 0.5 0.5 10.5V121Q0.5 131 10.5 131H1472.5Q1482.5 131 1482.5 121V73Q1482.5 63 1472.5 63H601.297Q596.297 63 593.297 59L552.739 5.5Q549.739 1.5 547.739 0.5Z"
                    fill="var(--card-bg)"
                    stroke="var(--card-bg)"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.5686 39.4314L8.5 39.5V9.5H38.5L38.4314 9.56862C22.4175 10.6115 9.6115 23.4175 8.5686 39.4314Z"
                    fill="var(--card-title)"
                  />
                  <path
                    d="M1461 74.5C1461.83 74.5 1462.5 75.1716 1462.5 76V76.75C1462.5 77.5784 1461.83 78.25 1461 78.25H1460.25C1459.42 78.25 1458.75 77.5784 1458.75 76.75V76C1458.75 75.1716 1459.42 74.5 1460.25 74.5L1461 74.5Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M1454.25 74.5C1455.08 74.5 1455.75 75.1716 1455.75 76V76.75C1455.75 77.5784 1455.08 78.25 1454.25 78.25H1453.5C1452.67 78.25 1452 77.5784 1452 76.75V76C1452 75.1716 1452.67 74.5 1453.5 74.5L1454.25 74.5Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M1447.5 74.5C1448.33 74.5 1449 75.1716 1449 76V76.75C1449 77.5784 1448.33 78.25 1447.5 78.25H1446.75C1445.92 78.25 1445.25 77.5784 1445.25 76.75V76C1445.25 75.1716 1445.92 74.5 1446.75 74.5L1447.5 74.5Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M1440.75 74.5C1441.58 74.5 1442.25 75.1716 1442.25 76V76.75C1442.25 77.5784 1441.58 78.25 1440.75 78.25H1440C1439.17 78.25 1438.5 77.5784 1438.5 76.75L1438.5 76C1438.5 75.1716 1439.17 74.5 1440 74.5L1440.75 74.5Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M1461 81.25C1461.83 81.25 1462.5 81.9216 1462.5 82.75V83.5C1462.5 84.3284 1461.83 85 1461 85H1460.25C1459.42 85 1458.75 84.3284 1458.75 83.5V82.75C1458.75 81.9216 1459.42 81.25 1460.25 81.25H1461Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M1454.25 81.25C1455.08 81.25 1455.75 81.9216 1455.75 82.75V83.5C1455.75 84.3284 1455.08 85 1454.25 85H1453.5C1452.67 85 1452 84.3284 1452 83.5V82.75C1452 81.9216 1452.67 81.25 1453.5 81.25H1454.25Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M1461 88C1461.83 88 1462.5 88.6716 1462.5 89.5V90.25C1462.5 91.0784 1461.83 91.75 1461 91.75H1460.25C1459.42 91.75 1458.75 91.0784 1458.75 90.25V89.5C1458.75 88.6716 1459.42 88 1460.25 88H1461Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M1461 94.75C1461.83 94.75 1462.5 95.4216 1462.5 96.25V97C1462.5 97.8284 1461.83 98.5 1461 98.5H1460.25C1459.42 98.5 1458.75 97.8284 1458.75 97V96.25C1458.75 95.4216 1459.42 94.75 1460.25 94.75H1461Z"
                    fill="var(--card-dot)"
                  />
                </svg>
                <svg
                  width="276"
                  height="98"
                  viewBox="0 0 276 98"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.cardHeaderSvg} ${styles.cardHeaderSvgMobile}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M181.528 0H3.0057C1.34662 0 0.00255733 1.34662 0.00570803 3.00569L0.180423 95.0057C0.183565 96.6603 1.52577 98 3.1804 98H272.992C274.652 98 275.996 96.652 275.992 94.9921L275.822 30.1239C275.817 28.4701 274.476 27.1318 272.822 27.1318H205.472C204.543 27.1318 203.667 26.7021 203.099 25.968L183.901 1.16377C183.333 0.429705 182.457 0 181.528 0Z"
                    fill="var(--card-bg)"
                  />
                  <path
                    d="M267.375 33C267.72 33 268 33.2798 268 33.625V33.9375C268 34.2827 267.72 34.5625 267.375 34.5625H267.062C266.717 34.5625 266.438 34.2827 266.438 33.9375V33.625C266.438 33.2798 266.717 33 267.062 33L267.375 33Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M264.562 33C264.908 33 265.187 33.2798 265.187 33.625V33.9375C265.187 34.2827 264.908 34.5625 264.562 34.5625H264.25C263.905 34.5625 263.625 34.2827 263.625 33.9375V33.625C263.625 33.2798 263.905 33 264.25 33L264.562 33Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M261.75 33C262.095 33 262.375 33.2798 262.375 33.625V33.9375C262.375 34.2827 262.095 34.5625 261.75 34.5625H261.437C261.092 34.5625 260.812 34.2827 260.812 33.9375V33.625C260.812 33.2798 261.092 33 261.437 33L261.75 33Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M258.937 33C259.283 33 259.562 33.2798 259.562 33.625V33.9375C259.562 34.2827 259.283 34.5625 258.937 34.5625H258.625C258.28 34.5625 258 34.2827 258 33.9375L258 33.625C258 33.2798 258.28 33 258.625 33L258.937 33Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M267.375 35.8125C267.72 35.8125 268 36.0923 268 36.4375V36.75C268 37.0952 267.72 37.375 267.375 37.375H267.062C266.717 37.375 266.438 37.0952 266.438 36.75V36.4375C266.438 36.0923 266.717 35.8125 267.062 35.8125H267.375Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M264.562 35.8125C264.908 35.8125 265.187 36.0923 265.187 36.4375V36.75C265.187 37.0952 264.908 37.375 264.562 37.375H264.25C263.905 37.375 263.625 37.0952 263.625 36.75V36.4375C263.625 36.0923 263.905 35.8125 264.25 35.8125H264.562Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M267.375 38.625C267.72 38.625 268 38.9048 268 39.25V39.5625C268 39.9077 267.72 40.1875 267.375 40.1875H267.062C266.717 40.1875 266.438 39.9077 266.438 39.5625V39.25C266.438 38.9048 266.717 38.625 267.062 38.625H267.375Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    d="M267.375 41.4375C267.72 41.4375 268 41.7173 268 42.0625V42.375C268 42.7202 267.72 43 267.375 43H267.062C266.717 43 266.438 42.7202 266.438 42.375V42.0625C266.438 41.7173 266.717 41.4375 267.062 41.4375H267.375Z"
                    fill="var(--card-dot)"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.02973 17.9703L5 18V5H18L17.9703 5.02974C11.0309 5.48167 5.48165 11.0309 5.02973 17.9703Z"
                    fill="var(--card-title)"
                  />
                </svg>
                <div className={styles.cardHeaderContent}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                </div>
                <div
                  className={styles.cardCover}
                  style={{ backgroundColor: "var(--card-bg)" }}
                ></div>
              </button>

              {/* Expanded Content */}
              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className={styles.cardContent}
                aria-hidden={activeIndex !== index}
                id={`${service.id}-content`}
              >
                <div className={styles.cardContentFrame}>
                  <div className={styles.cardInner}>
                    <div className={styles.desktopContent}>
                      <div className={styles.cardTop}>
                        <span className={styles.label}>{servicesContent.labels.title}</span>
                        <span className={styles.label}>
                          {servicesContent.labels.description}
                        </span>
                      </div>
                      <div className={styles.cardDivider} />
                      <div className={styles.cardBody}>
                        <div className={styles.cardLeft}>
                          <h4 className={styles.headline}>{service.headline}</h4>
                          <div className={styles.projectsSection}>
                            <span className={styles.label}>
                              {servicesContent.labels.whereWeDidIt}
                            </span>
                            <ul className={styles.projectsList}>
                              {service.projects.map((project, i) => (
                                <li key={i} className={styles.projectItem}>
                                  {project}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className={styles.cardRight}>
                          <p className={styles.description}>
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.mobileContent}>
                      <div className={styles.contentSection}>
                        <span className={styles.label}>{servicesContent.labels.title}</span>
                        <div className={styles.cardDivider} />
                        <h4 className={styles.headline}>{service.headline}</h4>
                      </div>
                      <div className={styles.contentSection}>
                        {/* <span className={styles.label}>DESCRIPTION</span>
                        <div className={styles.cardDivider} /> */}
                        <p className={styles.description}>
                          {service.description}
                        </p>
                      </div>
                      <div className={styles.projectsSection}>
                        <span className={styles.label}>
                          {servicesContent.labels.whereWeDidIt}
                        </span>
                        {/* <div className={styles.cardDivider} /> */}
                        <ul className={styles.projectsList}>
                          {service.projects.map((project, i) => (
                            <li key={i} className={styles.projectItem}>
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
