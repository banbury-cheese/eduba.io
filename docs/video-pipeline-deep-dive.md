# Create Video Pipeline Deep Dive

This document explains the current end-to-end video system in this repo: what it does, how requests flow, and what each file is responsible for.

---

## 1) What the current pipeline does

The `/create-video` flow takes company context + sources, generates an 8-scene Eduba-branded sales script, lets you chat-edit revisions, previews the composition in-browser, and renders MP4 + poster.

Key points:

- Branding is fixed to Eduba visual language.
- Content is customized per company/sector/context.
- The script always targets the same 8 section-scene types:
  - `hero`, `consulting`, `why-us`, `services`, `methodology`, `choice`, `faq`, `cta`
- Jobs are persisted as local JSON files in `.video-jobs/`.
- Rendered assets are written to `public/generated-videos/`.

---

## 2) High-level architecture

1. User submits form on `/create-video`.
2. Next API route calls Python CLI (`agent.video_cli generate`) and creates a local `VideoJob`.
3. Edit Studio (`/create-video/{jobId}/edit`) loads job, previews selected revision with Remotion Player.
4. Chat edits call Python CLI (`agent.video_cli edit`) and append revisions.
5. Render route runs `scripts/render-video.mjs`:
   - bundles Remotion composition,
   - optionally generates ElevenLabs scene voiceovers,
   - auto-adjusts scene durations to prevent clipped audio,
   - renders video + poster,
   - returns output URLs + timing report.

---

## 3) Data model (single source of truth)

Defined in `src/lib/videoTypes.ts`.

Main types:

- `VideoBrief`: user inputs and generation options.
- `VideoScript`: the generated/editable script (`meta` + `scenes`).
- `VideoScene`: per-scene copy + duration + layout + diagram + cards/bullets.
- `VideoDiagramSpec`: structured diagram payload used by composition.
- `VideoRevision`: immutable script snapshot per edit.
- `VideoJob`: job container with revisions, selected revision, chat log, status, output URLs.

Why this matters:

- Frontend, API, Python, and renderer all converge on the same JSON shape.
- Strong typing makes revisions and renders deterministic.

---

## 4) Frontend routes and UI

### `src/app/create-video/page.tsx`

Create form for:

- Company, sector, slug
- Website + context
- Custom prompt (`customPrompt`)
- Template, aspect ratio, target duration
- Voiceover on/off
- File uploads + links + exclude patterns
- Site discovery selection (`autoLink`)

Submits multipart form to `POST /api/create-video`.

### `src/app/create-video/[jobId]/edit/page.tsx`

Server component wrapper that loads job and renders `VideoEditStudio`.

### `src/app/create-video/[jobId]/edit/VideoEditStudio.tsx`

Main edit flow:

- Preview pane (selected revision)
- Render action
- Revision history selector
- Chat editing form (instructions + optional new context/sources)
- Manual path discovery from website
- Displays voiceover timing adjustments from render response

### `src/components/video/VideoPreviewPlayer.tsx`

- Uses `@remotion/player` dynamically (client-only).
- Normalizes script first (`normalizeVideoScript`) so incomplete payloads still preview.
- Computes duration from scene durations and current FPS.

---

## 5) Next.js API layer

### `src/app/api/create-video/route.ts` (POST)

Responsibilities:

- Parse form data + uploaded docs.
- Build Python CLI args for `agent.video_cli generate`.
- Read generated JSON script.
- Normalize script and enforce `voiceoverEnabled`.
- Create `VideoJob` in local store.

Returns:

- `jobId`
- `editUrl`
- `statusUrl`

### `src/app/api/create-video/[jobId]/route.ts` (GET)

- Returns full job + selected revision.

### `src/app/api/create-video/[jobId]/chat/route.ts` (POST)

Responsibilities:

- Load selected revision script.
- Accept edit instructions and optional fresh sources.
- Run `agent.video_cli edit`.
- Append user + assistant chat turns.
- Add new revision from edited script.

### `src/app/api/create-video/[jobId]/select-revision/route.ts` (POST)

- Switches active revision by ID.

### `src/app/api/create-video/[jobId]/render/route.ts` (POST)

Responsibilities:

- Normalize selected script.
- Mark job as `rendering`.
- Call `renderVideoScript(...)`.
- If renderer returned an `adjustedScript`, patch selected revision with new durations.
- Persist output URLs and set status `ready`.

### `src/app/api/discover-site/route.ts` (POST)

- Calls `python -m agent.discover_cli --website ...`.
- Returns categorized site URLs for manual selection in UI.

---

## 6) Local persistence and utility layer

### `src/lib/videoJobs.ts`

Local JSON job store in `.video-jobs/`.

Core operations:

- create/load/save/list jobs
- add revision
- set selected revision
- set status and output
- append chat turns
- update an existing revision script (`updateRevisionScript`)

### `src/lib/videoScriptUtils.ts`

`normalizeVideoScript(...)` merges partial/legacy scripts with `DEFAULT_VIDEO_SCRIPT`:

- Guarantees all required scene fields exist.
- Guarantees diagram shape exists.
- Recomputes total duration.

### `src/lib/pythonRunner.ts`

- Small spawn wrapper used by API routes to run Python modules.

### `src/lib/remotionRender.ts`

- Runs `scripts/render-video.mjs` in Node child process.
- Collects stdout/stderr robustly.
- Extracts final JSON payload and returns:
  - `videoUrl`
  - `posterUrl`
  - optional `adjustedScript`
  - optional `timingReport`

---

## 7) Video composition and rendering

### `src/video/defaultScript.ts`

Fallback script with full 8-scene structure and safe defaults for:

- `layoutVariant`
- `illustrationPrompt`
- `diagram`
- `voiceoverScript`
- cards/bullets

### `src/video/constants.ts`

- FPS, dimensions per aspect ratio, helpers for aspect ratio + composition ID.

### `src/video/EdubaVideoComposition.tsx`

This is the actual visual renderer. It:

- Uses scene durations from script.
- Renders one `Sequence` per scene.
- Supports layout variants:
  - `split`, `stacked`, `focus`, `cards-first`
- Supports diagram types:
  - `pipeline`, `timeline`, `comparison`, `matrix`, `cycle`, `faq`, `cards`
- Applies Eduba-style palette/typography and dashed separators.
- Includes scene voiceover text panel for preview context.
- Adds CTA block styling on `cta` scene.

### `src/video/RemotionRoot.tsx` + `src/video/entry.ts`

- Registers compositions for all supported aspect ratios.
- Uses `calculateMetadata` to compute duration from script at render-time.

### `scripts/render-video.mjs`

Render engine responsibilities:

1. Read render input (`jobId`, `revisionId`, `script`).
2. Generate/reuse per-scene ElevenLabs audio (if enabled).
3. Probe actual audio duration with `ffprobe`.
4. Rebalance scene durations so audio does not clip.
5. Bundle Remotion and render silent MP4.
6. Build mixed voiceover track with ffmpeg (trim/pad/fade/delay/amix).
7. Mux video + mixed audio into final MP4.
8. Render JPEG poster frame.
9. Return JSON payload with URLs + adjusted script + timing report.

Output paths:

- MP4/JPG: `public/generated-videos/{jobId}-{revisionShort}.(mp4|jpg)`
- Voiceover cache: `public/generated-videos/voiceovers/voiceover-*.mp3`

---

## 8) Python generation/edit agent

### `agent/video_cli.py`

CLI entry with subcommands:

- `generate` -> produce new script
- `edit` -> edit existing script

Receives files, links, auto-pull config, context, and `custom_prompt`.

### `agent/video_pipeline.py`

Core orchestration:

- `build_sources(...)`: files/links + optional website auto-pull.
- `generate_video_script(...)`: prompt LLM for new script.
- `edit_video_script(...)`: prompt LLM for revision.
- `default_script(...)`: deterministic fallback with required 8 scenes.
- `normalize_script(...)`: enforces schema/ordering/field coercion.

Important behavior:

- Scene order is fixed by section semantics.
- Type-aware normalization tries to align scenes by `type` first.
- Default durations are distributed via section weights.

### `agent/video_prompts.py`

Prompt contracts define:

- Sales-first tone
- Eduba branding constraint
- Required JSON schema
- Required scene order and scene count
- Required per-scene fields (`voiceoverScript`, `layoutVariant`, `diagram`, etc.)

### `agent/ingest.py` + `agent/discovery.py` + `agent/discover_cli.py`

- Parse files (PDF/DOCX/TXT/MD), fetch URL text, clean HTML.
- Discover candidate URLs from sitemap/homepage and categorize into:
  - `about`, `blog`, `press`, `careers`
- Filter URLs with exclude patterns.

### `agent/openai_client.py`

- Calls OpenAI Responses API.
- Extracts text content from response payload.
- Parses JSON and retries once with larger token cap if output looked truncated.

### `agent/config.py`

- Loads `.env.local` + env.
- Provides model and token defaults (`OPENAI_MAX_OUTPUT_TOKENS` default is 5000).

---

## 9) Voiceover timing fix (why audio no longer cuts early)

The abrupt audio cut issue was fixed by moving timing control into render stage:

1. Scene audio is synthesized first.
2. Real audio duration is measured (`ffprobe`).
3. Each scene duration is increased to at least:
   - voiceover duration + buffer, and
   - minimum scene duration threshold.
4. Mixed track uses trim/pad/fade/delay per scene to align to scene boundaries.
5. Updated durations are returned and written back into selected revision.

This means the script evolves to match real TTS durations instead of assuming initial text length estimates.

---

## 10) Current storage model (important before commit/deploy)

Today this feature is filesystem-based:

- Job state: `.video-jobs/*.json`
- Render artifacts: `public/generated-videos/*`

Implications:

- Works well locally.
- Not durable across stateless serverless environments unless these paths are replaced with DB + object storage.

---

## 11) Environment variables used

Video flow relevant vars:

- `PYTHON_BIN` (optional, default `python3`)
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_TEMPERATURE`
- `OPENAI_MAX_OUTPUT_TOKENS`
- `ELEVENLABS_API_KEY` (required if voiceover enabled)
- `ELEVENLABS_VOICE_ID` (optional)
- `ELEVENLABS_MODEL_ID` (optional)
- `VIDEO_MIN_SCENE_SEC` (optional)
- `VIDEO_VOICEOVER_BUFFER_SEC` (optional)
- `VIDEO_VOICEOVER_EDGE_FADE_SEC` (optional)

---

## 12) Quick trace: one request end-to-end

Create:

1. `POST /api/create-video`
2. `agent.video_cli generate`
3. `VideoJob` persisted (`v1`)
4. Open `/create-video/{jobId}/edit`

Edit:

1. `POST /api/create-video/{jobId}/chat`
2. `agent.video_cli edit`
3. New revision `vN` added

Render:

1. `POST /api/create-video/{jobId}/render`
2. `scripts/render-video.mjs` renders + mixes audio
3. Job output URLs s  aved

---

## 13) Suggested pre-commit checks

1. Create a fresh video job and confirm edit page opens.
2. Generate at least one chat revision and switch revisions.
3. Render with voiceover enabled; verify timing report appears.
4. Render with voiceover disabled; ensure silent pipeline still completes.
5. Confirm no stale test assets are unintentionally committed from:
   - `.video-jobs/`
   - `public/generated-videos/`

