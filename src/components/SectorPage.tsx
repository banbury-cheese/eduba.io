"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import type { Sector } from "@/lib/sectorTypes";
import { gsap } from "gsap";
import styles from "./SectorPage.module.scss";

interface SectorPageProps {
  sector: Sector;
}

function SectionFrame({
  number,
  label,
  children,
  info,
}: {
  number: string;
  label: string;
  children: ReactNode;
  info: ReactNode;
}) {
  return (
    <section className={`${styles.section} ${styles.fullBleedBottom}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionMeta}>
          <span>{number}</span>
          <span className={styles.sectionSlash}>/</span>
          <span>{label}</span>
        </div>
        <div className={styles.sectionInfo}>{info}</div>
      </div>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}

export function SectorPage({ sector }: SectorPageProps) {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faqInitRef = useRef(false);

  useLayoutEffect(() => {
    if (faqInitRef.current) return;
    faqInitRef.current = true;
    if (activeFaqIndex === null) return;
    const content = faqRefs.current[activeFaqIndex];
    if (!content) return;
    const inner = content.querySelector(`.${styles.faqDetailsInner}`);
    gsap.set(content, { height: "auto" });
    if (inner) {
      gsap.set(inner, { opacity: 1 });
    }
  }, [activeFaqIndex]);

  const handleFaqClick = (index: number) => {
    const previousIndex = activeFaqIndex;
    const newIndex = activeFaqIndex === index ? null : index;

    if (previousIndex !== null && previousIndex !== index) {
      const prevContent = faqRefs.current[previousIndex];
      if (prevContent) {
        const prevInner = prevContent.querySelector(
          `.${styles.faqDetailsInner}`
        );
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

    const content = faqRefs.current[index];
    if (content) {
      const inner = content.querySelector(`.${styles.faqDetailsInner}`);
      if (newIndex === null) {
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

    setActiveFaqIndex(newIndex);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <div className={`${styles.pageHeader} ${styles.fullBleedBottom}`}>
          <span className={styles.pageIndex}>{sector.pageIndex}</span>
          <span className={styles.pageTag}>{sector.pageTag}</span>
        </div>

        <section className={`${styles.hero} ${styles.fullBleedBottom}`}>
          <h1 className={styles.heroTitle}>{sector.hero.title}</h1>
          <p className={styles.heroSubtitle}>{sector.hero.subtitle}</p>
        </section>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href={sector.hero.ctaHref}>
            {sector.hero.ctaLabel}
            <span className={styles.primaryButtonArrow}>→</span>
          </a>
          <div className={styles.explore}>
            <span className={styles.exploreSlash}>/</span>
            <span>{sector.hero.exploreLabel}</span>
          </div>
        </div>

        <SectionFrame
          number="001"
          label={sector.consulting.label}
          info={
            <>
              <h2 className={styles.sectionTitle}>{sector.consulting.title}</h2>
              {sector.consulting.description.map((paragraph, index) => (
                <p
                  key={`${sector.slug}-consulting-${index}`}
                  className={styles.sectionText}
                >
                  {paragraph}
                </p>
              ))}
            </>
          }
        >
          <div className={styles.cardGrid}>
            {sector.consulting.cards.map((card) => (
              <article key={card.id} className={styles.card}>
                <span className={styles.cardId}>{card.id}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardBody}>{card.body}</p>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          number="002"
          label={sector.whyUs.label}
          info={<h2 className={styles.sectionTitle}>{sector.whyUs.title}</h2>}
        >
          <div className={`${styles.list}`}>
            {sector.whyUs.items.map((item) => (
              <div
                key={item.id}
                className={`${styles.listRow} ${styles.listBorder}`}
              >
                <span className={styles.listIndex}>{item.id}</span>
                <span className={styles.listTitle}>{item.title}</span>
                <p className={styles.listDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          number="003"
          label={sector.services.label}
          info={
            <>
              <h2 className={styles.sectionTitle}>{sector.services.title}</h2>
              <p className={styles.sectionText}>{sector.services.intro}</p>
            </>
          }
        >
          <div className={styles.servicesGrid}>
            {sector.services.cards.map((card) => (
              <article key={card.id} className={styles.serviceCard}>
                <span className={styles.cardId}>{card.id}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                {card.price ? (
                  <span className={styles.servicePrice}>{card.price}</span>
                ) : null}
                <p className={styles.cardBody}>{card.body}</p>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          number="004"
          label={sector.methodology.label}
          info={
            <h2 className={styles.sectionTitle}>{sector.methodology.title}</h2>
          }
        >
          <div className={`${styles.list} `}>
            {sector.methodology.steps.map((step) => (
              <div
                key={step.id}
                className={`${styles.listRow} ${styles.listBorder}`}
              >
                <span className={styles.listIndex}>{step.id}</span>
                <span className={styles.listTitle}>{step.title}</span>
                <p className={styles.listDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          number="005"
          label={sector.engagement.label}
          info={
            <>
              <h2 className={styles.sectionTitle}>{sector.engagement.title}</h2>
              <p className={styles.sectionText}>{sector.engagement.intro}</p>
            </>
          }
        >
          <div className={styles.choiceGrid}>
            {sector.engagement.cards.map((card) => (
              <article key={card.id} className={styles.card}>
                <span className={styles.cardId}>{card.id}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardBody}>{card.body}</p>
              </article>
            ))}
          </div>
        </SectionFrame>

        <SectionFrame
          number="006"
          label={sector.faq.label}
          info={<h2 className={styles.sectionTitle}>{sector.faq.title}</h2>}
        >
          <div className={styles.faqList}>
            {sector.faq.items.map((item, index) => (
              <div
                key={`${item.question}-${index}`}
                className={`${styles.faqItem} ${styles.listBorder}`}
                data-expanded={activeFaqIndex === index}
              >
                <button
                  type="button"
                  className={styles.faqSummary}
                  onClick={() => handleFaqClick(index)}
                  aria-expanded={activeFaqIndex === index}
                >
                  <span>{item.question}</span>
                  <span className={styles.faqIcon} aria-hidden="true" />
                </button>
                <div
                  ref={(el) => {
                    faqRefs.current[index] = el;
                  }}
                  className={styles.faqDetails}
                  aria-hidden={activeFaqIndex !== index}
                >
                  <div className={styles.faqDetailsInner}>
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionFrame>

        <div className={styles.ctaBand}>
          <span className={styles.ctaLabel}>{sector.cta.label}</span>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{sector.cta.title}</h2>
            <a className={styles.ctaButton} href={sector.cta.buttonHref}>
              {sector.cta.buttonLabel}
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
