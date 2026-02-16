# Create-Video Page Implementation Plan (Remotion, Modular)

## Goal
Build `/create-video` with a workflow similar to `/create-page`:
- Accept company context + optional docs/links.
- Study the eduba branding and produce a video in the same style (instead of a sector page JSON doc).
- Keep architecture modular so generation, editing, rendering, storage, and publishing can evolve independently.

---

## 1) Scope (MVP vs Phase 2)

### MVP
- New page: `/create-video`.
- Inputs:
  - Company name
  - Sector label
  - Optional slug
  - Context/instructions
  - Optional docs + links
- Output:
  - Rendered MP4 URL
  - Thumbnail URL
  - Optional Sanity record (`videoAsset` or `sectorVideo` doc)
- Edit flow:
  - Visual composition preview before render
  - Chat/prompt box to request modifications
  - Diff/revision history of script edits
- One template style aligned to current site branding.
- One aspect ratio initially (16:9).

### Phase 2
- Multiple templates and aspect ratios (1:1, 9:16).
- Voiceover (TTS + subtitle burn-in).
- Scene-level manual edit before render.
- Version history + regenerate button.

---

## 2) Key Constraints and Architecture Choice

Rendering video is compute-heavy. Keep rendering isolated from frontend.

### Recommended deployment split
1. **Next.js app (existing)**
   - Hosts `/create-video` UI and job status pages.
   - Submits jobs to a render service.
2. **Render worker service (Node + Remotion)**
   - Responsible for composition + render + upload.
3. **Sanity (existing)**
   - Stores metadata, prompt inputs, render outputs, and links.
4. **Blob storage (S3/R2/GCS)**
   - Stores MP4 + poster image + optional JSON artifacts.

This avoids tight coupling to serverless runtime limits.

---

## 3) Modular System Design

## Modules

### A) Intake Module
**Responsibility:** Normalize user inputs and source files.
- Reuse existing ingestion patterns from `agent/ingest.py`.
- Produces canonical `VideoBrief` object.

### B) Content Synthesis Module (LLM)
**Responsibility:** Convert brief into structured video script JSON.
- Input: `VideoBrief + extracted context`.
- Output: `VideoScript` (scenes, durations, captions, CTA, palette).
- Keep model/provider config in one place.

### C) Validation Module
**Responsibility:** Enforce schema and guardrails before render.
- Checks scene count, duration, character limits, brand-safe fields.
- Fails fast with actionable errors.

### D) Composition Module (Remotion)
**Responsibility:** Map `VideoScript` to visual components.
- Pure render logic; no API logic.
- Includes reusable scene components and brand tokens.

### E) Render Orchestration Module
**Responsibility:** Queue, run, retry, and monitor render jobs.
- States: `queued -> processing -> rendered -> uploaded -> published`.
- Supports idempotency via `jobId`.

### F) Storage/Publish Module
**Responsibility:** Upload assets and persist references.
- Upload MP4 + poster.
- Upsert Sanity metadata doc.

### G) Frontend Orchestration Module
**Responsibility:** UI for submit, progress, and result.
- Progress polling or websocket updates.
- Presents video preview + final links.

### H) Edit Studio Module
**Responsibility:** Let users iterate before rendering.
- Scene list + per-scene preview frame scrubber.
- Chat assistant that applies edits to `VideoScript`.
- Revision control (`v1`, `v2`, `v3`) and rollback.
- Manual controls for scene duration, text, order, and CTA.

---

## 4) Data Contracts (Core)

## 4.1 `VideoBrief` (input contract)
```json
{
  "company": "Armetor",
  "sector": "Mining",
  "slug": "armetor-mining",
  "context": "...",
  "links": ["https://..."],
  "docRefs": ["tmp/file1.pdf"],
  "videoOptions": {
    "template": "eduba-core-v1",
    "aspectRatio": "16:9",
    "durationTargetSec": 45,
    "voiceover": false
  }
}
```

## 4.2 `VideoScript` (LLM output contract)
```json
{
  "title": "...",
  "template": "eduba-core-v1",
  "globalStyle": {
    "theme": "eduba-classic",
    "ctaText": "LET'S TALK"
  },
  "scenes": [
    {
      "id": "hero",
      "durationSec": 6,
      "layout": "hero",
      "headline": "...",
      "subcopy": "..."
    }
  ]
}
```

## 4.3 `RenderJob`
```json
{
  "jobId": "uuid",
  "status": "processing",
  "input": {"...": "VideoBrief"},
  "script": {"...": "VideoScript"},
  "outputs": {
    "videoUrl": null,
    "posterUrl": null
  },
  "error": null
}
```

## 4.4 `VideoRevision`
```json
{
  "revisionId": "uuid",
  "jobId": "uuid",
  "version": 3,
  "script": {"...": "VideoScript"},
  "notes": "Made tone sharper and reduced scene 2 duration",
  "createdBy": "user|assistant",
  "createdAt": "2026-02-07T12:00:00Z"
}
```

## 4.5 `ChatTurn`
```json
{
  "turnId": "uuid",
  "jobId": "uuid",
  "role": "user|assistant",
  "message": "Make the CTA stronger and shorten intro scene",
  "appliedRevisionId": "uuid",
  "createdAt": "2026-02-07T12:00:00Z"
}
```

---

## 5) Remotion Composition Plan

## Composition layout
- `RootComposition` reads `VideoScript`.
- Scene registry:
  - `HeroScene`
  - `ProofPointsScene`
  - `ServicesScene`
  - `MethodologyScene`
  - `CTAScene`
- Shared brand primitives:
  - colors from current palette
  - mono + primary typography
  - dashed separators
  - card patterns matching sector pages

## Style tokens
Centralize in one file (example):
- `video/theme/tokens.ts`
- `video/theme/typography.ts`
- `video/theme/motion.ts`

This keeps visuals consistent and easy to evolve.

---

## 6) API and Routing Plan

### New frontend routes
- `/create-video` (new submit page)
- `/create-video/[jobId]` (status + result)
- `/create-video/[jobId]/edit` (composition preview + chat edit studio)

### Next API routes
- `POST /api/create-video` -> create job
- `GET /api/create-video/:jobId` -> get status
- `GET /api/create-video/:jobId/script` -> latest script + revisions
- `POST /api/create-video/:jobId/chat` -> apply chat instruction, produce new revision
- `POST /api/create-video/:jobId/revision/:revisionId/render` -> render selected revision
- `POST /api/create-video/:jobId/revision/:revisionId/publish` -> publish rendered asset

### Worker endpoints (if separate service)
- `POST /render/video-job`
- `GET /render/video-job/:jobId`

---

## 7) Sanity Content Model Plan

Create a `sectorVideo` document:
- `slug` (related sector/company slug)
- `company`
- `sector`
- `brief` (input snapshot)
- `script` (JSON)
- `revisions` (array of script revisions)
- `chatTranscript` (array of chat turns)
- `selectedRevisionId`
- `status`
- `videoUrl`
- `posterUrl`
- `createdAt`
- `updatedAt`

Optionally link `sectorVideo` back to `sector` doc for easy retrieval.

---

## 8) Step-by-step Implementation Milestones

### Milestone 1: Contracts + non-render skeleton
- Define JSON schemas for `VideoBrief`, `VideoScript`, `RenderJob`.
- Build `/create-video` UI form (reuse create-page style).
- Build API job creation/status endpoints.

### Milestone 2: Script generation
- Add LLM prompt templates for video script generation.
- Reuse ingestion and optional auto-pull context.
- Validate output contract.

### Milestone 3: Edit studio (pre-render)
- Build `/create-video/[jobId]/edit`.
- Add composition preview panel using Remotion player (JSON-driven).
- Add chat panel to request modifications.
- Save each assistant update as `VideoRevision`.

### Milestone 4: Remotion MVP render
- Setup Remotion project under a dedicated module (e.g. `/video-engine`).
- Build one branded composition.
- Render local MP4 from `VideoScript`.

### Milestone 5: Worker + storage
- Add queue + worker execution.
- Upload artifacts to storage.
- Persist metadata in Sanity.

### Milestone 6: UX completion
- Show live progress on `/create-video/[jobId]`.
- Result preview + copy/share link.
- Retry failed jobs.
- Re-render from any previous revision.

---

## 9) Testing Strategy

- **Schema tests**: reject invalid script payloads.
- **Revision tests**: ensure chat edits generate valid `VideoRevision`.
- **Prompt regression tests**: golden `VideoScript` fixtures.
- **Render smoke test**: one fixture renders successfully.
- **E2E test**: submit brief -> job completes -> URL available.
- **Edit E2E**: create job -> chat edit -> render selected revision -> publish.
- **Visual QA**: snapshot key frames for template drift detection.

---

## 10) Operational Considerations

- Render timeout + retries.
- Concurrency caps to avoid resource exhaustion.
- Observability:
  - request id/job id correlation
  - per-stage duration metrics
  - structured error logs.
- Cache repeated assets/fonts.

---

## 11) Decisions to lock before build

1. Render infrastructure: dedicated worker vs in-process render.
2. Video storage: Sanity assets vs S3/R2.
3. MVP duration + aspect ratio defaults.
4. Voiceover in MVP (yes/no).
5. Whether `/create-video` should also auto-generate from existing sector doc by slug.
6. Whether chat edits should be auto-applied or require user acceptance per turn.

---

## 12) Suggested Directory Structure (modular)

```text
src/
  app/
    create-video/
      page.tsx
      page.module.scss
    create-video/[jobId]/
      page.tsx
    create-video/[jobId]/edit/
      page.tsx
      page.module.scss
    api/create-video/
      route.ts
    api/create-video/[jobId]/
      route.ts
    api/create-video/[jobId]/chat/
      route.ts
    api/create-video/[jobId]/script/
      route.ts

video-engine/
  compositions/
  components/
  theme/
  schemas/
  renderer/

agent/
  video_prompts.py
  video_pipeline.py
  video_edit_pipeline.py
  video_contracts.py
```

This structure keeps UI, orchestration, and rendering decoupled.
