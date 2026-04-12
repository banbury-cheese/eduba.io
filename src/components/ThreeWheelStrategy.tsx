"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { threeWheelStrategyContent } from "@/data/homeContent";
import styles from "./ThreeWheelStrategy.module.scss";

gsap.registerPlugin(ScrollTrigger);

export function ThreeWheelStrategy() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!track || !viewport) return;

    const scroller = track.closest("main") || window;
    const mm = gsap.matchMedia();

    const getOrbitRing = (group: SVGGElement) =>
      group.querySelector(`.${styles.orbitRing}`) as SVGGeometryElement | null;

    const getOrbitTravel = (orbit: SVGGeometryElement | null, factor = 0.2) =>
      orbit ? -orbit.getTotalLength() * factor : 0;

    mm.add("(min-width: 801px)", () => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(
          viewport.querySelectorAll(`.${styles.card}`),
        );
        const bodies = gsap.utils.toArray<HTMLElement>(
          viewport.querySelectorAll(`.${styles.sectionBody}`),
        );
        const wheelGroups = gsap.utils.toArray<SVGGElement>(
          viewport.querySelectorAll(`.${styles.wheelGroup}`),
        );

        const connector1 = viewport.querySelector(`.${styles.connector1}`);
        const connector2 = viewport.querySelector(`.${styles.connector2}`);
        const connector3 = viewport.querySelector(`.${styles.connector3}`);
        const orbit1 = getOrbitRing(wheelGroups[0]);
        const orbit2 = getOrbitRing(wheelGroups[1]);
        const orbit3 = getOrbitRing(wheelGroups[2]);

        const vh = window.innerHeight;
        const stack3Pos = vh - 150;
        const stack2Pos = vh - 280;
        const top2Pos = 80;
        const top3Pos = 160;

        gsap.set(cards[0], { y: 0, zIndex: 1 });
        gsap.set(cards[1], { y: stack2Pos, zIndex: 2 });
        gsap.set(cards[2], { y: stack3Pos, zIndex: 3 });

        gsap.set(bodies[0], { opacity: 1, height: "auto" });
        gsap.set(bodies[1], { opacity: 0, height: 0 });
        gsap.set(bodies[2], { opacity: 0, height: 0 });

        const inactiveFill = "rgba(162, 119, 122, 0.1)";
        const activeFill = "rgba(162, 119, 122, 0.4)";

        wheelGroups.forEach((g, i) => {
          gsap.set(g, { transformOrigin: "center", scale: 1, opacity: 1 });
          const path = g.querySelector("path");
          if (path) {
            gsap.set(path, { fill: i === 0 ? activeFill : inactiveFill });
          }
        });

        const dashArray = "10 10";
        gsap.set([connector1, connector2, connector3], {
          strokeDasharray: dashArray,
          strokeDashoffset: 0,
          opacity: 1,
        });
        gsap.set([orbit1, orbit2, orbit3], {
          strokeDashoffset: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });

        const moveDur = 1;
        const expandDur = 0.5;
        const readHold = 0.5;
        const buffer = 0.1;
        const totalDur =
          moveDur + expandDur + readHold + moveDur + expandDur + buffer;
        const stage1ExpandStart = moveDur - expandDur;
        const stage2MoveStart = stage1ExpandStart + expandDur + readHold;
        const stage2ExpandStart = stage2MoveStart + moveDur;
        const stage2BodyStart = stage2ExpandStart - expandDur;
        const orbit1Travel = getOrbitTravel(orbit1, 0.22);
        const orbit2Travel = getOrbitTravel(orbit2, 0.28);
        const orbit3Travel = getOrbitTravel(orbit3, 0.28);

        if (connector1 && connector3) {
          tl.to(
            [connector1, connector3],
            {
              strokeDashoffset: -400,
              duration: totalDur,
              ease: "none",
            },
            0,
          );
        }

        if (connector2) {
          tl.to(
            connector2,
            {
              strokeDashoffset: 400,
              duration: totalDur,
              ease: "none",
            },
            0,
          );
        }

        if (orbit1) {
          tl.to(
            orbit1,
            {
              strokeDashoffset: orbit1Travel,
              duration: stage1ExpandStart,
              ease: "none",
            },
            0,
          );
        }

        if (orbit2) {
          tl.to(
            orbit2,
            {
              strokeDashoffset: orbit2Travel,
              duration: stage2BodyStart - stage1ExpandStart,
              ease: "none",
            },
            stage1ExpandStart,
          );
        }

        if (orbit3) {
          tl.to(
            orbit3,
            {
              strokeDashoffset: orbit3Travel,
              duration: totalDur - stage2BodyStart,
              ease: "none",
            },
            stage2BodyStart,
          );
        }

        tl.to(
          cards[1],
          { y: top2Pos, duration: moveDur, ease: "power2.inOut" },
          0,
        );

        const path1 = wheelGroups[0].querySelector("path");
        const path2 = wheelGroups[1].querySelector("path");

        if (path1) tl.to(path1, { fill: inactiveFill, duration: moveDur }, 0);
        if (path2) tl.to(path2, { fill: activeFill, duration: moveDur }, 0);

        tl.to(
          bodies[1],
          {
            opacity: 1,
            height: "auto",
            duration: expandDur,
            ease: "power4.inOut",
          },
          stage1ExpandStart,
        );
        tl.to(
          bodies[0],
          { opacity: 0, height: 0, duration: expandDur, ease: "power4.inOut" },
          stage1ExpandStart,
        );

        tl.to(
          cards[2],
          { y: top3Pos, duration: moveDur, ease: "power2.inOut" },
          stage2MoveStart,
        );

        const path3 = wheelGroups[2].querySelector("path");
        if (path2)
          tl.to(
            path2,
            { fill: inactiveFill, duration: moveDur },
            stage2MoveStart,
          );
        if (path3)
          tl.to(path3, { fill: activeFill, duration: moveDur }, stage2MoveStart);

        tl.to(
          bodies[2],
          {
            opacity: 1,
            height: "auto",
            duration: expandDur,
            ease: "power4.inOut",
          },
          stage2BodyStart,
        );
        tl.to(
          bodies[1],
          { opacity: 0, height: 0, duration: expandDur, ease: "power4.inOut" },
          stage2BodyStart,
        );

        tl.to({}, { duration: buffer });
      }, track);

      return () => ctx.revert();
    });

    mm.add("(max-width: 800px)", () => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(
          viewport.querySelectorAll(`.${styles.card}`),
        );
        const bodies = gsap.utils.toArray<HTMLElement>(
          viewport.querySelectorAll(`.${styles.sectionBody}`),
        );
        const wheelGroups = gsap.utils.toArray<SVGGElement>(
          viewport.querySelectorAll(`.${styles.wheelGroup}`),
        );

        const connector1 = viewport.querySelector(`.${styles.connector1}`);
        const connector2 = viewport.querySelector(`.${styles.connector2}`);
        const connector3 = viewport.querySelector(`.${styles.connector3}`);

        if (cards.length < 3 || bodies.length < 3 || wheelGroups.length < 3) {
          return;
        }

        const orbit1 = getOrbitRing(wheelGroups[0]);
        const orbit2 = getOrbitRing(wheelGroups[1]);
        const orbit3 = getOrbitRing(wheelGroups[2]);

        const inactiveFill = "rgba(162, 119, 122, 0.1)";
        const activeFill = "rgba(162, 119, 122, 0.4)";

        gsap.set(cards, {
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: 0,
          position: "absolute",
        });
        gsap.set(cards[0], { autoAlpha: 1, zIndex: 3, pointerEvents: "auto" });
        gsap.set(cards[1], { autoAlpha: 0, zIndex: 2, pointerEvents: "none" });
        gsap.set(cards[2], { autoAlpha: 0, zIndex: 1, pointerEvents: "none" });

        gsap.set(bodies[0], { opacity: 1, height: "auto" });
        gsap.set(bodies[1], { opacity: 0, height: 0 });
        gsap.set(bodies[2], { opacity: 0, height: 0 });

        wheelGroups.forEach((g, i) => {
          gsap.set(g, { transformOrigin: "center", scale: 1, opacity: 1 });
          const path = g.querySelector("path");
          if (path) {
            gsap.set(path, { fill: i === 0 ? activeFill : inactiveFill });
          }
        });

        const dashArray = "10 10";
        gsap.set([connector1, connector2, connector3], {
          strokeDasharray: dashArray,
          strokeDashoffset: 0,
          opacity: 1,
        });
        gsap.set([orbit1, orbit2, orbit3], {
          strokeDashoffset: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });

        const moveDur = 1.1;
        const expandDur = 0.45;
        const readHold = 0.35;
        const buffer = 0.15;
        const totalDur =
          moveDur + expandDur + readHold + moveDur + expandDur + buffer;
        const phase1BodyStart = moveDur - expandDur;
        const phase2Start = phase1BodyStart + expandDur + readHold;
        const phase2BodyStart = phase2Start + moveDur - expandDur;
        const orbit1Travel = getOrbitTravel(orbit1, 0.22);
        const orbit2Travel = getOrbitTravel(orbit2, 0.28);
        const orbit3Travel = getOrbitTravel(orbit3, 0.28);

        if (connector1 && connector3) {
          tl.to(
            [connector1, connector3],
            {
              strokeDashoffset: -280,
              duration: totalDur,
              ease: "none",
            },
            0,
          );
        }

        if (connector2) {
          tl.to(
            connector2,
            {
              strokeDashoffset: 280,
              duration: totalDur,
              ease: "none",
            },
            0,
          );
        }

        if (orbit1) {
          tl.to(
            orbit1,
            {
              strokeDashoffset: orbit1Travel,
              duration: phase1BodyStart,
              ease: "none",
            },
            0,
          );
        }

        if (orbit2) {
          tl.to(
            orbit2,
            {
              strokeDashoffset: orbit2Travel,
              duration: phase2BodyStart - phase1BodyStart,
              ease: "none",
            },
            phase1BodyStart,
          );
        }

        if (orbit3) {
          tl.to(
            orbit3,
            {
              strokeDashoffset: orbit3Travel,
              duration: totalDur - phase2BodyStart,
              ease: "none",
            },
            phase2BodyStart,
          );
        }

        const path1 = wheelGroups[0].querySelector("path");
        const path2 = wheelGroups[1].querySelector("path");
        const path3 = wheelGroups[2].querySelector("path");

        tl.to(
          cards[0],
          {
            autoAlpha: 0,
            y: -16,
            duration: moveDur,
            ease: "power2.inOut",
            pointerEvents: "none",
          },
          0,
        );
        tl.fromTo(
          cards[1],
          { autoAlpha: 0, y: 16, pointerEvents: "none" },
          {
            autoAlpha: 1,
            y: 0,
            duration: moveDur,
            ease: "power2.inOut",
            pointerEvents: "auto",
          },
          0,
        );

        if (path1) tl.to(path1, { fill: inactiveFill, duration: moveDur }, 0);
        if (path2) tl.to(path2, { fill: activeFill, duration: moveDur }, 0);

        tl.to(
          bodies[1],
          {
            opacity: 1,
            height: "auto",
            duration: expandDur,
            ease: "power4.inOut",
          },
          phase1BodyStart,
        );
        tl.to(
          bodies[0],
          { opacity: 0, height: 0, duration: expandDur, ease: "power4.inOut" },
          phase1BodyStart,
        );

        tl.to(
          cards[1],
          {
            autoAlpha: 0,
            y: -16,
            duration: moveDur,
            ease: "power2.inOut",
            pointerEvents: "none",
          },
          phase2Start,
        );
        tl.fromTo(
          cards[2],
          { autoAlpha: 0, y: 16, pointerEvents: "none" },
          {
            autoAlpha: 1,
            y: 0,
            duration: moveDur,
            ease: "power2.inOut",
            pointerEvents: "auto",
          },
          phase2Start,
        );

        if (path2)
          tl.to(
            path2,
            { fill: inactiveFill, duration: moveDur },
            phase2Start,
          );
        if (path3) tl.to(path3, { fill: activeFill, duration: moveDur }, phase2Start);

        tl.to(
          bodies[2],
          {
            opacity: 1,
            height: "auto",
            duration: expandDur,
            ease: "power4.inOut",
          },
          phase2BodyStart,
        );
        tl.to(
          bodies[1],
          { opacity: 0, height: 0, duration: expandDur, ease: "power4.inOut" },
          phase2BodyStart,
        );

        tl.to({}, { duration: buffer });
      }, track);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={trackRef} className={styles.track}>
      <div ref={viewportRef} className={styles.stickyViewport}>
        <div className={styles.wheelSide}>
          <div className={styles.wheelContent}>
            <div className={styles.header}>
              <h2 className={styles.title}>{threeWheelStrategyContent.title}</h2>
              <p className={styles.subtitle}>{threeWheelStrategyContent.subtitle}</p>
            </div>

            <div className={styles.wheelContainer}>
              <svg
                width="611"
                height="688"
                viewBox="0 0 611 688"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.wheelSvg}
              >
                {/* Connectors - All flowing simultaneously */}

                {/* Connector 1 */}
                <line
                  x1="309"
                  y1="142"
                  x2="74"
                  y2="550"
                  stroke="#390509"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className={styles.connector1}
                />

                {/* Connector 2 */}
                <line
                  x1="309"
                  y1="142"
                  x2="499"
                  y2="489"
                  stroke="#390509"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className={styles.connector2}
                />

                {/* Connector 3 */}
                <line
                  x1="74"
                  y1="555"
                  x2="499"
                  y2="494"
                  stroke="#390509"
                  strokeWidth="2"
                  strokeDasharray="10 10"
                  className={styles.connector3}
                />

                {/* Node 1: Top Center (309, 142) */}
                <g className={styles.wheelGroup}>
                  {/* Background Shape */}
                  <path
                    style={{ transform: "translate(11px, 5px);" }}
                    d="M308 0.5C387.261 0.5 451.5 63.6361 451.5 141.5C451.5 219.364 387.261 282.5 308 282.5C228.739 282.5 164.5 219.364 164.5 141.5C164.5 63.6361 228.739 0.5 308 0.5Z"
                    stroke="#A2777A"
                    fill="rgba(162, 119, 122, 0.1)"
                  />
                  {/* Dashed Orbit */}
                  <ellipse
                    cx="325"
                    cy="149"
                    rx="144"
                    ry="141.5"
                    stroke="#5D3136"
                    strokeDasharray="4 4"
                    className={styles.orbitRing}
                  />
                  {/* Hub */}
                  <circle
                    cx="325"
                    cy="149"
                    r="9"
                    stroke="#390509"
                    strokeWidth="2"
                    fill="#FBF8F6"
                  />
                  {/* Label */}
                  <text
                    x="319"
                    y="90"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 14 }}
                  >
                    {threeWheelStrategyContent.wheel.node1.title}
                  </text>
                  <text
                    x="245"
                    y="160"
                    textAnchor="middle"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 9 }}
                  >
                    {threeWheelStrategyContent.wheel.node1.subLabelLeft}
                  </text>
                  <text
                    x="400"
                    y="200"
                    textAnchor="middle"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 9 }}
                  >
                    {threeWheelStrategyContent.wheel.node1.subLabelRight}
                  </text>
                </g>

                {/* Node 2: Bottom Left (80, 608) */}
                <g
                  style={{ transform: "translate(-0px, -60px);" }}
                  className={styles.wheelGroup}
                >
                  <path
                    d="M78 531.5C120.811 531.5 155.5 565.535 155.5 607.5C155.5 649.465 120.811 683.5 78 683.5C35.1887 683.5 0.5 649.465 0.5 607.5C0.5 565.535 35.1887 531.5 78 531.5Z"
                    stroke="#A2777A"
                    fill="rgba(162, 119, 122, 0.1)"
                  />
                  <ellipse
                    cx="82"
                    cy="610.5"
                    rx="78"
                    ry="76.5"
                    stroke="#5D3136"
                    strokeDasharray="4 4"
                    className={styles.orbitRing}
                  />
                  <circle
                    cx="80"
                    cy="608"
                    r="9"
                    stroke="#390509"
                    strokeWidth="2"
                    fill="#FBF8F6"
                  />
                  <text
                    x="80"
                    y="650"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 11 }}
                  >
                    {threeWheelStrategyContent.wheel.node2.title}
                  </text>
                  <text
                    x="70"
                    y="570"
                    transform="rotate(-35 80 600)"
                    textAnchor="middle"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 8 }}
                  >
                    {threeWheelStrategyContent.wheel.node2.subLabel}
                  </text>
                </g>

                {/* Node 3: Bottom Right (525, 519) */}
                <g className={styles.wheelGroup}>
                  <path
                    d="M521.5 433.5C569.557 433.5 608.5 471.788 608.5 519C608.5 566.212 569.557 604.5 521.5 604.5C473.443 604.5 434.5 566.212 434.5 519C434.5 471.788 473.443 433.5 521.5 433.5Z"
                    stroke="#A2777A"
                    fill="rgba(162, 119, 122, 0.1)"
                  />
                  <ellipse
                    cx="525"
                    cy="521.5"
                    rx="85"
                    ry="83.5"
                    stroke="#5D3136"
                    strokeDasharray="4 4"
                    className={styles.orbitRing}
                  />
                  <circle
                    cx="525"
                    cy="519"
                    r="9"
                    stroke="#390509"
                    strokeWidth="2"
                    fill="#FBF8F6"
                  />
                  <text
                    x="525"
                    y="560"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 11 }}
                  >
                    {threeWheelStrategyContent.wheel.node3.titleLine1}
                  </text>
                  <text
                    x="525"
                    y="575"
                    textAnchor="middle"
                    className={styles.wheelLabel}
                    style={{ fontSize: 11 }}
                  >
                    {threeWheelStrategyContent.wheel.node3.titleLine2}
                  </text>
                  <text
                    x="500"
                    y="490"
                    textAnchor="middle"
                    transform="rotate(40 525 560)"
                    className={styles.wheelSubLabel}
                    style={{ fontSize: 11 }}
                  >
                    {threeWheelStrategyContent.wheel.node3.subLabel}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Cards */}
        <div className={styles.cardsSide}>
          {threeWheelStrategyContent.sections.map((section) => (
            <div key={section.id} className={styles.card}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionNumber}>{section.id}</div>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
              </div>

              <div className={styles.sectionBody}>
                <p className={styles.sectionDescription}>
                  {section.description}
                </p>
                {threeWheelStrategyContent.consultButtonLabel ? (
                  <button className={styles.consultButton}>
                    {threeWheelStrategyContent.consultButtonLabel}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
