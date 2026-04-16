"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import styles from "./Team.module.scss";
import { DotsArrow } from "./DotsArrow";
import { teamContent } from "@/data/homeContent";

gsap.registerPlugin(ScrambleTextPlugin);

export function Team() {
  const people = teamContent.people;
  const initialIndex = teamContent.defaultActiveIndex;
  const [activeIndex, setActiveIndex] = useState<number | null>(
    people[initialIndex] ? initialIndex : null
  );
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasInitRef = useRef(false);

  useLayoutEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    if (activeIndex === null) return;
    const content = contentRefs.current[activeIndex];
    if (!content) return;
    const frame = content.querySelector(`.${styles.detailsInner}`);
    gsap.set(content, { height: "auto" });
    if (frame) {
      gsap.set(frame, { opacity: 1 });
    }
  }, [activeIndex]);

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

  const handleRowClick = (index: number) => {
    const previousIndex = activeIndex;
    const newIndex = activeIndex === index ? null : index;

    if (previousIndex !== null && previousIndex !== index) {
      const prevContent = contentRefs.current[previousIndex];
      if (prevContent) {
        const prevFrame = prevContent.querySelector(
          `.${styles.detailsInner}`
        );
        if (prevFrame) {
          gsap.to(prevFrame, {
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

    const content = contentRefs.current[index];
    if (content) {
      const frame = content.querySelector(`.${styles.detailsInner}`);
      if (newIndex === null) {
        if (frame) {
          gsap.to(frame, {
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
        const targetHeight = content.scrollHeight;
        if (frame) {
          gsap.set(frame, { opacity: 0 });
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
          },
        );
        if (frame) {
          gsap.to(frame, {
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
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title}>{teamContent.title}</h2>
          <p className={styles.subtitle}>{teamContent.subtitle}</p>
        </header>

        <div className={styles.list}>
          {people.map((person, index) => (
            <div
              key={person.id}
              className={styles.row}
              data-expanded={activeIndex === index}
            >
              <div className={styles.rowTop}>
                <button
                  type="button"
                  className={styles.rowButton}
                  onClick={() => handleRowClick(index)}
                  aria-expanded={activeIndex === index}
                  aria-controls={`${person.id}-details`}
                >
                  <span className={styles.code}>{person.code}</span>
                  <span className={styles.name}>{person.name}</span>
                  <span className={styles.roleBlock}>
                    <span className={styles.role}>{person.role}</span>
                    <a
                      className={styles.email}
                      href={`mailto:${person.email}`}
                      aria-label={`Email ${person.name}`}
                    >
                      {person.email}
                    </a>
                  </span>
                </button>
                <a
                  className={styles.linkedin}
                  href={person.linkedin}
                  aria-label={`LinkedIn for ${person.name}`}
                >
                  {teamContent.linkedinLabel}
                </a>
              </div>

              <div
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                className={styles.details}
                id={`${person.id}-details`}
                aria-hidden={activeIndex !== index}
              >
                <div className={styles.detailsInner}>
                  <p className={styles.description}>{person.description}</p>
                  {person.websiteHref && person.websiteLabel ? (
                    <a
                      className={styles.websiteLink}
                      href={person.websiteHref}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={(event) => scrambleLabel(event.currentTarget)}
                      onMouseLeave={(event) => resetLabel(event.currentTarget)}
                      onFocus={(event) => scrambleLabel(event.currentTarget)}
                      onBlur={(event) => resetLabel(event.currentTarget)}
                    >
                      {person.websiteLabel}
                    </a>
                  ) : null}
                  <div className={styles.dots}>
                    <DotsArrow size={26} color="#a2777a" />
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
