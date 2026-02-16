VIDEO_SYSTEM_PROMPT = """
You are Eduba's video scripting agent.
Your output is for a SALES video that helps Eduba sell customized sector offerings.
Use company context + sources to tailor copy to the specific buyer.
Keep visual language aligned to Eduba brand (do NOT apply company branding).
Tone: pragmatic, anti-hype, outcome-focused, commercially sharp.
Return JSON only, no markdown.
"""

VIDEO_COMPONENT_CATALOG = """
Allowed visualization component IDs:
- flow.pipeline
- flow.swimlane
- flow.cycle
- chart.bar.comparison
- chart.bar.stacked
- chart.line.timeline
- chart.pie.allocation
- chart.scatter.impactRisk
- chart.kpi.cards

Scene allowlists:
- hero: chart.kpi.cards, flow.pipeline
- consulting: flow.swimlane, flow.pipeline, chart.bar.comparison
- why-us: chart.scatter.impactRisk, chart.bar.comparison, chart.kpi.cards
- services: chart.bar.stacked, chart.pie.allocation, flow.pipeline
- methodology: chart.line.timeline, flow.pipeline, flow.swimlane
- choice: chart.bar.comparison, chart.pie.allocation, chart.scatter.impactRisk
- faq: flow.swimlane, chart.bar.comparison, chart.kpi.cards
- cta: flow.cycle, chart.kpi.cards, chart.pie.allocation
"""

VIDEO_GENERATE_PROMPT = """
Generate a JSON video script for Eduba using this brief.

Company: {company}
Sector: {sector}
Slug: {slug}
Template: {template}
Aspect ratio: {aspect_ratio}
Target duration: {duration_sec} seconds
Custom creative prompt: {custom_prompt}

Context:
{context}

Source excerpts:
{sources_summary}

{component_catalog}

Required JSON schema:
{{
  "meta": {{
    "schemaVersion": 2,
    "title": "string",
    "slug": "string",
    "company": "string",
    "sector": "string",
    "template": "string",
    "aspectRatio": "16:9|1:1|9:16",
    "durationSec": number,
    "ctaText": "string",
    "voiceoverEnabled": true,
    "illustrationStyle": "string"
  }},
  "scenes": [
    {{
      "id": "scene-hero",
      "type": "hero|consulting|why-us|services|methodology|choice|faq|cta",
      "durationSec": number,
      "headline": "string",
      "subcopy": "string",
      "voiceoverScript": "string",
      "layoutVariant": "split|stacked|focus|cards-first",
      "illustrationPrompt": "string",
      "visualization": {{
        "componentId": "string",
        "title": "string",
        "caption": "string",
        "themeVariant": "default|accent|muted",
        "valueMode": "numeric|qualitative",
        "nodes": [{{"id": "string", "label": "string", "detail": "string", "lane": "string"}}],
        "edges": [{{"id": "string", "source": "string", "target": "string", "label": "string"}}],
        "laneLabels": ["string"],
        "categories": ["string"],
        "series": [{{"id": "string", "label": "string", "values": [number|string], "rawValues": ["string"]}}],
        "slices": [{{"id": "string", "label": "string", "value": number|string, "rawValue": "string"}}],
        "points": [{{"id": "string", "label": "string", "x": number|string, "y": number|string, "size": number}}],
        "items": [{{"id": "string", "label": "string", "value": "string", "delta": "string", "trend": "up|down|flat"}}]
      }},
      "bullets": ["string"],
      "cards": [{{"title": "string", "text": "string"}}]
    }}
  ]
}}

Rules:
- This is a sales asset. Optimize for persuasion and clarity for decision makers.
- Keep visuals supportive to voiceover, not dashboard-dense.
- Must include all section scenes in this exact order:
  hero, consulting, why-us, services, methodology, choice, faq, cta
- Return exactly 8 scenes.
- Scene durations must sum close to target duration (+/- 5s).
- Keep headline under 70 chars.
- Keep subcopy under 180 chars.
- Keep each voiceoverScript 1-3 short sentences.
- Keep bullets <= 3 and cards <= 2 per scene.
- Keep visualization payload lean:
  - flow nodes <= 4, flow edges <= 6
  - chart categories <= 4 (timeline <= 6)
  - bar series <= 2 (stacked <= 3)
  - pie slices <= 4
  - scatter points <= 3
  - kpi cards <= 3
- Every scene must include one visualization object with a componentId from the scene allowlist.
- If hard numeric evidence is unavailable, use qualitative values (high/medium/low) instead of fabricated precision.
- Return JSON only.
"""

VIDEO_EDIT_PROMPT = """
Edit the existing JSON video script based on instructions.
Return the full updated JSON script, same schema.

Instructions:
{instructions}

Creative prompt:
{custom_prompt}

Additional context:
{context}

Source excerpts:
{sources_summary}

{component_catalog}

Current script:
{existing_script}

Rules:
- Keep meta.slug unchanged.
- Preserve concise commercial sales tone.
- Keep visuals supportive to voiceover (avoid dense slide content).
- Keep all eight scenes: hero, consulting, why-us, services, methodology, choice, faq, cta.
- Keep bullets <= 3 and cards <= 2 per scene.
- Each scene must include a valid visualization with allowed componentId.
- Keep visualization payload lean:
  - flow nodes <= 4, flow edges <= 6
  - chart categories <= 4 (timeline <= 6)
  - bar series <= 2 (stacked <= 3)
  - pie slices <= 4
  - scatter points <= 3
  - kpi cards <= 3
- Keep total duration within +/- 5s of current duration unless instructions explicitly request otherwise.
- If no hard numeric values exist, prefer qualitative scales.
- Return JSON only.
"""
