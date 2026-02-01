from __future__ import annotations

import re
from dataclasses import dataclass
from typing import List, Optional
from uuid import uuid4

from agent.config import Settings
from agent.ingest import Source, gather_sources, truncate_sources
from agent.openai_client import OpenAIClient
from agent.pricing import apply_price_guardrails
import json

from agent.prompts import EDIT_PROMPT_TEMPLATE, SYSTEM_PROMPT, USER_PROMPT_TEMPLATE
from agent.sanity_client import fetch_sector_by_slug, fetch_sector_slugs, publish_sector


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    return value.strip("-") or "sector"


def with_key(item: dict) -> dict:
    return {"_key": uuid4().hex, **item}


def add_keys(payload: dict) -> dict:
    payload["consulting"]["cards"] = [with_key(card) for card in payload["consulting"]["cards"]]
    payload["whyUs"]["items"] = [with_key(item) for item in payload["whyUs"]["items"]]
    payload["services"]["cards"] = [with_key(card) for card in payload["services"]["cards"]]
    payload["methodology"]["steps"] = [with_key(step) for step in payload["methodology"]["steps"]]
    payload["engagement"]["cards"] = [with_key(card) for card in payload["engagement"]["cards"]]
    payload["faq"]["items"] = [with_key(item) for item in payload["faq"]["items"]]
    return payload


@dataclass
class AgentInput:
    company_name: str
    sector_label: str
    slug: Optional[str]
    context: str
    files: List[str]
    links: List[str]


def build_sources_summary(sources: List[Source]) -> str:
    if not sources:
        return "(no additional sources)"
    blocks = []
    for source in sources:
        snippet = source.content[:1200]
        blocks.append(f"[{source.source_type}] {source.source_id}\n{snippet}")
    return "\n\n".join(blocks)


def generate_sector_payload(agent_input: AgentInput, settings: Settings) -> dict:
    sources = gather_sources(agent_input.files, agent_input.links)
    sources = truncate_sources(sources, max_chars=5000)
    sources_summary = build_sources_summary(sources)

    slug = agent_input.slug or slugify(agent_input.company_name)

    prompt = USER_PROMPT_TEMPLATE.format(
        company_name=agent_input.company_name,
        sector_label=agent_input.sector_label,
        slug=slug,
        company_context=agent_input.context or "(no additional context)",
        sources_summary=sources_summary,
    )

    client = OpenAIClient(
        api_key=settings.openai_api_key,
        model=settings.openai_model,
        temperature=settings.openai_temperature,
        max_output_tokens=settings.max_output_tokens,
    )

    payload = client.generate_json(SYSTEM_PROMPT, prompt)
    payload["slug"] = slug
    payload = apply_price_guardrails(payload)
    payload = add_keys(payload)

    return payload


@dataclass
class EditInput:
    slug: str
    sector_label: str
    instructions: str
    context: str
    files: List[str]
    links: List[str]


def strip_keys(items: list[dict]) -> list[dict]:
    cleaned = []
    for item in items:
        if isinstance(item, dict):
            cleaned.append({k: v for k, v in item.items() if k != "_key"})
        else:
            cleaned.append(item)
    return cleaned


def normalize_existing(payload: dict, slug: str) -> dict:
    payload = dict(payload)
    payload["slug"] = payload.get("slug") or slug
    for section in ("consulting", "services", "engagement"):
        if isinstance(payload.get(section), dict):
            cards = payload[section].get("cards", [])
            payload[section]["cards"] = strip_keys(cards)
    if isinstance(payload.get("whyUs"), dict):
        payload["whyUs"]["items"] = strip_keys(payload["whyUs"].get("items", []))
    if isinstance(payload.get("methodology"), dict):
        payload["methodology"]["steps"] = strip_keys(
            payload["methodology"].get("steps", [])
        )
    if isinstance(payload.get("faq"), dict):
        payload["faq"]["items"] = strip_keys(payload["faq"].get("items", []))
    return payload


def generate_updated_payload(edit_input: EditInput, settings: Settings) -> dict:
    sources = gather_sources(edit_input.files, edit_input.links)
    sources = truncate_sources(sources, max_chars=5000)
    sources_summary = build_sources_summary(sources)

    existing = fetch_sector_by_slug(
        project_id=settings.sanity_project_id,
        dataset=settings.sanity_dataset,
        api_version=settings.sanity_api_version,
        token=settings.sanity_api_token,
        slug=edit_input.slug,
    )
    if not existing:
        raise ValueError(f"Sector not found for slug: {edit_input.slug}")

    normalized = normalize_existing(existing, edit_input.slug)
    sector_label = edit_input.sector_label or normalized.get("title") or "Sector"
    existing_json = json.dumps(normalized, indent=2)

    prompt = EDIT_PROMPT_TEMPLATE.format(
        slug=edit_input.slug,
        sector_label=sector_label,
        instructions=edit_input.instructions,
        company_context=edit_input.context or "(no additional context)",
        sources_summary=sources_summary,
        existing_json=existing_json,
    )

    client = OpenAIClient(
        api_key=settings.openai_api_key,
        model=settings.openai_model,
        temperature=settings.openai_temperature,
        max_output_tokens=settings.max_output_tokens,
    )

    payload = client.generate_json(SYSTEM_PROMPT, prompt)
    payload["slug"] = edit_input.slug
    payload = apply_price_guardrails(payload)
    payload = add_keys(payload)
    return payload


def publish_sector_payload(payload: dict, settings: Settings) -> str:
    slug = payload["slug"]
    slugs = fetch_sector_slugs(
        project_id=settings.sanity_project_id,
        dataset=settings.sanity_dataset,
        api_version=settings.sanity_api_version,
        token=settings.sanity_api_token,
    )
    if slug in slugs:
        page_index = slugs.index(slug) + 1
    else:
        slugs.append(slug)
        page_index = len(slugs)

    payload["pageIndex"] = f"{page_index:03d}"
    doc = {
        "_id": f"sector-{slug}",
        "_type": "sector",
        "title": payload["title"],
        "slug": {"current": slug},
        "pageIndex": payload["pageIndex"],
        "pageTag": payload["pageTag"],
        "hero": payload["hero"],
        "consulting": payload["consulting"],
        "whyUs": payload["whyUs"],
        "services": payload["services"],
        "methodology": payload["methodology"],
        "engagement": payload["engagement"],
        "faq": payload["faq"],
        "cta": payload["cta"],
    }

    publish_sector(
        project_id=settings.sanity_project_id,
        dataset=settings.sanity_dataset,
        api_version=settings.sanity_api_version,
        token=settings.sanity_api_token,
        document=doc,
    )

    return f"{settings.site_url}/sectors/{slug}"
