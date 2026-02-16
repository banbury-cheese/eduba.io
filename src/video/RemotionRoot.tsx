import React from "react";
import { Composition } from "remotion";
import type { VideoScript } from "../lib/videoTypes";
import { EdubaVideoComposition, getDurationInFrames } from "./EdubaVideoComposition";
import { VIDEO_DIMENSIONS, VIDEO_FPS, toCompositionId } from "./constants";
import { DEFAULT_VIDEO_SCRIPT } from "./defaultScript";

const ASPECT_RATIOS = ["16:9", "1:1", "9:16"] as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {ASPECT_RATIOS.map((aspectRatio) => {
        const dimensions = VIDEO_DIMENSIONS[aspectRatio];
        return (
          <Composition
            key={aspectRatio}
            id={toCompositionId(aspectRatio)}
            component={EdubaVideoComposition}
            fps={VIDEO_FPS}
            width={dimensions.width}
            height={dimensions.height}
            durationInFrames={getDurationInFrames(DEFAULT_VIDEO_SCRIPT, VIDEO_FPS)}
            defaultProps={{ script: DEFAULT_VIDEO_SCRIPT }}
            calculateMetadata={({ props }) => {
              const script =
                (props as { script?: VideoScript } | undefined)?.script ??
                DEFAULT_VIDEO_SCRIPT;
              return {
                durationInFrames: getDurationInFrames(script, VIDEO_FPS),
              };
            }}
          />
        );
      })}
    </>
  );
};
