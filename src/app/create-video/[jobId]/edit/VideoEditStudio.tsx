"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { VideoPreviewPlayer } from "@/components/video/VideoPreviewPlayer";
import {
  getAllowedVizComponents,
  getVizLabel,
  isVideoVizComponentId,
} from "@/lib/videoVizCatalog";
import type {
  SceneVisualization,
  VideoJob,
  VideoRevision,
  VideoVizComponentId,
} from "@/lib/videoTypes";
import styles from "./page.module.scss";

type StudioStatus = "idle" | "editing" | "rendering" | "overriding";

function getSelectedRevision(job: VideoJob): VideoRevision {
  return (
    job.revisions.find((item) => item.id === job.selectedRevisionId) ??
    job.revisions[job.revisions.length - 1]
  );
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseNumericOrString(value: string) {
  const parsed = Number(value.trim());
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return value.trim();
}

function visualizationToEditorText(visualization: SceneVisualization): string {
  switch (visualization.componentId) {
    case "flow.pipeline":
    case "flow.swimlane":
    case "flow.cycle": {
      const laneLines = (visualization.laneLabels ?? []).map((lane) => `L ${lane}`);
      const nodeLines = visualization.nodes.map(
        (node) =>
          `N ${node.id}|${node.label}|${node.detail || ""}|${node.lane || ""}`
      );
      const edgeLines = visualization.edges.map(
        (edge) => `E ${edge.source}->${edge.target}|${edge.label || ""}`
      );
      return [...laneLines, ...nodeLines, ...edgeLines].join("\n");
    }
    case "chart.bar.comparison":
    case "chart.bar.stacked":
    case "chart.line.timeline": {
      const categories = `C ${visualization.categories.join(", ")}`;
      const seriesLines = visualization.series.map((series) => {
        const values =
          series.rawValues && series.rawValues.length === series.values.length
            ? series.rawValues
            : series.values.map((value) => String(value));
        return `S ${series.label}: ${values.join(", ")}`;
      });
      return [categories, ...seriesLines].join("\n");
    }
    case "chart.pie.allocation":
      return visualization.slices
        .map((slice) => `P ${slice.label}: ${slice.rawValue || slice.value}`)
        .join("\n");
    case "chart.scatter.impactRisk":
      return visualization.points
        .map(
          (point) =>
            `P ${point.label}: ${point.rawX || point.x}, ${point.rawY || point.y}`
        )
        .join("\n");
    case "chart.kpi.cards":
      return visualization.items
        .map(
          (item) =>
            `K ${item.label}|${item.value}|${item.delta || ""}|${item.trend || "flat"}`
        )
        .join("\n");
    default:
      return "";
  }
}

function visualizationHelp(componentId: VideoVizComponentId) {
  switch (componentId) {
    case "flow.pipeline":
    case "flow.swimlane":
    case "flow.cycle":
      return "L lane-name | N id|label|detail|lane | E source->target|label";
    case "chart.bar.comparison":
    case "chart.bar.stacked":
    case "chart.line.timeline":
      return "C category1, category2 | S Series Name: value1, value2";
    case "chart.pie.allocation":
      return "P Slice Label: value";
    case "chart.scatter.impactRisk":
      return "P Point Label: x, y";
    case "chart.kpi.cards":
      return "K KPI Label|Value|Delta|Trend(up/down/flat)";
    default:
      return "Use component-specific lines.";
  }
}

function buildVisualizationPatch(
  current: SceneVisualization,
  componentId: VideoVizComponentId,
  title: string,
  caption: string,
  dataInput: string
): Partial<SceneVisualization> {
  const lines = splitLines(dataInput);
  const currentAny = current as unknown as Record<string, unknown>;

  const basePatch: Record<string, unknown> = {
    componentId,
    title: title.trim() || current.title,
    caption: caption.trim() || current.caption,
    valueMode: current.valueMode,
  };

  switch (componentId) {
    case "flow.pipeline":
    case "flow.swimlane":
    case "flow.cycle": {
      const lanes: string[] = [];
      const nodes: Array<Record<string, unknown>> = [];
      const edges: Array<Record<string, unknown>> = [];

      lines.forEach((line, index) => {
        if (line.startsWith("L ")) {
          const lane = line.slice(2).trim();
          if (lane) lanes.push(lane);
          return;
        }

        if (line.startsWith("N ")) {
          const [id, label, detail, lane] = line.slice(2).split("|");
          nodes.push({
            id: id?.trim() || `node-${index + 1}`,
            label: label?.trim() || `Step ${index + 1}`,
            detail: detail?.trim() || "",
            lane: lane?.trim() || "",
          });
          return;
        }

        if (line.startsWith("E ")) {
          const [pair, edgeLabel] = line.slice(2).split("|");
          const [source, target] = (pair || "").split("->");
          if (!source || !target) {
            return;
          }
          edges.push({
            id: `edge-${index + 1}`,
            source: source.trim(),
            target: target.trim(),
            label: edgeLabel?.trim() || "",
          });
        }
      });

      return {
        ...basePatch,
        nodes: nodes.length > 0 ? nodes : currentAny.nodes,
        edges: edges.length > 0 ? edges : currentAny.edges,
        laneLabels: lanes.length > 0 ? lanes : currentAny.laneLabels,
      } as Partial<SceneVisualization>;
    }

    case "chart.bar.comparison":
    case "chart.bar.stacked":
    case "chart.line.timeline": {
      const categoriesLine = lines.find((line) => line.startsWith("C "));
      const categories =
        categoriesLine
          ?.slice(2)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean) ?? [];

      const seriesLines = lines.filter((line) => line.startsWith("S "));
      const series = seriesLines.map((line, index) => {
        const [labelPart, valuesPart] = line.slice(2).split(":");
        const values = (valuesPart || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map(parseNumericOrString);

        return {
          id: `series-${index + 1}`,
          label: labelPart?.trim() || `Series ${index + 1}`,
          values,
        };
      });

      return {
        ...basePatch,
        categories: categories.length > 0 ? categories : currentAny.categories,
        series: series.length > 0 ? series : currentAny.series,
      } as Partial<SceneVisualization>;
    }

    case "chart.pie.allocation": {
      const slices = lines
        .filter((line) => line.startsWith("P "))
        .map((line, index) => {
          const [label, value] = line.slice(2).split(":");
          return {
            id: `slice-${index + 1}`,
            label: label?.trim() || `Slice ${index + 1}`,
            value: parseNumericOrString(value?.trim() || "0"),
          };
        });

      return {
        ...basePatch,
        slices: slices.length > 0 ? slices : currentAny.slices,
      } as Partial<SceneVisualization>;
    }

    case "chart.scatter.impactRisk": {
      const points = lines
        .filter((line) => line.startsWith("P "))
        .map((line, index) => {
          const [labelPart, valuesPart] = line.slice(2).split(":");
          const [x, y] = (valuesPart || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);

          return {
            id: `point-${index + 1}`,
            label: labelPart?.trim() || `Point ${index + 1}`,
            x: parseNumericOrString(x || "3"),
            y: parseNumericOrString(y || "3"),
          };
        });

      return {
        ...basePatch,
        points: points.length > 0 ? points : currentAny.points,
      } as Partial<SceneVisualization>;
    }

    case "chart.kpi.cards": {
      const items = lines
        .filter((line) => line.startsWith("K "))
        .map((line, index) => {
          const [label, value, delta, trend] = line.slice(2).split("|");
          return {
            id: `kpi-${index + 1}`,
            label: label?.trim() || `KPI ${index + 1}`,
            value: value?.trim() || "N/A",
            delta: delta?.trim() || "",
            trend:
              trend?.trim() === "up" ||
              trend?.trim() === "down" ||
              trend?.trim() === "flat"
                ? trend.trim()
                : "flat",
          };
        });

      return {
        ...basePatch,
        items: items.length > 0 ? items : currentAny.items,
      } as Partial<SceneVisualization>;
    }

    default:
      return basePatch as Partial<SceneVisualization>;
  }
}

export function VideoEditStudio({ initialJob }: { initialJob: VideoJob }) {
  const [job, setJob] = useState<VideoJob>(initialJob);
  const [status, setStatus] = useState<StudioStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [timingReport, setTimingReport] = useState<
    Array<{
      sceneId: string;
      previousSec: number;
      adjustedSec: number;
      voiceoverSec: number;
    }>
  >([]);

  const [website, setWebsite] = useState(initialJob.brief.website || "");
  const [customPrompt, setCustomPrompt] = useState(
    initialJob.brief.customPrompt || ""
  );
  const [discovering, setDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<Record<string, string[]>>({});
  const [selectedPaths, setSelectedPaths] = useState<Record<string, boolean>>({});

  const selectedRevision = useMemo(() => getSelectedRevision(job), [job]);

  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    selectedRevision.script.scenes[0]?.id || ""
  );
  const selectedScene = useMemo(
    () =>
      selectedRevision.script.scenes.find((scene) => scene.id === selectedSceneId) ||
      selectedRevision.script.scenes[0],
    [selectedRevision, selectedSceneId]
  );

  const [overrideHeadline, setOverrideHeadline] = useState("");
  const [overrideSubcopy, setOverrideSubcopy] = useState("");
  const [overrideTitle, setOverrideTitle] = useState("");
  const [overrideCaption, setOverrideCaption] = useState("");
  const [overrideComponentId, setOverrideComponentId] =
    useState<VideoVizComponentId>("chart.kpi.cards");
  const [overrideData, setOverrideData] = useState("");

  useEffect(() => {
    if (!selectedScene && selectedRevision.script.scenes.length > 0) {
      setSelectedSceneId(selectedRevision.script.scenes[0].id);
    }
  }, [selectedScene, selectedRevision]);

  useEffect(() => {
    if (!selectedScene) {
      return;
    }

    setOverrideHeadline(selectedScene.headline);
    setOverrideSubcopy(selectedScene.subcopy);
    setOverrideTitle(selectedScene.visualization.title);
    setOverrideCaption(selectedScene.visualization.caption);
    setOverrideComponentId(selectedScene.visualization.componentId);
    setOverrideData(visualizationToEditorText(selectedScene.visualization));
  }, [selectedScene, selectedRevision.id]);

  const refreshJob = useCallback(async () => {
    const response = await fetch(`/api/create-video/${job.id}`, { method: "GET" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.details || "Unable to refresh job");
    }
    setJob(data.job as VideoJob);
  }, [job.id]);

  useEffect(() => {
    if (job.status !== "rendering") {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        await refreshJob();
      } catch {
        window.clearInterval(timer);
      }
    }, 3500);

    return () => window.clearInterval(timer);
  }, [job.id, job.status, refreshJob]);

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
        setDiscoveryError(data.error || "Failed to discover site paths");
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

  const handleSelectRevision = async (revisionId: string) => {
    if (revisionId === job.selectedRevisionId) return;

    setError(null);
    try {
      const response = await fetch(`/api/create-video/${job.id}/select-revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to select revision");
      }
      setJob(data.job as VideoJob);
      setTimingReport(data.timingReport ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected selection error");
    }
  };

  const handleChatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("editing");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    Object.entries(selectedPaths).forEach(([url, selected]) => {
      if (selected) {
        formData.append("autoLink", url);
      }
    });

    try {
      const response = await fetch(`/api/create-video/${job.id}/chat`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Unable to edit script");
      }

      setJob(data.job as VideoJob);
      form.reset();
      setSelectedPaths({});
      setDiscovered({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected edit error");
    } finally {
      setStatus("idle");
    }
  };

  const handleRender = async () => {
    setStatus("rendering");
    setError(null);

    try {
      const response = await fetch(`/api/create-video/${job.id}/render`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Unable to render video");
      }

      setJob(data.job as VideoJob);
      setTimingReport(data.timingReport ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected render error");
    } finally {
      setStatus("idle");
    }
  };

  const handleApplyOverride = async () => {
    if (!selectedScene || !isVideoVizComponentId(overrideComponentId)) {
      return;
    }

    setStatus("overriding");
    setError(null);

    try {
      const visualizationPatch = buildVisualizationPatch(
        selectedScene.visualization,
        overrideComponentId,
        overrideTitle,
        overrideCaption,
        overrideData
      );

      const response = await fetch(
        `/api/create-video/${job.id}/scene-overrides`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revisionId: selectedRevision.id,
            sceneId: selectedScene.id,
            headline: overrideHeadline,
            subcopy: overrideSubcopy,
            visualization: visualizationPatch,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || "Unable to apply override");
      }

      setJob(data.job as VideoJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected override error");
    } finally {
      setStatus("idle");
    }
  };

  const allowedComponents = selectedScene
    ? getAllowedVizComponents(selectedScene.type)
    : [];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.kicker}>CREATE VIDEO / EDIT STUDIO</div>
        <h1 className={styles.title}>{selectedRevision.script.meta.title}</h1>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>job {job.id.slice(0, 8)}</span>
          <span className={styles.metaItem}>{job.brief.company}</span>
          <span className={styles.metaItem}>{job.brief.sector}</span>
          <span className={styles.metaItem}>
            schema v{selectedRevision.script.meta.schemaVersion}
          </span>
          <span className={styles.statusPill} data-status={job.status}>
            {job.status}
          </span>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.previewPane}>
          <div className={styles.previewHead}>
            <div>
              <h2 className={styles.sectionTitle}>Composition preview</h2>
              <p className={styles.sectionText}>
                Review selected revision before render. Switch revisions at any time.
              </p>
            </div>
            <button
              type="button"
              className={styles.renderButton}
              onClick={handleRender}
              disabled={status !== "idle" || job.status === "rendering"}
            >
              {status === "rendering" || job.status === "rendering"
                ? "Rendering..."
                : "Render selected revision"}
            </button>
          </div>

          <div className={styles.playerWrap}>
            <VideoPreviewPlayer script={selectedRevision.script} />
          </div>

          {job.output?.videoUrl ? (
            <div className={styles.renderResult}>
              <div className={styles.resultMeta}>Last render output</div>
              <video
                className={styles.resultVideo}
                src={job.output.videoUrl}
                poster={job.output.posterUrl}
                controls
              />
              <div className={styles.resultLinks}>
                <a href={job.output.videoUrl} target="_blank" rel="noreferrer">
                  Open MP4
                </a>
                {job.output.posterUrl ? (
                  <a href={job.output.posterUrl} target="_blank" rel="noreferrer">
                    Open poster
                  </a>
                ) : null}
              </div>
              {timingReport.length > 0 ? (
                <div className={styles.timingPanel}>
                  <div className={styles.resultMeta}>Voiceover timing adjustments</div>
                  {timingReport.map((item) => (
                    <div key={item.sceneId} className={styles.timingRow}>
                      <span>{item.sceneId}</span>
                      <span>
                        {`${item.previousSec.toFixed(1)}s -> ${item.adjustedSec.toFixed(
                          1
                        )}s`}
                      </span>
                      <span>VO {item.voiceoverSec.toFixed(1)}s</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={styles.revisionPanel}>
            <div className={styles.revisionTitle}>Revisions</div>
            <div className={styles.revisionList}>
              {[...job.revisions]
                .sort((a, b) => b.version - a.version)
                .map((revision) => {
                  const active = revision.id === job.selectedRevisionId;
                  return (
                    <button
                      type="button"
                      key={revision.id}
                      className={`${styles.revisionButton} ${active ? styles.revisionActive : ""}`}
                      onClick={() => handleSelectRevision(revision.id)}
                    >
                      <span>v{revision.version}</span>
                      <span>{new Date(revision.createdAt).toLocaleString()}</span>
                      <span>{revision.notes}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </section>

        <aside className={styles.chatPane}>
          <div className={styles.chatHeader}>
            <h2 className={styles.sectionTitle}>Prompt edits</h2>
            <p className={styles.sectionText}>
              Request changes, attach context, and generate a new revision.
            </p>
          </div>

          <div className={styles.chatLog}>
            {job.chat.length === 0 ? (
              <div className={styles.emptyLog}>No edits yet.</div>
            ) : (
              job.chat.map((turn) => (
                <div
                  key={turn.id}
                  className={`${styles.chatTurn} ${
                    turn.role === "assistant" ? styles.assistantTurn : styles.userTurn
                  }`}
                >
                  <div className={styles.chatRole}>{turn.role}</div>
                  <p>{turn.message}</p>
                </div>
              ))
            )}
          </div>

          <form className={styles.chatForm} onSubmit={handleChatSubmit}>
            <label className={styles.label}>
              Instructions
              <textarea
                name="instructions"
                className={styles.textarea}
                placeholder="Example: tighten scene 1 copy, increase pricing confidence, add two concrete proof bullets."
                required
              />
            </label>

            <label className={styles.label}>
              Additional context
              <textarea
                name="context"
                className={styles.textarea}
                placeholder="Constraints, compliance concerns, sales objections, and preferred tone."
              />
            </label>

            <label className={styles.label}>
              Bespoke direction
              <textarea
                name="customPrompt"
                className={styles.textarea}
                value={customPrompt}
                onChange={(event) => setCustomPrompt(event.target.value)}
                placeholder="Optional: scene-level motion, tone, and visual direction constraints."
              />
            </label>

            <label className={styles.label}>
              Website for auto-pull (optional)
              <input
                name="website"
                className={styles.input}
                placeholder="https://company.com"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </label>

            <div className={styles.discoveryRow}>
              <span className={styles.discoveryLabel}>Manual path pull</span>
              <button
                type="button"
                className={styles.discoverButton}
                onClick={handleDiscover}
                disabled={!website || discovering}
              >
                {discovering ? "Discovering..." : "Discover paths"}
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
                placeholder="https://example.com/research"
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={status !== "idle"}
            >
              {status === "editing" ? "Generating revision..." : "Create revision"}
            </button>
          </form>

          <div className={styles.overridePanel}>
            <div className={styles.revisionTitle}>Scene visual override</div>

            <label className={styles.label}>
              Scene
              <select
                className={styles.input}
                value={selectedScene?.id || ""}
                onChange={(event) => setSelectedSceneId(event.target.value)}
              >
                {selectedRevision.script.scenes.map((scene) => (
                  <option key={scene.id} value={scene.id}>
                    {scene.type} / {scene.id}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Component
              <select
                className={styles.input}
                value={overrideComponentId}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isVideoVizComponentId(next)) {
                    setOverrideComponentId(next);
                  }
                }}
              >
                {allowedComponents.map((componentId) => (
                  <option key={componentId} value={componentId}>
                    {getVizLabel(componentId)}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Headline
              <input
                className={styles.input}
                value={overrideHeadline}
                onChange={(event) => setOverrideHeadline(event.target.value)}
              />
            </label>

            <label className={styles.label}>
              Subcopy
              <textarea
                className={styles.textarea}
                value={overrideSubcopy}
                onChange={(event) => setOverrideSubcopy(event.target.value)}
              />
            </label>

            <label className={styles.label}>
              Visualization title
              <input
                className={styles.input}
                value={overrideTitle}
                onChange={(event) => setOverrideTitle(event.target.value)}
              />
            </label>

            <label className={styles.label}>
              Visualization caption
              <textarea
                className={styles.textarea}
                value={overrideCaption}
                onChange={(event) => setOverrideCaption(event.target.value)}
              />
            </label>

            <label className={styles.label}>
              Visualization data
              <textarea
                className={styles.textarea}
                value={overrideData}
                onChange={(event) => setOverrideData(event.target.value)}
                placeholder={visualizationHelp(overrideComponentId)}
              />
            </label>

            <div className={styles.overrideHint}>
              {visualizationHelp(overrideComponentId)}
            </div>

            <button
              type="button"
              className={styles.submitButton}
              onClick={handleApplyOverride}
              disabled={status !== "idle" || !selectedScene}
            >
              {status === "overriding" ? "Applying override..." : "Apply override"}
            </button>
          </div>
        </aside>
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}
