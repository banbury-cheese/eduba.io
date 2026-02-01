SYSTEM_PROMPT = """
You are Eduba's AI consulting growth agent. You write sector-specific pages that sell Eduba's AI orchestration offerings.
Your tone is confident, pragmatic, and anti-hype. You avoid fluff, keep language crisp, and focus on measurable outcomes.
Return ONLY valid JSON that matches the schema exactly.
"""

USER_PROMPT_TEMPLATE = """
Company: {company_name}
Target sector: {sector_label}
Custom slug: {slug}

Company context (from chat):
{company_context}

Sources summary:
{sources_summary}

Eduba positioning summary:
- We build working AI pipelines, not decks.
- We teach orchestration patterns and transfer capability/IP to the client.
- We add governance, evaluation harnesses, and human-in-the-loop safety by default.
- We focus on reliable multi-model systems with fallbacks and explainability.

Required JSON schema:
{{
  "slug": "string",
  "title": "string",
  "pageIndex": "string",
  "pageTag": "string",
  "hero": {{
    "title": "string",
    "subtitle": "string",
    "ctaLabel": "string",
    "ctaHref": "string",
    "exploreLabel": "string"
  }},
  "consulting": {{
    "label": "string",
    "title": "string",
    "description": ["string"],
    "cards": [{{"id":"/001","title":"string","body":"string"}}]
  }},
  "whyUs": {{
    "label": "string",
    "title": "string",
    "items": [{{"id":"01","title":"string","description":"string"}}]
  }},
  "services": {{
    "label": "string",
    "title": "string",
    "intro": "string",
    "cards": [{{"id":"/001","title":"string","price":"string","body":"string"}}]
  }},
  "methodology": {{
    "label": "string",
    "title": "string",
    "steps": [{{"id":"01","title":"string","description":"string"}}]
  }},
  "engagement": {{
    "label": "string",
    "title": "string",
    "intro": "string",
    "cards": [{{"id":"/001","title":"string","body":"string"}}]
  }},
  "faq": {{
    "label": "string",
    "title": "string",
    "items": [{{"question":"string","answer":"string"}}]
  }},
  "cta": {{
    "label": "string",
    "title": "string",
    "buttonLabel": "string",
    "buttonHref": "string"
  }}
}}

Rules:
- Include exactly 3 consulting cards, 6 whyUs items, 5 service cards, 6 methodology steps, 3 engagement cards, and 6 FAQ items.
- Keep the copy concise
- IDs must be formatted like /001, /002 or 01, 02 etc.
- Use the provided slug and target sector in labels/titles.
- Return only JSON. No markdown.
"""

EDIT_PROMPT_TEMPLATE = """
You are editing an existing sector page for Eduba.

Target slug: {slug}
Sector label: {sector_label}

Edit instructions:
{instructions}

Company context (from chat):
{company_context}

Sources summary:
{sources_summary}

Current sector JSON:
{existing_json}

Requirements:
- Return the FULL JSON document in the same schema (include all fields).
- Keep the slug unchanged and use the same label structure.
- Preserve the number of items per section.
- Apply edits to improve fit for the company context.
- Return only JSON. No markdown.
"""
