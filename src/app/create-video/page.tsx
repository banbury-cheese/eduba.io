"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import styles from "./page.module.scss";

type Status = "idle" | "submitting" | "success" | "error";

export default function CreateVideoPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ editUrl: string; jobId: string } | null>(
    null
  );

  const [website, setWebsite] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<Record<string, string[]>>({});
  const [selectedPaths, setSelectedPaths] = useState<Record<string, boolean>>({});

  const handleDiscover = async () => {
    if (!website) return;
    setDiscovering(true);
    setDiscoveryError(null);

    try {
      const response = await fetch("/api/discover-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website }),
      });
      const data = await response.json();

      if (!response.ok) {
        setDiscoveryError(data.error || "Failed to discover site paths.");
        return;
      }

      setDiscovered(data.categories || {});
      setSelectedPaths({});
    } catch (err) {
      setDiscoveryError(
        err instanceof Error ? err.message : "Unexpected discovery error"
      );
    } finally {
      setDiscovering(false);
    }
  };

  const togglePath = (url: string) => {
    setSelectedPaths((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    Object.entries(selectedPaths).forEach(([url, selected]) => {
      if (selected) {
        formData.append("autoLink", url);
      }
    });

    try {
      const response = await fetch("/api/create-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Failed to create video job");
        return;
      }

      setStatus("success");
      setResult({ editUrl: data.editUrl, jobId: data.jobId });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.kicker}>CREATE VIDEO</div>
          <h1 className={styles.title}>Build a branded video from context</h1>
          <p className={styles.subtitle}>
            Same inputs as create-page, but this flow creates an editable Remotion
            composition before render. Visual branding stays Eduba; content and
            diagrams adapt per company context.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.section}>
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
                  placeholder="Armetor"
                  required
                />
              </label>

              <label className={styles.label}>
                Company website (optional)
                <input
                  name="website"
                  className={styles.input}
                  placeholder="https://armetor.com"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </label>

              <div className={styles.row}>
                <label className={styles.label}>
                  Sector label
                  <input
                    name="sector"
                    className={styles.input}
                    placeholder="Mining"
                    required
                  />
                </label>

                <label className={styles.label}>
                  Custom slug (optional)
                  <input
                    name="slug"
                    className={styles.input}
                    placeholder="armetor-mining"
                  />
                </label>
              </div>

              <div className={styles.rowTight}>
                <label className={styles.label}>
                  Template
                  <input
                    name="template"
                    className={styles.input}
                    defaultValue="eduba-core-v1"
                  />
                </label>

                <label className={styles.label}>
                  Aspect ratio
                  <select name="aspectRatio" className={styles.input} defaultValue="16:9">
                    <option value="16:9">16:9</option>
                    <option value="1:1">1:1</option>
                    <option value="9:16">9:16</option>
                  </select>
                </label>

                <label className={styles.label}>
                  Target duration (sec)
                  <input
                    name="durationSec"
                    className={styles.input}
                    type="number"
                    min={20}
                    max={120}
                    defaultValue={45}
                  />
                </label>
              </div>

              <label className={styles.checkboxItem}>
                <input name="voiceoverEnabled" type="checkbox" defaultChecked />
                <span>Enable ElevenLabs voiceover render</span>
              </label>

              <label className={styles.label}>
                Context brief
                <textarea
                  name="context"
                  className={styles.textarea}
                  placeholder="Who this is for, what outcomes matter, what constraints exist."
                />
              </label>

              <label className={styles.label}>
                Bespoke direction (optional)
                <textarea
                  name="customPrompt"
                  className={styles.textarea}
                  placeholder="Example: Use stronger contrast in methodology visuals, emphasize ROI proof in why-us, and use boardroom-grade language."
                />
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionMeta}>
              <span>002</span>
              <span className={styles.sectionSlash}>/</span>
              <span>SOURCES</span>
            </div>

            <div className={styles.sectionBody}>
              <div className={styles.discoveryRow}>
                <span className={styles.discoveryLabel}>Auto-pull discovery</span>
                <button
                  type="button"
                  className={styles.discoverButton}
                  onClick={handleDiscover}
                  disabled={!website || discovering}
                >
                  {discovering ? "Discovering..." : "Discover Paths"}
                </button>
              </div>

              {discoveryError ? (
                <div className={styles.discoveryError}>{discoveryError}</div>
              ) : null}

              {Object.keys(discovered).length > 0 ? (
                <div className={styles.discoveryGrid}>
                  {Object.entries(discovered).map(([category, urls]) => (
                    <div key={category} className={styles.discoveryGroup}>
                      <div className={styles.discoveryTitle}>{category}</div>
                      {urls.length === 0 ? (
                        <div className={styles.discoveryEmpty}>No links found.</div>
                      ) : null}
                      {urls.map((url) => (
                        <label key={url} className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            checked={Boolean(selectedPaths[url])}
                            onChange={() => togglePath(url)}
                          />
                          <span>{url}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}

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

              <label className={styles.label}>
                Exclude URLs or keywords (one per line)
                <textarea
                  name="exclude"
                  className={styles.textarea}
                  placeholder={`careers\npress\nhttps://example.com/old-post`}
                />
              </label>
            </div>
          </section>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Generating..." : "Create Video Job"}
            </button>
            <p className={styles.helper}>
              You will land in the edit studio to preview, chat-edit, and render.
            </p>
          </div>

          {status === "success" && result ? (
            <div className={styles.result}>
              <div>Job ready: {result.jobId}</div>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => router.push(result.editUrl)}
              >
                Open edit studio
              </button>
            </div>
          ) : null}

          {status === "error" && error ? (
            <div className={styles.error}>{error}</div>
          ) : null}
        </form>
      </div>
    </Layout>
  );
}
