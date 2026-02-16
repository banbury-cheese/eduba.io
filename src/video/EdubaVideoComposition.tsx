import React, { useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { VideoScene, VideoScript } from "@/lib/videoTypes";
import { VIDEO_FPS } from "@/video/constants";
import { DEFAULT_VIDEO_SCRIPT } from "@/video/defaultScript";
import { EDUBA_THEME } from "@/video/theme/edubaTheme";
import { FlowBaseStyles } from "@/video/viz/FlowBaseStyles";
import { VisualizationRenderer } from "@/video/viz/registry";
import { EDUBA_COLORS } from "@/video/viz/styles";

type SceneFrames = {
  scene: VideoScene;
  frames: number;
};

function normalizeSceneFrames(script: VideoScript, fps: number): SceneFrames[] {
  const scenes = script.scenes.length > 0 ? script.scenes : DEFAULT_VIDEO_SCRIPT.scenes;
  return scenes.map((scene) => ({
    scene,
    frames: Math.max(Math.round((scene.durationSec || 1) * fps), Math.round(1.5 * fps)),
  }));
}

export function getDurationInFrames(script: VideoScript, fps: number = VIDEO_FPS) {
  return normalizeSceneFrames(script, fps).reduce((sum, item) => sum + item.frames, 0);
}

function sectionLabel(type: string) {
  return type.replace(/[-_]/g, " ").toUpperCase();
}

function SceneTitle({ scene }: { scene: VideoScene }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, durationInFrames: Math.round(0.8 * fps) });
  const opacity = interpolate(frame, [0, 10, 55], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - enter) * 18}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: "Diatype, sans-serif",
          fontSize: 78,
          lineHeight: 0.98,
          letterSpacing: "-0.02em",
          color: EDUBA_COLORS.text,
          textWrap: "balance",
          maxWidth: "96%",
        }}
      >
        {scene.headline}
      </h2>
      {scene.subcopy ? (
        <p
          style={{
            margin: 0,
            fontFamily: "Diatype, sans-serif",
            fontSize: 24,
            lineHeight: 1.22,
            color: EDUBA_COLORS.textMuted,
            textWrap: "balance",
            maxWidth: "92%",
          }}
        >
          {scene.subcopy}
        </p>
      ) : null}
    </div>
  );
}

function BulletList({ bullets }: { bullets: string[] }) {
  if (!bullets.length) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
      {bullets.slice(0, 3).map((bullet, index) => (
        <div
          key={`${bullet}-${index}`}
          style={{
            display: "grid",
            gridTemplateColumns: "44px 1fr",
            gap: 14,
            alignItems: "baseline",
            borderTop: `2px dashed ${EDUBA_COLORS.line}`,
            paddingTop: 10,
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: EDUBA_COLORS.text,
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "Diatype, sans-serif",
              fontSize: 24,
              lineHeight: 1.22,
              color: EDUBA_COLORS.textMuted,
            }}
          >
            {bullet}
          </span>
        </div>
      ))}
    </div>
  );
}

function CardGrid({ cards }: { cards: VideoScene["cards"] }) {
  if (!cards.length) {
    return null;
  }

  const safeCards = cards.slice(0, 2);
  const columns = Math.min(safeCards.length, 2);
  return (
    <div
      style={{
        marginTop: 12,
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 12,
      }}
    >
      {safeCards.map((card, index) => (
        <article
          key={`${card.title}-${index}`}
          style={{
            borderRadius: 6,
            background: EDUBA_COLORS.panel,
            overflow: "hidden",
            minHeight: 188,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              fontWeight: 700,
              textTransform: "uppercase",
              padding: "8px 12px",
              borderBottom: `1px dashed ${EDUBA_COLORS.line}`,
              textAlign: "right",
              color: EDUBA_COLORS.text,
            }}
          >
            /{String(index + 1).padStart(3, "0")}
          </div>
          <div style={{ padding: "10px 12px 14px" }}>
            <h3
              style={{
                margin: 0,
                fontFamily: "Diatype, sans-serif",
                fontSize: 34,
                lineHeight: 0.98,
                color: EDUBA_COLORS.text,
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: "Diatype, sans-serif",
                fontSize: 23,
                lineHeight: 1.22,
                color: EDUBA_COLORS.textMuted,
              }}
            >
              {card.text}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function VisualizationPanel({ scene }: { scene: VideoScene }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: Math.max(frame - 4, 0), fps, durationInFrames: Math.round(0.9 * fps) });

  return (
    <div
      style={{
        opacity: interpolate(frame, [0, 10, 60], [0, 0.95, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${(1 - enter) * 18}px)`,
        borderRadius: 10,
        border: `1px dashed ${EDUBA_COLORS.line}`,
        background:
          "linear-gradient(180deg, rgba(249,236,223,0.88) 0%, rgba(254,251,246,0.72) 100%)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: EDUBA_COLORS.text,
            fontWeight: 700,
          }}
        >
          {scene.visualization.title || "Scene visualization"}
        </div>
      </div>
      {scene.visualization.caption ? (
        <p
          style={{
            margin: 0,
            fontFamily: "Diatype, sans-serif",
            fontSize: 19,
            lineHeight: 1.3,
            color: EDUBA_COLORS.textMuted,
            maxWidth: "84%",
          }}
        >
          {scene.visualization.caption}
        </p>
      ) : null}
      <VisualizationRenderer visualization={scene.visualization} />
    </div>
  );
}

function SceneBody({ scene }: { scene: VideoScene }) {
  const textColumn = (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <SceneTitle scene={scene} />
      <BulletList bullets={scene.bullets || []} />
      <CardGrid cards={scene.cards || []} />
    </div>
  );

  const visualizationColumn = <VisualizationPanel scene={scene} />;

  switch (scene.layoutVariant) {
    case "focus":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {textColumn}
          {visualizationColumn}
        </div>
      );
    case "stacked":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {textColumn}
          {visualizationColumn}
        </div>
      );
    case "cards-first":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "0.88fr 1.12fr", gap: 18 }}>
          {visualizationColumn}
          {textColumn}
        </div>
      );
    default:
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18 }}>
          {textColumn}
          {visualizationColumn}
        </div>
      );
  }
}

function SceneLayer({
  scene,
  sceneIndex,
  totalScenes,
}: {
  scene: VideoScene;
  sceneIndex: number;
  totalScenes: number;
}) {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / 150) * Math.PI * 2) * 4;
  const showCta = scene.type === "cta";

  return (
    <AbsoluteFill
      style={{
        background: EDUBA_COLORS.background,
        padding: 46,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% 28%, rgba(162,119,122,0.18), transparent 48%)`,
          transform: `translateY(${drift}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 82% 72%, rgba(107,57,63,0.14), transparent 54%)`,
          transform: `translateY(${-drift * 0.7}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 18,
          right: 0,
          borderTop: `2px dashed ${EDUBA_COLORS.line}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 18,
          right: 0,
          borderBottom: `2px dashed ${EDUBA_COLORS.line}`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "IBM Plex Mono, monospace",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: EDUBA_COLORS.text,
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 15, fontWeight: 700 }}>
            <span>{String(sceneIndex + 1).padStart(3, "0")}</span>
            <span style={{ opacity: 0.5 }}>/</span>
            <span>{sectionLabel(scene.type)}</span>
          </div>
          <div style={{ fontSize: 12, opacity: 0.72 }}>
            {sceneIndex + 1}/{totalScenes}
          </div>
        </div>

        <SceneBody scene={scene} />
      </div>

      {showCta ? (
        <div
          style={{
            marginTop: "auto",
            minHeight: 164,
            borderRadius: 10,
            background: "#4a0a11",
            color: "#fefbf6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            padding: "24px 30px",
            zIndex: 2,
            transform: `translateY(${drift}px)`,
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontSize: 16,
            }}
          >
            LET&apos;S TALK
          </span>
          <span
            style={{
              fontFamily: "Diatype, sans-serif",
              fontWeight: 700,
              fontSize: 45,
              lineHeight: 0.95,
              maxWidth: "72%",
            }}
          >
            {scene.headline}
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

export function EdubaVideoComposition({ script = DEFAULT_VIDEO_SCRIPT }: { script: VideoScript }) {
  const safeScript = script?.scenes?.length ? script : DEFAULT_VIDEO_SCRIPT;
  const sceneFrames = normalizeSceneFrames(safeScript, VIDEO_FPS);

  const positionedScenes = useMemo(
    () =>
      sceneFrames.map(({ scene, frames }, index) => ({
        scene,
        frames,
        index,
        from: sceneFrames.slice(0, index).reduce((total, entry) => total + entry.frames, 0),
      })),
    [sceneFrames]
  );

  return (
    <ThemeProvider theme={EDUBA_THEME}>
      <FlowBaseStyles />
      <AbsoluteFill>
        {positionedScenes.map(({ scene, frames, index, from }) => (
          <Sequence key={`${scene.id}-${index}`} from={from} durationInFrames={frames}>
            <SceneLayer scene={scene} sceneIndex={index} totalScenes={positionedScenes.length} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </ThemeProvider>
  );
}
