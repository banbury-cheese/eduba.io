"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { reviewsContent } from "@/data/homeContent";
import styles from "./Reviews.module.scss";

function CornerDots({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.cornerDotsSvg}
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M1.0625 2.32216e-08C0.475717 4.88716e-08 0 0.475698 0 1.0625V1.59375C0 2.18055 0.475717 2.65625 1.0625 2.65625H1.59375C2.18053 2.65625 2.65625 2.18055 2.65625 1.59375V1.0625C2.65625 0.475698 2.18053 -2.56497e-08 1.59375 0L1.0625 2.32216e-08Z"
        fill="#D8BFC0"
      />
      <path
        d="M5.84375 2.32213e-08C5.25697 4.88715e-08 4.78125 0.475698 4.78125 1.0625V1.59375C4.78125 2.18055 5.25697 2.65625 5.84375 2.65625H6.375C6.96178 2.65625 7.4375 2.18055 7.4375 1.59375V1.0625C7.4375 0.475697 6.96178 -2.56502e-08 6.375 0L5.84375 2.32213e-08Z"
        fill="#D8BFC0"
      />
      <path
        d="M10.625 2.32213e-08C10.0382 4.88715e-08 9.5625 0.475697 9.5625 1.0625V1.59375C9.5625 2.18056 10.0382 2.65625 10.625 2.65625H11.1562C11.7431 2.65625 12.2188 2.18056 12.2188 1.59375V1.0625C12.2188 0.475697 11.7431 -2.56502e-08 11.1562 0L10.625 2.32213e-08Z"
        fill="#D8BFC0"
      />
      <path
        d="M15.4062 2.32213e-08C14.8194 4.88714e-08 14.3438 0.475698 14.3438 1.0625V1.59375C14.3438 2.18056 14.8194 2.65625 15.4062 2.65625H15.9375C16.5243 2.65625 17 2.18056 17 1.59375L17 1.0625C17 0.475698 16.5243 -2.56516e-08 15.9375 0L15.4062 2.32213e-08Z"
        fill="#D8BFC0"
      />
      <path
        d="M1.0625 4.78125C0.475717 4.78125 0 5.25695 0 5.84375V6.375C0 6.9618 0.475717 7.4375 1.0625 7.4375H1.59375C2.18053 7.4375 2.65625 6.9618 2.65625 6.375V5.84375C2.65625 5.25695 2.18053 4.78125 1.59375 4.78125H1.0625Z"
        fill="#D8BFC0"
      />
      <path
        d="M5.84375 4.78125C5.25697 4.78125 4.78125 5.25695 4.78125 5.84375V6.375C4.78125 6.9618 5.25697 7.4375 5.84375 7.4375H6.375C6.96178 7.4375 7.4375 6.9618 7.4375 6.375V5.84375C7.4375 5.25695 6.96178 4.78125 6.375 4.78125H5.84375Z"
        fill="#D8BFC0"
      />
      <path
        d="M1.0625 9.5625C0.475717 9.5625 0 10.0382 0 10.625V11.1562C0 11.743 0.475717 12.2188 1.0625 12.2188H1.59375C2.18053 12.2188 2.65625 11.743 2.65625 11.1562V10.625C2.65625 10.0382 2.18053 9.5625 1.59375 9.5625H1.0625Z"
        fill="#D8BFC0"
      />
      <path
        d="M1.0625 14.3438C0.475717 14.3438 0 14.8195 0 15.4062V15.9375C0 16.5243 0.475717 17 1.0625 17H1.59375C2.18053 17 2.65625 16.5243 2.65625 15.9375V15.4062C2.65625 14.8195 2.18053 14.3438 1.59375 14.3438H1.0625Z"
        fill="#D8BFC0"
      />
    </svg>
  );
}

function FanIcon() {
  return (
    <svg
      width="45"
      height="45"
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.fanIcon}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_670_59)">
        <path
          d="M22.6 29.0002C27.8 34.1002 35.9999 34.0002 41.0999 29.0002C46.1999 23.9002 46.1999 15.5002 41.0999 10.4002L28.9 22.6002L22.4 29.0002L15.9 22.6002L22.4 16.2002L28.9 22.6002C33.9999 17.5002 33.9999 9.10023 28.9 4.00023C23.8 -1.09977 15.5 -1.29977 10.3 3.90023L22.4 16.0002C17.2 11.0002 8.99995 11.0002 3.89995 16.1002C-1.20005 21.2002 -1.20005 29.6002 3.89995 34.7002L15.9 22.7002C10.9 27.9002 10.9 36.1002 16 41.2002C21.1 46.3002 29.4999 46.3002 34.5999 41.2002L22.5 29.1002L22.6 29.0002Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_670_59">
          <rect width="45" height="45" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Reviews() {
  const totalReviewItems = reviewsContent.items.length;
  const visibleCardCount = Math.min(5, totalReviewItems);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const fanIconRef = useRef<HTMLSpanElement>(null);
  const currentIndexRef = useRef(0);
  const nextReviewIndexRef = useRef(visibleCardCount % totalReviewItems);
  const isAnimatingRef = useRef(false);
  const advanceReviewRef = useRef<(() => void) | null>(null);
  const scheduleAutoRotateRef = useRef<(() => void) | null>(null);
  const autoRotateTimerRef = useRef<number | null>(null);
  const [slotReviewIndices, setSlotReviewIndices] = useState<number[]>(() =>
    Array.from({ length: visibleCardCount }, (_, index) => index),
  );

  const clearAutoRotateTimer = () => {
    if (autoRotateTimerRef.current) {
      window.clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter((c) => c !== null);
      if (cards.length === 0) return;

      const totalCards = cards.length;

      const setCardState = (card: HTMLElement, index: number) => {
        const isMobile = window.innerWidth <= 800;
        const xOffset = (isMobile ? -12 : -35) * index;
        const yOffset = (isMobile ? 10 : 30) * index;
        const scaleStep = isMobile ? 0.04 : 0.05;
        const scale = 1 - scaleStep * index;
        const opacity = 1;
        const zIndex = totalCards - index;

        return {
          x: xOffset,
          y: yOffset,
          scale: scale,
          zIndex: zIndex,
          opacity: opacity,
          filter: index === 0 ? "brightness(1)" : "brightness(0.8)",
        };
      };

      cards.forEach((card, i) => {
        gsap.set(card, setCardState(card, i));
      });

      advanceReviewRef.current = () => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        const outgoingSlotIndex = currentIndexRef.current % totalCards;

        const tl = gsap.timeline({
          onComplete: () => {
            if (totalReviewItems > totalCards) {
              const nextReviewIndex = nextReviewIndexRef.current;
              setSlotReviewIndices((previousSlots) => {
                const nextSlots = [...previousSlots];
                nextSlots[outgoingSlotIndex] = nextReviewIndex;
                return nextSlots;
              });
              nextReviewIndexRef.current =
                (nextReviewIndex + 1) % totalReviewItems;
            }

            currentIndexRef.current =
              (currentIndexRef.current + 1) % totalCards;
            isAnimatingRef.current = false;
          },
        });

        const frontCard = cards[currentIndexRef.current % totalCards];
        const backState = setCardState(frontCard, totalCards - 1);

        tl.to(
          frontCard,
          {
            x: backState.x,
            y: backState.y,
            scale: backState.scale,
            opacity: backState.opacity,
            filter: backState.filter,
            duration: 0.8,
            ease: "power2.inOut",
            zIndex: 0,
          },
          0,
        );

        for (let i = 1; i < totalCards; i++) {
          const cardIndex = (currentIndexRef.current + i) % totalCards;
          const card = cards[cardIndex];
          const targetState = setCardState(card, i - 1);

          tl.to(
            card,
            {
              ...targetState,
              duration: 0.8,
              ease: "power2.inOut",
            },
            0,
          );
        }

        tl.set(frontCard, {
          zIndex: 1, // Now it is physically at the back
        });
      };

      const scheduleAutoRotate = () => {
        clearAutoRotateTimer();
        autoRotateTimerRef.current = window.setTimeout(() => {
          if (isAnimatingRef.current) {
            scheduleAutoRotate();
            return;
          }

          advanceReviewRef.current?.();
          scheduleAutoRotate();
        }, 4000);
      };

      scheduleAutoRotateRef.current = scheduleAutoRotate;
      scheduleAutoRotate();
    }, containerRef);

    return () => {
      clearAutoRotateTimer();
      advanceReviewRef.current = null;
      scheduleAutoRotateRef.current = null;
      ctx.revert();
    };
  }, []);

  const handleAdvanceReview = () => {
    if (isAnimatingRef.current) return;

    if (fanIconRef.current) {
      gsap.to(fanIconRef.current, {
        rotate: "+=90",
        duration: 0.32,
        ease: "power2.out",
      });
    }

    advanceReviewRef.current?.();
    scheduleAutoRotateRef.current?.();
  };

  return (
    <section className={styles.section} ref={containerRef}>
      <div className={styles.maxContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{reviewsContent.title}</h2>
        </div>

        <div className={styles.stackRegion}>
          <div className={styles.sideLabel}>
            {reviewsContent.sideLabel.line1}
            <br />
            {reviewsContent.sideLabel.line2}
          </div>

          <button
            type="button"
            className={styles.fanButton}
            onClick={handleAdvanceReview}
            aria-label="Show next review"
          >
            <span className={styles.fanButtonInner} ref={fanIconRef}>
              <FanIcon />
            </span>
          </button>

          <div className={styles.stackContainer}>
            {slotReviewIndices.map((reviewIndex, slotIndex) => {
              const review = reviewsContent.items[reviewIndex];

              return (
              <div
                key={slotIndex}
                className={styles.card}
                ref={(el) => {
                  cardsRef.current[slotIndex] = el;
                }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.headerDotsLeft}>
                    <CornerDots />
                  </div>
                  <span className={styles.headerTitle}>{review.headerCode}</span>
                  <div className={styles.headerDotsRight}>
                    <CornerDots mirrored />
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.quote}>{review.quote}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.clientInfo}>
                      <span>{review.client},</span>
                      <span className={styles.company}>{review.company}</span>
                    </div>
                    <a
                      href={review.sourceHref}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.source}
                    >
                      {review.source}
                    </a>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
