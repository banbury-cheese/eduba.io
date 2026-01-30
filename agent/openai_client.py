from __future__ import annotations

import json
from typing import Any

from openai import OpenAI


def extract_text(response: Any) -> str:
    text_chunks = []
    for output in getattr(response, "output", []) or []:
        if getattr(output, "type", "") != "message":
            continue
        for content in getattr(output, "content", []) or []:
            if getattr(content, "type", "") in {"output_text", "text"}:
                text_chunks.append(getattr(content, "text", ""))
    if text_chunks:
        return "\n".join(text_chunks)
    # Fallbacks for dict-like responses
    if isinstance(response, dict):
        if "output" in response:
            for output in response["output"]:
                if output.get("type") == "message":
                    for item in output.get("content", []):
                        if item.get("type") in {"output_text", "text"}:
                            text_chunks.append(item.get("text", ""))
        if text_chunks:
            return "\n".join(text_chunks)
    return ""


def parse_json(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            return json.loads(text[start : end + 1])
        raise


class OpenAIClient:
    def __init__(self, api_key: str, model: str, temperature: float, max_output_tokens: int):
        self.client = OpenAI(api_key=api_key)
        self.model = model
        self.temperature = temperature
        self.max_output_tokens = max_output_tokens

    def generate_json(self, system_prompt: str, user_prompt: str) -> dict:
        response = self.client.responses.create(
            model=self.model,
            input=[
                {
                    "role": "system",
                    "content": [
                        {"type": "input_text", "text": system_prompt.strip()}
                    ],
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": user_prompt.strip()}
                    ],
                },
            ],
            temperature=self.temperature,
            max_output_tokens=self.max_output_tokens,
        )
        text = extract_text(response)
        if not text:
            raise ValueError("OpenAI response had no text content")
        return parse_json(text)
