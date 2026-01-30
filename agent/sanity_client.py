from __future__ import annotations

import json
from typing import Any, Dict

import requests


def fetch_sector_slugs(
    project_id: str,
    dataset: str,
    api_version: str,
    token: str,
) -> list[str]:
    query = '*[_type == "sector"]|order(_createdAt asc){ "slug": slug.current }'
    url = f"https://{project_id}.api.sanity.io/v{api_version}/data/query/{dataset}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, params={"query": query}, timeout=30)
    if not response.ok:
        raise RuntimeError(
            f"Sanity query failed: {response.status_code} {response.text}"
        )
    data = response.json()
    slugs = [item.get("slug") for item in data.get("result", []) if item.get("slug")]
    return slugs


def publish_sector(
    project_id: str,
    dataset: str,
    api_version: str,
    token: str,
    document: Dict[str, Any],
) -> Dict[str, Any]:
    url = f"https://{project_id}.api.sanity.io/v{api_version}/data/mutate/{dataset}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    payload = {"mutations": [{"createOrReplace": document}]}
    response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)
    if not response.ok:
        raise RuntimeError(f"Sanity publish failed: {response.status_code} {response.text}")
    return response.json()
