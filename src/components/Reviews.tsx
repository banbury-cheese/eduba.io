"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Reviews.module.scss";

type Review = {
  id: number;
  client: string;
  company: string;
  quote: string;
  source: string;
  headerCode: string;
};

const reviews: Review[] = [
  {
    id: 1,
    client: "Jhon Doe",
    company: "KPMG",
    quote:
      "eduba turned our ai strategy into a working pipeline in four weeks. they told us what not to build, paired with our team, and left us with skills—not dependency. we cut analysis time by 38% in month one.",
    source: "LINKEDIN",
    headerCode: "(POC_CLIENT)",
  },
  {
    id: 2,
    client: "Sarah Smith",
    company: "Deloitte",
    quote:
      "The team at eduba didn't just deliver a product; they delivered a culture shift. Their approach to AI is pragmatic, effective, and deeply human-centric.",
    source: "DIRECT",
    headerCode: "(STRATEGY_LEAD)",
  },
  {
    id: 3,
    client: "Michael Chen",
    company: "Google",
    quote:
      "A paradigm shift in how we approach interface design. The 'window stack' metaphor they engineered for our dashboard is now a standard across our internal tools.",
    source: "CLUTCH",
    headerCode: "(UX_DIRECTOR)",
  },
  {
    id: 4,
    client: "Elena Rodriguez",
    company: "Spotify",
    quote:
      "Efficient, elegant, and educational. They left our engineers better than they found them.",
    source: "E-MAIL",
    headerCode: "(ENG_MANAGER)",
  },
];

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

export function Reviews() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [counterValue, setCounterValue] = useState(5);

  // Ref to store the current order of indices
  // We will animate the visual properties of the DOM elements directly
  // But logically we treat them as a cycling list.

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter((c) => c !== null);
      if (cards.length === 0) return;

      const totalCards = cards.length;

      // Initial positions
      // We want a stack effect:
      // Front card: zIndex high, scale 1, y 0
      // Back cards: zIndex lower, scale smaller, y offset downwards and to the right/left?
      // Image shows:
      // Stack goes Top-Left to Bottom-Right visually?
      // Actually image shows:
      // Backmost card is smallest, top-leftest.
      // Frontmost card is largest, bottom-rightest (closest to viewer).
      // Wait, let's look at the image again.
      // Front card is fully visible. Behind it, shifted up and left, is the next card.
      // So the stack recedes into the background (Up and Left).

      const setCardState = (card: HTMLElement, index: number) => {
        // index 0 = front
        // index 1 = behind 0
        // index 2 = behind 1

        // Per image:
        // Front card is dominant.
        // Behind cards are shifted UP and LEFT, and scaled down slightly?
        // Or just shifted UP and LEFT.

        const xOffset = -35 * index;
        const yOffset = 30 * index;
        const scale = 1 - index * 0.05;
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

      // Set initial positions
      cards.forEach((card, i) => {
        gsap.set(card, setCardState(card, i));
      });

      // Animation Loop
      // We cycle the "visual" state.
      // The DOM order stays the same.
      // We just animate the properties of each element to match the "next" logical position.
      // Actually, for a continuous cycle, it's often easier to physically permute the array of properties
      // or modify the target values.

      let currentIndex = 0;

      const animateNext = () => {
        // The card at currentIndex is at position 0 (Front).
        // It needs to go to position N-1 (Back).
        // All other cards need to move forward (position i becomes i-1).

        const tl = gsap.timeline({
          onComplete: () => {
            currentIndex++;
            setCounterValue((prev) => (prev >= 10 ? 1 : prev + 1));
            // After animation, we wait a bit then trigger next
            gsap.delayedCall(3, animateNext);
          },
        });

        // Animate Front Card (Current) directly to the back
        // It floats OVER the others to reach the back position
        const frontCard = cards[currentIndex % totalCards];
        const backIndex = totalCards - 1;
        const backState = setCardState(frontCard, backIndex); // Target visual state for the back

        // 1. Move Front card to Back position visuals, but keep Z high so it passes over
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
            zIndex: 0, // Keep it on top while moving
          },
          0,
        );

        // 2. Animate others forward (Index i -> Index i-1)
        for (let i = 1; i < totalCards; i++) {
          const cardIndex = (currentIndex + i) % totalCards;
          const card = cards[cardIndex];

          // New position is (i - 1)
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

        // 3. After animation, effectively "drop" the old front card to the bottom of the stack
        tl.set(frontCard, {
          zIndex: 1, // Now it is physically at the back
        });
      };

      // Start loop
      gsap.delayedCall(2, animateNext);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const counterDisplay = String(counterValue).padStart(2, "0");

  return (
    <section className={styles.section} ref={containerRef}>
      <div className={styles.maxContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            We start with truth, not hype. We teach your people to build. Then
            we orchestrate what works into an advantage.
          </h2>
        </div>

        <div className={styles.stackRegion}>
          <div className={styles.sideLabel}>
            A FEW WORDS FROM
            <br />
            OUR CLIENTS
          </div>

          <div className={styles.stackContainer}>
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className={styles.card}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
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
                    <span className={styles.source}>{review.source}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className={styles.counter}>
              <span>{counterDisplay}</span>
              <span>/10</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
