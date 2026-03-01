"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./ParadigmShift.module.scss";
import Link from "next/link";
import { ArrowCorner } from "./ArrowCorner";
import { DotsArrow } from "./DotsArrow";
import { paradigmShiftContent } from "@/data/homeContent";

export function ParadigmShift() {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    paradigmShiftContent.defaultActiveIndex,
  );
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize the default open state on mount
  useEffect(() => {
    if (activeIndex !== null) {
      const content = contentRefs.current[activeIndex];
      if (content) {
        const inner = content.querySelector(`.${styles.rowInner}`);
        gsap.set(content, { height: "auto" });
        if (inner) {
          gsap.set(inner, { opacity: 1 });
        }
      }
    }
  }, []);

  const handleRowClick = (index: number) => {
    const previousIndex = activeIndex;
    const newIndex = activeIndex === index ? null : index;

    // Close previous
    if (previousIndex !== null && previousIndex !== index) {
      const prevContent = contentRefs.current[previousIndex];
      if (prevContent) {
        const prevInner = prevContent.querySelector(`.${styles.rowInner}`);
        if (prevInner) {
          gsap.to(prevInner, {
            opacity: 0,
            duration: 0.2,
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

    // Toggle clicked
    const content = contentRefs.current[index];
    if (content) {
      const inner = content.querySelector(`.${styles.rowInner}`);
      if (newIndex === null) {
        // Closing current
        if (inner) {
          gsap.to(inner, {
            opacity: 0,
            duration: 0.2,
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
        if (inner) {
          gsap.set(inner, { opacity: 0 });
        }

        gsap.fromTo(
          content,
          { height: 0 },
          {
            height: targetHeight,
            duration: 0.35,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => {
              gsap.set(content, { height: "auto" });
            },
          }
        );

        if (inner) {
          gsap.to(inner, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        }
      }
    }

    setActiveIndex(newIndex);
  };

  return (
    <section className={styles.container}>
      <div className={styles.cornerTopLeft}>
        {/* <ArrowCorner size={24} /> */}
      </div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              {paradigmShiftContent.title.line1}
              <br />
              {paradigmShiftContent.title.line2}
            </h2>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.dotsArrow}>
              <DotsArrow size={24} />
            </div>
            <p className={styles.description}>{paradigmShiftContent.description}</p>
          </div>
        </div>

        {/* Industry Rows */}
        <div className={styles.industries}>
          {paradigmShiftContent.items.map((industry, index) => (
            <div
              key={`${industry.id}-${index}`}
              className={`${styles.row} ${activeIndex === index ? styles.rowActive : ""}`}
            >
              <button
                type="button"
                className={styles.rowHeader}
                onClick={() => handleRowClick(index)}
                aria-expanded={activeIndex === index}
              >
                <span className={styles.rowId}>{industry.id}/</span>
                <h3 className={styles.rowTitle}>{industry.title}</h3>
              </button>

              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className={styles.rowContent}
              >
                <div className={styles.rowInner}>
                  <p className={styles.rowDescription}>
                    {industry.description}
                    <span className={styles.arrowInline}>
                      {/* <svg
                        width="16"
                        height="10"
                        viewBox="0 0 16 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5H15M15 5L11 1M15 5L11 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg> */}
                    </span>
                  </p>
                  <Link
                    className={styles.ctaButton}
                    href={`/sectors/${industry.slug}`}
                  >
                    {industry.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cornerBottomRight}>
        {/* <ArrowCorner size={24} mirror /> */}
      </div>
    </section>
  );
}
