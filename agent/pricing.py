from __future__ import annotations

from typing import Dict

PRICE_GUARDRAILS: Dict[str, str] = {
    "executive advisory": "$5-15K",
    "capability workshops": "$15-75K",
    "rapid prototyping": "$30-150K",
    "multi-model orchestration": "$100-250K",
    "ethics & evaluation engine": "$50-150K",
}


def apply_price_guardrails(payload: dict) -> dict:
    services = payload.get("services", {})
    cards = services.get("cards", []) if isinstance(services, dict) else []

    for card in cards:
        title = str(card.get("title", "")).strip().lower()
        if title in PRICE_GUARDRAILS:
            card["price"] = PRICE_GUARDRAILS[title]
        elif not card.get("price"):
            card["price"] = "$XX-XXK"

    return payload
