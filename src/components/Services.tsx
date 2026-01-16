"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import styles from "./Services.module.scss";
import { ArrowCorner } from "./ArrowCorner";

const services = [
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
      "We cut through vendor noise and hype cycles. Your leadership team gets a clear-eyed view of capabilities, limitations, and strategic implications—tailored to your industry and org structure.",
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
      "Two-day intensives where your team builds real systems. Not slides about AI—actual working prototypes using your data, your tools, your constraints. Engineers leave with patterns they can apply Monday morning.",
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
];

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
          `.${styles.cardContentFrame}`
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
          }
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
            <h2 className={styles.sectionLabel}>The Untapped Opportunity</h2>
          </div>
          <div className={styles.headerRight}>
            <p className={styles.sectionDescription}>
              Every YC startup is building what your employees could create in
              an afternoon. But those startups can&apos;t build what emerges
              when 100 employees each build their perfect tool and we
              orchestrate them together. That&apos;s a moat no vendor can cross.
            </p>

            <div className={styles.arrowHeaderRight}>
              <ArrowCorner  />
            </div>
          </div>
        </div>

        <div className={styles.servicesMeta}>
          <span>COMPUTATIONAL ORCHESTRATION SERVICES</span>
        </div>

        {/* Service Cards */}
        <div className={styles.cardsContainer}>
          {services.map((service, index) => (
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
                  className={styles.cardHeaderSvg}
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
                    <div className={styles.cardTop}>
                      <span className={styles.label}>TITLE</span>
                      <span className={styles.label}>DESCRIPTION</span>
                    </div>
                    <div className={styles.cardDivider} />
                    <div className={styles.cardBody}>
                      <div className={styles.cardLeft}>
                        <h4 className={styles.headline}>{service.headline}</h4>
                        <div className={styles.projectsSection}>
                          <span className={styles.label}>WHERE WE DID IT</span>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
