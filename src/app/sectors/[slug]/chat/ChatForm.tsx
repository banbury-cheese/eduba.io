"use client";

import { useState } from "react";
import styles from "./page.module.scss";

interface ChatFormProps {
  slug: string;
  title: string;
  pageTag: string;
}

export function ChatForm({ slug, title, pageTag }: ChatFormProps) {
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
    formData.set("slug", slug);

    try {
      const response = await fetch("/api/sector-chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Failed to update page");
        return;
      }

      setStatus("success");
      setResult(data.url || "Page updated. Check the logs for details.");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.kicker}>SECTOR CHAT</div>
        <h1 className={styles.title}>Refine {title}</h1>
        <p className={styles.subtitle}>
          Use the chat to tailor {pageTag.toLowerCase()} content, pricing, and
          positioning for this specific company.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="hidden" name="sector" value={title} />
        <div className={styles.section}>
          <div className={styles.sectionMeta}>
            <span>001</span>
            <span className={styles.sectionSlash}>/</span>
            <span>INSTRUCTIONS</span>
          </div>
          <div className={styles.sectionBody}>
            <label className={styles.label}>
              Instructions for the agent
              <textarea
                name="instructions"
                className={styles.textarea}
                placeholder="Example: Tighten the hero, emphasize regulatory requirements, adjust pricing for a mid-market team."
                required
              />
            </label>
            <label className={styles.label}>
              Additional context (optional)
              <textarea
                name="context"
                className={styles.textarea}
                placeholder="Paste extra notes, business goals, or constraints."
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
                placeholder="https://example.com/market-brief"
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
            {status === "submitting" ? "Updating..." : "Update Page"}
          </button>
          <p className={styles.helper}>
            This will overwrite the current sector content for {slug} in Sanity.
          </p>
        </div>

        {status === "success" && result && (
          <div className={styles.result}>
            <span className={styles.resultLabel}>Updated:</span>
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
  );
}
