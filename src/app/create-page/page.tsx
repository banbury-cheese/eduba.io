"use client";

import { useState } from "react";
import { Layout } from "@/components/Layout";
import styles from "./page.module.scss";

const defaultSector = "Enterprise";

export default function CreatePage() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/create-page", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Failed to generate page");
        return;
      }

      setStatus("success");
      setResult(data.url || "Page created. Check the logs for details.");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.kicker}>CREATE PAGE</div>
          <h1 className={styles.title}>Build a tailored sector page</h1>
          <p className={styles.subtitle}>
            Share the company context, attach docs and links, and we will
            auto-generate a custom sector page that ships straight to Sanity.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.section}>
            <div className={styles.sectionMeta}>
              <span>001</span>
              <span className={styles.sectionSlash}>/</span>
              <span>DETAILS</span>
            </div>
            <div className={styles.sectionBody}>
              <label className={styles.label}>
                Company name
                <input
                  name="company"
                  className={styles.input}
                  placeholder="Acme Aerospace"
                  required
                />
              </label>
              <div className={styles.row}>
                <label className={styles.label}>
                  Sector label
                  <input
                    name="sector"
                    className={styles.input}
                    defaultValue={defaultSector}
                    placeholder="Enterprise"
                    required
                  />
                </label>
                <label className={styles.label}>
                  Custom slug (optional)
                  <input
                    name="slug"
                    className={styles.input}
                    placeholder="acme-aerospace"
                  />
                </label>
              </div>
              <label className={styles.label}>
                Conversation/context summary
                <textarea
                  name="context"
                  className={styles.textarea}
                  placeholder="Paste your notes, goals, constraints, and outcomes here."
                />
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionMeta}>
              <span>002</span>
              <span className={styles.sectionSlash}>/</span>
              <span>SOURCES</span>
            </div>
            <div className={styles.sectionBody}>
              <label className={styles.label}>
                Attach documents
                <input
                  type="file"
                  name="documents"
                  className={styles.fileInput}
                  multiple
                  accept=".pdf,.docx,.txt,.md"
                />
              </label>
              <label className={styles.label}>
                Links (one per line)
                <textarea
                  name="links"
                  className={styles.textarea}
                  placeholder="https://example.com/case-study"
                />
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Generating..." : "Generate Page"}
            </button>
            <p className={styles.helper}>
              The agent will publish to Sanity automatically and return a live
              preview link.
            </p>
          </div>

          {status === "success" && result && (
            <div className={styles.result}>
              <span className={styles.resultLabel}>Published:</span>
              <a className={styles.resultLink} href={result} target="_blank">
                {result}
              </a>
            </div>
          )}
          {status === "error" && error && (
            <div className={styles.error}>{error}</div>
          )}
        </form>
      </div>
    </Layout>
  );
}
