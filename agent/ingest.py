from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Iterable, List, Optional

import requests
from bs4 import BeautifulSoup


def read_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as handle:
        return handle.read()


def read_pdf(path: str) -> str:
    from pypdf import PdfReader

    reader = PdfReader(path)
    pages = []
    for page in reader.pages:
        text = page.extract_text() or ""
        pages.append(text)
    return "\n".join(pages)


def read_docx(path: str) -> str:
    import docx

    doc = docx.Document(path)
    return "\n".join(p.text for p in doc.paragraphs if p.text)


def extract_text_from_path(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    if ext in {".txt", ".md"}:
        return read_text_file(path)
    if ext == ".pdf":
        return read_pdf(path)
    if ext == ".docx":
        return read_docx(path)
    return read_text_file(path)


def fetch_url_text(url: str, timeout: int = 15) -> str:
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    text = " ".join(soup.get_text(separator=" ").split())
    return text


@dataclass
class Source:
    source_id: str
    source_type: str
    content: str


def gather_sources(files: Iterable[str], links: Iterable[str]) -> List[Source]:
    sources: List[Source] = []
    for file_path in files:
        content = extract_text_from_path(file_path)
        sources.append(Source(source_id=file_path, source_type="file", content=content))
    for link in links:
        content = fetch_url_text(link)
        sources.append(Source(source_id=link, source_type="link", content=content))
    return sources


def truncate_sources(sources: List[Source], max_chars: int = 4000) -> List[Source]:
    trimmed: List[Source] = []
    for source in sources:
        content = source.content[:max_chars]
        trimmed.append(Source(source_id=source.source_id, source_type=source.source_type, content=content))
    return trimmed
