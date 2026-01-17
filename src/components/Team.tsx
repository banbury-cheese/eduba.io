"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Team.module.scss";
import { DotsArrow } from "./DotsArrow";

type TeamMember = {
  id: string;
  code: string;
  name: string;
  role: string;
  email: string;
  description: string;
  linkedin: string;
};

const people: TeamMember[] = [
  {
    id: "jake",
    code: "EB-CEO/",
    name: "Jake Van Clief",
    role: "THE CEO",
    email: "theceo@eduba.io",
    description:
      "Former fintech operator focused on turning AI strategy into shipped systems with real operational lift.",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: "david",
    code: "EB001/",
    name: "David McDermott",
    role: "THE CTO",
    email: "thecto@eduba.io",
    description:
      "Built data platforms and audit tooling for regulated teams, with a bias toward practical, maintainable stacks.",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: "kay",
    code: "EB001/",
    name: "Kay K.",
    role: "FRONTEND & DESIGN LEAD",
    email: "thefrontendguy@eduba.io",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: "nick",
    code: "EB001/",
    name: "Nick",
    role: "THE CTO",
    email: "thecto@eduba.io",
    description:
      "Leads platform reliability and workflow automation with a product-first mindset and pragmatic delivery.",
    linkedin: "https://www.linkedin.com/",
  },
  {
    id: "claire",
    code: "EB001/",
    name: "Claire",
    role: "FRONTEND & DESIGN LEAD",
    email: "thefrontendguy@eduba.io",
    description:
      "Designs end-to-end experiences and front-end systems that scale with complex workflows.",
    linkedin: "https://www.linkedin.com/",
  },
];

export function Team() {
  const initialIndex = 2;
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
          <h2 className={styles.title}>our people</h2>
          <p className={styles.subtitle}>
            We&apos;re a rag-tag bunch and proud of it. Spanning backgrounds
            across the research, data, blockchain, army, business and strategy
            landscape we work hard, get on, and prioritise culture.
          </p>
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
                    <span className={styles.email}>{person.email}</span>
                  </span>
                </button>
                <a
                  className={styles.linkedin}
                  href={person.linkedin}
                  aria-label={`LinkedIn for ${person.name}`}
                >
                  in
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
