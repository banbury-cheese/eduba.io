# Create Video Workflow

## Routes

- `GET /create-video` - start a new video job.
- `GET /create-video/{jobId}/edit` - edit studio with preview, revision history, and prompt chat.
- `POST /api/create-video` - create draft script via `agent.video_cli generate`.
- `GET /api/create-video/{jobId}` - fetch job state and selected revision.
- `POST /api/create-video/{jobId}/chat` - apply prompt edits via `agent.video_cli edit`.
- `POST /api/create-video/{jobId}/select-revision` - switch active revision.
- `POST /api/create-video/{jobId}/render` - render selected revision to MP4 + poster.

## Data flow

1. User submits create form with context, links, docs, and optional discovered paths.
2. API invokes Python video generator and stores job JSON in `.video-jobs/{jobId}.json`.
3. Script always includes all sector sections (`hero`, `consulting`, `why-us`, `services`, `methodology`, `choice`, `faq`, `cta`) with per-scene voiceover, layout variant, and diagram spec.
4. Edit studio previews script in Remotion Player using fixed Eduba branding and scene-specific animated diagrams.
5. Chat edits produce new script revisions and append chat transcript.
6. Render route launches `scripts/render-video.mjs`, synthesizes scene voiceovers with ElevenLabs, auto-adjusts scene durations to prevent clipping, mixes final audio, and writes media to `public/generated-videos/`.

## Environment

- `ELEVENLABS_API_KEY` (required when voiceover is enabled)
- `ELEVENLABS_VOICE_ID` (optional, defaults to a stock voice)
- `ELEVENLABS_MODEL_ID` (optional, defaults to `eleven_multilingual_v2`)

## Key files

- `src/app/create-video/page.tsx`
- `src/app/create-video/[jobId]/edit/VideoEditStudio.tsx`
- `src/app/api/create-video/*`
- `src/lib/videoJobs.ts`
- `src/lib/videoTypes.ts`
- `src/lib/remotionRender.ts`
- `src/video/*`
- `scripts/render-video.mjs`
- `agent/video_pipeline.py`
- `agent/video_cli.py`
