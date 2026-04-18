"use client";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ArrowCorner } from "./ArrowCorner";
import styles from "./WorkloomPage.module.scss";

gsap.registerPlugin(ScrambleTextPlugin);

const steps = [
  {
    id: "01",
    title: "capture",
    description:
      "every 60 seconds, workloom checks your active window. smart filter rules decide what to record — skipping spotify, flagging youtube, logging your code editor.",
  },
  {
    id: "02",
    title: "analyze",
    description:
      "a local vision model reads the screenshot. it extracts what you were doing, any visible text, and classifies the activity type. nothing leaves your machine.",
  },
  {
    id: "03",
    title: "digest",
    description:
      "at 10 pm, sessions are assembled into a structured report. distractions, insights, ideas worth revisiting. saved as markdown to your local drive.",
  },
];

const features = [
  {
    id: "01",
    title: "local first",
    description:
      "screenshots never leave your machine. a local vision model reads them, extracts what matters, then they're gone. only text summaries are stored.",
    background: "#D8BFC1",
    color: "#5D3136",
  },
  {
    id: "02",
    title: "daily digests",
    description:
      "every evening, a structured report appears. what you worked on, what pulled you off track, ideas that surfaced. all in markdown. all yours.",
    background: "#7B5A5C",
    color: "#FEFBF6",
  },
  {
    id: "03",
    title: "interactive chat",
    description:
      "ask your activity history anything. find the article from tuesday. understand what triggered your context switch. powered by semantic search.",
    background: "#FFFFFF",
    color: "#5D3136",
  },
  {
    id: "04",
    title: "fully customizable",
    description:
      "change filtering rules, digest structure, and summary tone through markdown files. no code required. your workflow, your language.",
    background: "#F9ECDF",
    color: "#5D3136",
  },
  {
    id: "05",
    title: "open source",
    description:
      "built in python. runs on mac, windows, and linux. no subscriptions, no accounts, no tracking. fork it, extend it, make it yours.",
    background: "#5D3136",
    color: "#FEFBF6",
  },
];

export function WorkloomPage() {
  const scramble = (el: HTMLElement | null) => {
    if (!el) return;
    if (!el.dataset.original) el.dataset.original = el.textContent ?? "";
    gsap.killTweensOf(el);
    gsap.to(el, {
      duration: 0.7,
      scrambleText: {
        text: el.dataset.original,
        chars: "upperCase",
        speed: 0.9,
      },
    });
  };

  const reset = (el: HTMLElement | null) => {
    if (!el) return;
    gsap.killTweensOf(el);
    el.textContent = el.dataset.original ?? el.textContent ?? "";
  };

  const getLabel = (btn: HTMLElement) =>
    btn.querySelector<HTMLElement>(`.${styles.btnLabel}`);

  return (
    <div className={styles.page}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroMeta}>
          <span className={styles.tag}>WORKLOOM</span>
          <span className={styles.tagDivider}>/</span>
          <span className={styles.tag}>012</span>
        </div>

        <h1 className={styles.heroTitle}>
          see what you
          <br />
          actually worked
          <br />
          on today.
        </h1>

        <p className={styles.heroSub}>
          privacy-first activity tracking for knowledge workers.
          <br />
          local models. intelligent digests. no cloud required.
        </p>

        <div className={styles.heroActions}>
          <a
            href="https://github.com/banbury-cheese/workloom"
            className={styles.btn}
            onMouseEnter={(e) => scramble(getLabel(e.currentTarget))}
            onMouseLeave={(e) => reset(getLabel(e.currentTarget))}
            onFocus={(e) => scramble(getLabel(e.currentTarget))}
            onBlur={(e) => reset(getLabel(e.currentTarget))}
          >
            <span className={styles.btnLabel}>VIEW ON GITHUB</span>
            <ArrowCorner mirror size={16} color="#FEFBF6" />
          </a>
        </div>

        <div className={styles.heroCornerBr}></div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className={styles.steps}>
        <div className={styles.sectionHeader}>
          <span className={styles.tag}>HOW IT WORKS</span>
          <ArrowCorner mirror size={20} />
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.id} className={styles.step}>
              <span className={styles.stepId}>{step.id}/</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.tag}>WHAT YOU GET</span>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((f) => (
            <div
              key={f.id}
              className={styles.featureCard}
              style={{ backgroundColor: f.background, color: f.color }}
            >
              <span className={styles.featureId}>{f.id}/</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────────── */}
      <section className={styles.privacy}>
        <div className={styles.privacyInner}>
          <div className={styles.privacyLeft}>
            <span className={styles.tag}>PRIVACY</span>
            <h2 className={styles.privacyTitle}>
              your data,
              <br />
              your machine.
            </h2>
          </div>
          <div className={styles.privacyRight}>
            <p className={styles.privacyText}>
              screenshots are analyzed in memory and never written to disk.
              window titles and summaries stay local. the only thing that
              touches the cloud is your final digest — and only if you choose a
              cloud provider. you can run entirely offline with a local ollama
              model.
            </p>
            <div className={styles.privacyMeta}>
              <span>NO TRACKING</span>
              <span>NO ACCOUNTS</span>
              <span>NO SUBSCRIPTIONS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaCornerTl}></div>

        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>
            built for the way knowledge workers actually work.
          </h2>
          <a
            href="https://github.com/banbury-cheese/workloom"
            className={`${styles.btn} ${styles.btnLight}`}
            onMouseEnter={(e) => scramble(getLabel(e.currentTarget))}
            onMouseLeave={(e) => reset(getLabel(e.currentTarget))}
            onFocus={(e) => scramble(getLabel(e.currentTarget))}
            onBlur={(e) => reset(getLabel(e.currentTarget))}
          >
            <span className={styles.btnLabel}>GET STARTED</span>
            <ArrowCorner mirror size={16} color="#5D3136" />
          </a>
          <p className={styles.ctaNote}>
            open source · python 3.11+ · mac · windows · linux
          </p>
        </div>

        <div className={styles.ctaCornerBr}>
          {/* <ArrowCorner size={24} color="#FEFBF6" /> */}
        </div>
      </section>
    </div>
  );
}
