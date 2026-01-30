from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional

from dotenv import load_dotenv


def load_env() -> None:
    load_dotenv(".env.local")
    load_dotenv()


@dataclass
class Settings:
    openai_api_key: str
    openai_model: str
    openai_temperature: float
    max_output_tokens: int
    sanity_project_id: str
    sanity_dataset: str
    sanity_api_version: str
    sanity_api_token: str
    site_url: str


DEFAULT_MODEL = "gpt-4o-mini"
DEFAULT_TEMP = 0.4
DEFAULT_MAX_TOKENS = 1800
DEFAULT_SANITY_VERSION = "2023-08-01"
DEFAULT_SITE_URL = "http://localhost:3000"


def get_settings() -> Settings:
    load_env()

    openai_api_key = os.getenv("OPENAI_API_KEY", "").strip()
    sanity_project_id = os.getenv("SANITY_PROJECT_ID", "").strip()
    sanity_dataset = os.getenv("SANITY_DATASET", "").strip()
    sanity_api_version = os.getenv("SANITY_API_VERSION", DEFAULT_SANITY_VERSION)
    sanity_api_token = (
        os.getenv("SANITY_API_WRITE_TOKEN")
        or os.getenv("SANITY_API_READ_TOKEN")
        or ""
    ).strip()
    site_url = os.getenv("SITE_URL", DEFAULT_SITE_URL).rstrip("/")

    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY is required")
    if not sanity_project_id or not sanity_dataset or not sanity_api_token:
        raise ValueError("Sanity project, dataset, and token are required")

    model = os.getenv("OPENAI_MODEL", DEFAULT_MODEL)
    temperature = float(os.getenv("OPENAI_TEMPERATURE", DEFAULT_TEMP))
    max_output_tokens = int(os.getenv("OPENAI_MAX_OUTPUT_TOKENS", DEFAULT_MAX_TOKENS))

    return Settings(
        openai_api_key=openai_api_key,
        openai_model=model,
        openai_temperature=temperature,
        max_output_tokens=max_output_tokens,
        sanity_project_id=sanity_project_id,
        sanity_dataset=sanity_dataset,
        sanity_api_version=sanity_api_version,
        sanity_api_token=sanity_api_token,
        site_url=site_url,
    )
