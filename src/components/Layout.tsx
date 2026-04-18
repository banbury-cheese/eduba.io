"use client";

import { ReactNode, useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Toaster } from "sonner";
import styles from "@/app/page.module.scss";
import { layoutContent } from "@/data/homeContent";

gsap.registerPlugin(ScrambleTextPlugin);

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const scrambleLabel = (text: HTMLElement | null, activeColor: string) => {
    if (!text) return;

    if (!text.dataset.originalLabel) {
      text.dataset.originalLabel = text.textContent || "";
    }

    gsap.killTweensOf(text);
    gsap.to(text, {
      color: activeColor,
      duration: 0.2,
      ease: "power2.out",
    });
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

  const resetLabel = (text: HTMLElement | null, restingColor: string) => {
    if (!text) return;

    gsap.killTweensOf(text);
    text.textContent = text.dataset.originalLabel || text.textContent || "";
    gsap.to(text, {
      color: restingColor,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const animateDots = (element: HTMLElement) => {
    const dots = element.querySelectorAll("[data-dot]");
    gsap.killTweensOf(dots);
    gsap.to(dots, {
      scale: 1.55,
      transformOrigin: "50% 50%",
      duration: 0.12,
      stagger: 0.024,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  };

  const resetDots = (element: HTMLElement) => {
    const dots = element.querySelectorAll("[data-dot]");
    gsap.killTweensOf(dots);
    gsap.to(dots, {
      scale: 1,
      transformOrigin: "50% 50%",
      duration: 0.18,
      stagger: 0.01,
      ease: "power2.inOut",
    });
  };

  const animateLogo = (element: HTMLElement) => {
    const svg = element.querySelector(
      `.${styles.logoIcon} svg`,
    ) as SVGElement | null;
    const node = svg?.querySelector("[data-logo-node]") as SVGElement | null;
    if (!svg) return;
    gsap.killTweensOf([svg, node].filter(Boolean));
    gsap.to(svg, {
      // scale: 1.14,
      duration: 0.22,
      ease: "back.out(2)",
      transformOrigin: "50% 50%",
    });
    if (node) gsap.to(node, { x: 2, duration: 0.28, ease: "back.out(1.5)" });
  };

  const resetLogo = (element: HTMLElement) => {
    const svg = element.querySelector(
      `.${styles.logoIcon} svg`,
    ) as SVGElement | null;
    const node = svg?.querySelector("[data-logo-node]") as SVGElement | null;
    if (!svg) return;
    gsap.killTweensOf([svg, node].filter(Boolean));
    gsap.to(svg, {
      // scale: 1,
      duration: 0.3,
      ease: "power2.out",
      transformOrigin: "50% 50%",
    });
    if (node) gsap.to(node, { x: 0, duration: 0.3, ease: "power2.out" });
  };

  // ── Contact form ──────────────────────────────────────────────────────────
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const isOpenRef = useRef(false);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const openContact = useCallback(() => {
    isOpenRef.current = true;
    setIsContactOpen(true);
    gsap.to(arrowRef.current, {
      rotate: 180,
      duration: 0.38,
      ease: "power2.inOut",
    });
    if (contentRef.current)
      gsap.to(contentRef.current, {
        filter: "blur(7px)",
        duration: 0.45,
        ease: "power2.out",
      });
    setTimeout(() => {
      const fields =
        formPanelRef.current?.querySelectorAll("[data-field]") ?? [];
      gsap.fromTo(
        fields,
        { opacity: 0, y: 7 },
        {
          opacity: 1,
          y: 0,
          duration: 0.26,
          stagger: 0.055,
          ease: "power2.out",
        },
      );
    }, 90);
  }, []);

  const closeContact = useCallback(() => {
    isOpenRef.current = false;
    setIsContactOpen(false);
    gsap.to(arrowRef.current, {
      rotate: 0,
      duration: 0.32,
      ease: "power2.inOut",
    });
    if (contentRef.current)
      gsap.to(contentRef.current, {
        filter: "blur(0px)",
        duration: 0.32,
        ease: "power2.out",
      });
  }, []);

  const handleToggleContact = useCallback(() => {
    if (isOpenRef.current) closeContact();
    else openContact();
  }, [openContact, closeContact]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("New message from eduba.io");
    const body = encodeURIComponent(
      `From: ${contactEmail}\n\nMessage:\n${contactMessage}`,
    );
    window.open(`mailto:info@eduba.io?subject=${subject}&body=${body}`);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setContactEmail("");
      setContactMessage("");
      closeContact();
    }, 1400);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContact();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeContact]);
  // ──────────────────────────────────────────────────────────────────────────

  const handleNavLinkEnter = (
    element: HTMLElement,
    selector: string,
    activeColor: string,
  ) => {
    const text = element.querySelector(selector) as HTMLElement | null;
    scrambleLabel(text, activeColor);
  };

  const handleNavLinkLeave = (
    element: HTMLElement,
    selector: string,
    restingColor: string,
  ) => {
    const text = element.querySelector(selector) as HTMLElement | null;
    resetLabel(text, restingColor);
  };

  const handleChipEnter = (
    element: HTMLElement,
    selector: string,
    options: {
      backgroundColor: string;
      color: string;
      scaleX?: number;
      borderColor?: string;
    },
  ) => {
    const text = element.querySelector(selector) as HTMLElement | null;
    const background = element.querySelector(
      `.${styles.navChipBg}`,
    ) as HTMLElement | null;

    if (background) {
      gsap.killTweensOf(background);
      gsap.to(background, {
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor ?? "transparent",
        scaleX: options.scaleX ?? 1.04,
        duration: 0.18,
        ease: "power2.out",
      });
    }

    gsap.killTweensOf(element);
    gsap.to(element, {
      color: options.color,
      duration: 0.18,
      ease: "power2.out",
    });

    scrambleLabel(text, options.color);
  };

  const handleChipLeave = (
    element: HTMLElement,
    selector: string,
    options: {
      backgroundColor: string;
      color: string;
      borderColor?: string;
    },
  ) => {
    const text = element.querySelector(selector) as HTMLElement | null;
    const background = element.querySelector(
      `.${styles.navChipBg}`,
    ) as HTMLElement | null;

    if (background) {
      gsap.killTweensOf(background);
      gsap.to(background, {
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor ?? "transparent",
        scaleX: 1,
        duration: 0.18,
        ease: "power2.out",
      });
    }

    gsap.killTweensOf(element);
    gsap.to(element, {
      color: options.color,
      duration: 0.18,
      ease: "power2.out",
    });

    resetLabel(text, options.color);
  };

  return (
    <div className={styles.frame}>
      {/* Top Navigation */}
      <nav className={styles.topNav}>
        <Link
          href="/"
          className={styles.logoSection}
          aria-label="Go to home page"
          onMouseEnter={(event) => {
            animateLogo(event.currentTarget);
            scrambleLabel(
              event.currentTarget.querySelector(
                `.${styles.navScrambleText}`,
              ) as HTMLElement | null,
              "#FEFBF6",
            );
          }}
          onMouseLeave={(event) => {
            resetLogo(event.currentTarget);
            resetLabel(
              event.currentTarget.querySelector(
                `.${styles.navScrambleText}`,
              ) as HTMLElement | null,
              "#FEFBF6",
            );
          }}
          onFocus={(event) => {
            animateLogo(event.currentTarget);
            scrambleLabel(
              event.currentTarget.querySelector(
                `.${styles.navScrambleText}`,
              ) as HTMLElement | null,
              "#FEFBF6",
            );
          }}
          onBlur={(event) => {
            resetLogo(event.currentTarget);
            resetLabel(
              event.currentTarget.querySelector(
                `.${styles.navScrambleText}`,
              ) as HTMLElement | null,
              "#FEFBF6",
            );
          }}
        >
          <div className={styles.logoIcon}>
            <svg
              width="20"
              height="17"
              viewBox="0 0 20 17"
              fill="none"
              overflow="visible"
              aria-hidden="true"
            >
              <path
                data-logo-body
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.6449 5.37454C14.1291 5.37454 15.3322 4.17141 15.3322 2.68727C15.3322 1.20313 14.1291 0 12.6449 0C11.1608 0 9.95767 1.20313 9.95767 2.68727C9.95767 2.88914 9.97993 3.08582 10.0221 3.27498C10.1034 3.63943 10.0779 4.03564 9.85072 4.33202C9.50365 4.78485 8.84405 4.8297 8.30273 4.64944C8.03569 4.56051 7.75001 4.51235 7.45308 4.51235C5.96895 4.51235 4.76581 5.71548 4.76581 7.19962C4.76581 7.46426 4.80407 7.71996 4.87534 7.96149C5.08124 8.65923 5.17445 9.46975 4.7319 10.0472L4.68089 10.1138C4.24349 10.6844 3.44883 10.8108 2.72989 10.7996C2.71571 10.7994 2.7015 10.7993 2.68727 10.7993C1.20313 10.7993 0 12.0024 0 13.4865C0 14.9707 1.20313 16.1738 2.68727 16.1738C4.17141 16.1738 5.37454 14.9707 5.37454 13.4865C5.37454 13.3059 5.35673 13.1295 5.32276 12.9589C5.19808 12.3327 5.17437 11.637 5.56281 11.1302L6.1003 10.4289C6.41001 10.0248 6.94397 9.88685 7.45308 9.88685C7.9624 9.88685 8.4966 10.0248 8.80643 10.4291L9.41984 11.2294C9.79779 11.7225 9.78579 12.3964 9.67586 13.008C9.64795 13.1633 9.63337 13.3232 9.63337 13.4865C9.63337 14.9707 10.8365 16.1738 12.3206 16.1738C13.8048 16.1738 15.0079 14.9707 15.0079 13.4865C15.0079 12.0024 13.8048 10.7993 12.3206 10.7993C12.2921 10.7993 12.2637 10.7997 12.2354 10.8006C11.4997 10.8235 10.6795 10.7058 10.2317 10.1216L10.1744 10.0468C9.7319 9.46943 9.82505 8.659 10.0309 7.96132C10.1021 7.71983 10.1404 7.46419 10.1404 7.19962C10.1404 7.1147 10.1364 7.0307 10.1287 6.9478C10.0912 6.54464 10.1398 6.12194 10.3861 5.80058C10.7798 5.28693 11.5145 5.21091 12.1507 5.32919C12.3109 5.35897 12.4761 5.37454 12.6449 5.37454Z"
                fill="white"
              />
              <path
                data-logo-node
                d="M20.0004 8.91127C20.0004 10.3955 18.7972 11.5986 17.3131 11.5986C15.829 11.5986 14.6258 10.3955 14.6258 8.91127C14.6258 7.42713 15.829 6.224 17.3131 6.224C18.7972 6.224 20.0004 7.42713 20.0004 8.91127Z"
                fill="white"
              />
            </svg>
          </div>
          <span className={`${styles.logoText} ${styles.navScrambleText}`}>
            {layoutContent.logoText}
          </span>
        </Link>
        <div className={styles.navLinks}>
          <a
            href={layoutContent.topNav.readingsHref}
            className={styles.readingsLink}
            aria-label={layoutContent.topNav.readingsLabel}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(event) =>
              handleNavLinkEnter(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                "#EAD5D6",
              )
            }
            onMouseLeave={(event) =>
              handleNavLinkLeave(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                "#EAD5D6",
              )
            }
            onFocus={(event) =>
              handleNavLinkEnter(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                "#EAD5D6",
              )
            }
            onBlur={(event) =>
              handleNavLinkLeave(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                "#EAD5D6",
              )
            }
          >
            <span className={`${styles.navLabel} ${styles.navScrambleText}`}>
              {layoutContent.topNav.readingsLabel}
            </span>
          </a>
          <a
            className={styles.chaptersButton}
            href={layoutContent.topNav.chaptersHref}
            aria-label={layoutContent.topNav.chaptersLabel}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={(event) => {
              handleChipEnter(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#FEFBF6",
                  color: "#5D3136",
                  scaleX: 1.04,
                },
              );
              animateDots(event.currentTarget);
            }}
            onMouseLeave={(event) => {
              handleChipLeave(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#D8BFC0",
                  color: "#5D3136",
                },
              );
              resetDots(event.currentTarget);
            }}
            onFocus={(event) => {
              handleChipEnter(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#FEFBF6",
                  color: "#5D3136",
                  scaleX: 1.04,
                },
              );
              animateDots(event.currentTarget);
            }}
            onBlur={(event) => {
              handleChipLeave(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#D8BFC0",
                  color: "#5D3136",
                },
              );
              resetDots(event.currentTarget);
            }}
          >
            <span className={styles.navChipBg} aria-hidden="true" />
            <span className={styles.navButtonContent}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="9"
                viewBox="0 0 11 9"
                fill="none"
                overflow="visible"
                aria-hidden="true"
              >
                <g>
                  <path
                    data-dot
                    d="M10.4572 0C10.757 -3.7046e-09 10.9999 0.25184 10.9999 0.5625V0.84375C10.9999 1.15441 10.757 1.40625 10.4572 1.40625H10.1858C9.88605 1.40625 9.64307 1.15441 9.64307 0.84375V0.5625C9.64307 0.25184 9.88605 7.05846e-09 10.1858 3.35388e-09L10.4572 0Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M8.01486 0C8.31458 -3.70458e-09 8.55762 0.25184 8.55762 0.5625V0.84375C8.55762 1.15441 8.31458 1.40625 8.01486 1.40625H7.74345C7.44367 1.40625 7.20068 1.15441 7.20068 0.84375V0.5625C7.20068 0.25184 7.44367 7.05846e-09 7.74345 3.35388e-09L8.01486 0Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M5.57232 0C5.8721 -3.705e-09 6.11509 0.25184 6.11509 0.5625V0.84375C6.11509 1.15441 5.8721 1.40625 5.57232 1.40625H5.30094C5.00118 1.40625 4.75818 1.15441 4.75818 0.84375V0.5625C4.75818 0.25184 5.00118 7.0584e-09 5.30094 3.354e-09L5.57232 0Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M3.12994 0C3.4297 -3.7044e-09 3.6727 0.25184 3.6727 0.5625V0.84375C3.6727 1.15441 3.4297 1.40625 3.12994 1.40625H2.85856C2.5588 1.40625 2.3158 1.15441 2.3158 0.84375V0.5625C2.3158 0.25184 2.5588 7.0584e-09 2.85856 3.354e-09L3.12994 0Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M10.4572 2.53125C10.757 2.53125 10.9999 2.78309 10.9999 3.09375V3.375C10.9999 3.68566 10.757 3.9375 10.4572 3.9375H10.1858C9.88605 3.9375 9.64307 3.68566 9.64307 3.375V3.09375C9.64307 2.78309 9.88605 2.53125 10.1858 2.53125H10.4572Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M8.01486 2.53125C8.31458 2.53125 8.55762 2.78309 8.55762 3.09375V3.375C8.55762 3.68566 8.31458 3.9375 8.01486 3.9375H7.74345C7.44367 3.9375 7.20068 3.68566 7.20068 3.375V3.09375C7.20068 2.78309 7.44367 2.53125 7.74345 2.53125H8.01486Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M10.4572 5.0625C10.757 5.0625 10.9999 5.31434 10.9999 5.625V5.90625C10.9999 6.2169 10.757 6.46878 10.4572 6.46878H10.1858C9.88605 6.46878 9.64307 6.2169 9.64307 5.90625V5.625C9.64307 5.31434 9.88605 5.0625 10.1858 5.0625H10.4572Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M10.4572 7.59378C10.757 7.59378 10.9999 7.8456 10.9999 8.15628V8.4375C10.9999 8.74818 10.757 9 10.4572 9H10.1858C9.88605 9 9.64307 8.74818 9.64307 8.4375V8.15628C9.64307 7.8456 9.88605 7.59378 10.1858 7.59378H10.4572Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M0.542763 9C0.243003 9 -3.57461e-09 8.74818 0 8.4375L3.2362e-09 8.15628C6.81079e-09 7.8456 0.243003 7.59378 0.542763 7.59378H0.814145C1.11391 7.59378 1.35691 7.8456 1.35691 8.15628V8.4375C1.35691 8.74818 1.11391 9 0.814145 9H0.542763Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M2.98515 9C2.68538 9 2.44238 8.74818 2.44238 8.4375V8.15628C2.44238 7.8456 2.68538 7.59378 2.98515 7.59378H3.25653C3.55629 7.59378 3.79929 7.8456 3.79929 8.15628V8.4375C3.79929 8.74818 3.55629 9 3.25653 9H2.98515Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M5.42765 9C5.12789 9 4.88489 8.74818 4.88489 8.4375V8.15628C4.88489 7.8456 5.12789 7.59378 5.42765 7.59378H5.69903C5.99878 7.59378 6.24182 7.8456 6.24182 8.15628V8.4375C6.24182 8.74818 5.99878 9 5.69903 9H5.42765Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M7.87016 9C7.57038 9 7.32739 8.74818 7.32739 8.4375V8.15628C7.32739 7.8456 7.57038 7.59378 7.87016 7.59378H8.14151C8.44129 7.59378 8.68427 7.8456 8.68427 8.15628V8.4375C8.68427 8.74818 8.44129 9 8.14151 9H7.87016Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M0.542763 6.46878C0.243003 6.46878 -3.57459e-09 6.2169 0 5.90625L3.2362e-09 5.625C6.8108e-09 5.31434 0.243003 5.0625 0.542763 5.0625H0.814145C1.11391 5.0625 1.35691 5.31434 1.35691 5.625V5.90625C1.35691 6.2169 1.11391 6.46878 0.814145 6.46878H0.542763Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M2.98515 6.46878C2.68538 6.46878 2.44238 6.2169 2.44238 5.90625V5.625C2.44238 5.31434 2.68538 5.0625 2.98515 5.0625H3.25653C3.55629 5.0625 3.79929 5.31434 3.79929 5.625V5.90625C3.79929 6.2169 3.55629 6.46878 3.25653 6.46878H2.98515Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M0.542763 3.9375C0.243003 3.9375 -3.575e-09 3.68566 0 3.375L3.23632e-09 3.09375C6.81074e-09 2.78309 0.243003 2.53125 0.542763 2.53125H0.814145C1.11391 2.53125 1.35691 2.78309 1.35691 3.09375V3.375C1.35691 3.68566 1.11391 3.9375 0.814145 3.9375H0.542763Z"
                    fill="#421D24"
                  />
                  <path
                    data-dot
                    d="M0.542763 1.40625C0.243003 1.40625 -3.57442e-09 1.15441 0 0.84375L3.23631e-09 0.5625C6.81073e-09 0.25184 0.243003 -3.7046e-09 0.542763 0L0.814145 3.35388e-09C1.11391 7.05846e-09 1.35691 0.25184 1.35691 0.5625V0.84375C1.35691 1.15441 1.11391 1.40625 0.814145 1.40625H0.542763Z"
                    fill="#421D24"
                  />
                </g>
              </svg>
              <span className={`${styles.navLabel} ${styles.navScrambleText}`}>
                {layoutContent.topNav.chaptersLabel}
              </span>
            </span>
          </a>
          <a
            className={styles.navButtonPrimary}
            href={layoutContent.topNav.primaryCtaHref}
            onMouseEnter={(event) =>
              handleChipEnter(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#FEFBF6",
                  color: "#5D3136",
                  scaleX: 1.04,
                  borderColor: "#EAD5D6",
                },
              )
            }
            onMouseLeave={(event) =>
              handleChipLeave(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#000000",
                  color: "#FEFBF6",
                  borderColor: "transparent",
                },
              )
            }
            onFocus={(event) =>
              handleChipEnter(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#FEFBF6",
                  color: "#5D3136",
                  scaleX: 1.04,
                  borderColor: "#EAD5D6",
                },
              )
            }
            onBlur={(event) =>
              handleChipLeave(
                event.currentTarget,
                `.${styles.navScrambleText}`,
                {
                  backgroundColor: "#000000",
                  color: "#FEFBF6",
                  borderColor: "transparent",
                },
              )
            }
          >
            <span className={styles.navChipBg} aria-hidden="true" />
            <span className={styles.navButtonContent}>
              <span className={styles.dot}></span>
              <span className={styles.navScrambleText}>
                {layoutContent.topNav.primaryCtaLabel}
              </span>
            </span>
          </a>
        </div>
        {/* <div className={styles.navArrowLeft}>
          <ArrowCorner />
        </div>
        <div className={styles.navArrowRight}>
          <ArrowCorner mirror />
        </div> */}
      </nav>

      {/* Main Scrollable Content */}
      <main ref={contentRef} className={styles.contentWrapper}>
        {children}
      </main>

      {/* Backdrop — closes form when clicking blurred area */}
      {isContactOpen && (
        <div
          className={styles.contactBackdrop}
          onClick={closeContact}
          aria-hidden="true"
        />
      )}

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <div
          className={styles.bookCallButton}
          style={{ pointerEvents: "auto" }}
        >
          <div className={styles.bookCallOuter}>
            <div className={styles.bookCallInner}>
              {/* ── Expandable contact form ── */}
              <div
                ref={formPanelRef}
                className={`${styles.contactFormPanel} ${isContactOpen ? styles.contactFormPanelOpen : ""}`}
              >
                <div className={styles.contactFormContent}>
                  <div className={styles.contactFormInner}>
                    <div className={styles.contactHeaderRow} data-field>
                      <span className={styles.contactHeaderLabel}>
                        (compose_message)
                      </span>
                    </div>
                    <form onSubmit={handleContactSubmit}>
                      <div className={styles.contactFieldGroup} data-field>
                        <label
                          className={styles.contactLabel}
                          htmlFor="cf-email"
                        >
                          From ················
                        </label>
                        <input
                          id="cf-email"
                          type="email"
                          className={styles.contactInput}
                          placeholder="your@email.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>
                      <div className={styles.contactFieldGroup} data-field>
                        <label
                          className={styles.contactLabel}
                          htmlFor="cf-message"
                        >
                          Message ············
                        </label>
                        <textarea
                          id="cf-message"
                          className={styles.contactTextarea}
                          placeholder="Write your message..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          rows={4}
                          required
                        />
                      </div>
                      <div className={styles.contactSendRow} data-field>
                        <button
                          type="submit"
                          className={`${styles.sendButton} ${submitSuccess ? styles.sendButtonSuccess : ""}`}
                        >
                          <span>
                            {submitSuccess
                              ? "Message opened ✓"
                              : "Send message"}
                          </span>
                          {!submitSuccess && (
                            <span className={styles.sendArrow}>→</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* ── Trigger ── */}
              <button
                type="button"
                className={styles.bookCallTrigger}
                onClick={handleToggleContact}
              >
                <span className={styles.bookCallTitle}>
                  {layoutContent.bottomNav.bookCallTitle}
                </span>
                <span className={styles.bookCallSubtitle}>
                  {layoutContent.bottomNav.bookCallSubtitle}
                </span>
              </button>
            </div>
          </div>
          {/* Arrow toggle button */}
          <button
            type="button"
            className={styles.bookCallArrow}
            onClick={handleToggleContact}
            aria-label={
              isContactOpen ? "Close contact form" : "Open contact form"
            }
            style={{ pointerEvents: "auto" }}
          >
            <svg
              ref={arrowRef}
              width="14"
              height="16"
              viewBox="0 0 14 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.25"
                width="13.5"
                height="14.5"
                fill="white"
                stroke="#421D24"
                strokeWidth="0.5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.2577 7.13831H11.2766L7.13832 2.99998L3 7.13831H3.01893C5.37182 5.07315 8.90483 5.07315 11.2577 7.13831Z"
                fill="#421D24"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.2885 11.1691H11.3075L7.16914 7.03081L3.03082 11.1691H3.04976C5.40264 9.10398 8.93566 9.10397 11.2885 11.1691Z"
                fill="#421D24"
              />
            </svg>
          </button>
        </div>
      </nav>

      <Toaster
        className={styles.edubaToaster}
        position="bottom-right"
        visibleToasts={1}
        closeButton={false}
        duration={1400}
        offset={{ right: 18, bottom: 88 }}
        mobileOffset={{ right: 10, left: 10, bottom: 72 }}
        toastOptions={{
          closeButton: false,
          style: {
            background: "#5D3136",
            color: "#FEFBF6",
            border: "1px solid rgba(234, 213, 214, 0.35)",
            borderRadius: "4px",
            boxShadow: "0 18px 40px rgba(93, 49, 54, 0.16)",
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "11px",
            letterSpacing: "0.04em",
            lineHeight: "1.2",
            padding: "10px 14px",
            textTransform: "uppercase",
          },
        }}
      />
    </div>
  );
}
