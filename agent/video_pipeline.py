from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any, Dict, List, Tuple

from agent.config import Settings
from agent.ingest import Source, auto_pull_sources, gather_sources, truncate_sources
from agent.openai_client import OpenAIClient
from agent.video_prompts import (
    VIDEO_COMPONENT_CATALOG,
    VIDEO_EDIT_PROMPT,
    VIDEO_GENERATE_PROMPT,
    VIDEO_SYSTEM_PROMPT,
)

SCENE_ORDER = [
    "hero",
    "consulting",
    "why-us",
    "services",
    "methodology",
    "choice",
    "faq",
    "cta",
]

SCENE_WEIGHTS = [0.14, 0.12, 0.12, 0.13, 0.13, 0.12, 0.12, 0.12]

DEFAULT_LAYOUT_BY_SCENE: Dict[str, str] = {
    "hero": "focus",
    "consulting": "split",
    "why-us": "stacked",
    "services": "cards-first",
    "methodology": "split",
    "choice": "cards-first",
    "faq": "split",
    "cta": "focus",
}

VIZ_ALLOWLIST_BY_SCENE: Dict[str, List[str]] = {
    "hero": ["chart.kpi.cards", "flow.pipeline"],
    "consulting": ["flow.swimlane", "flow.pipeline", "chart.bar.comparison"],
    "why-us": ["chart.scatter.impactRisk", "chart.bar.comparison", "chart.kpi.cards"],
    "services": ["chart.bar.stacked", "chart.pie.allocation", "flow.pipeline"],
    "methodology": ["chart.line.timeline", "flow.pipeline", "flow.swimlane"],
    "choice": ["chart.bar.comparison", "chart.pie.allocation", "chart.scatter.impactRisk"],
    "faq": ["flow.swimlane", "chart.bar.comparison", "chart.kpi.cards"],
    "cta": ["flow.cycle", "chart.kpi.cards", "chart.pie.allocation"],
}

VIZ_DEFAULT_BY_SCENE: Dict[str, str] = {
    "hero": "chart.kpi.cards",
    "consulting": "flow.swimlane",
    "why-us": "chart.scatter.impactRisk",
    "services": "chart.bar.stacked",
    "methodology": "chart.line.timeline",
    "choice": "chart.bar.comparison",
    "faq": "chart.kpi.cards",
    "cta": "flow.cycle",
}

QUALITATIVE_TO_NUMERIC = {
    "very low": 1,
    "low": 2,
    "medium": 3,
    "moderate": 3,
    "high": 4,
    "strong": 4,
    "controlled": 4,
    "very high": 5,
    "critical": 5,
}

MAX_FLOW_NODES = 4
MAX_FLOW_EDGES = 6
MAX_LANES = 3
MAX_BAR_CATEGORIES = 4
MAX_BAR_SERIES = 2
MAX_STACKED_SERIES = 3
MAX_LINE_CATEGORIES = 6
MAX_LINE_SERIES = 2
MAX_PIE_SLICES = 4
MAX_SCATTER_POINTS = 3
MAX_KPI_ITEMS = 3
MAX_BULLETS = 3
MAX_CARDS = 2


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    return value.strip("-") or "video"


@dataclass
class VideoInput:
    company: str
    sector: str
    slug: str
    context: str
    custom_prompt: str
    files: List[str]
    links: List[str]
    website: str
    include_categories: List[str]
    exclude_patterns: List[str]
    template: str
    aspect_ratio: str
    duration_sec: int


@dataclass
class VideoEditInput:
    script: dict
    instructions: str
    context: str
    custom_prompt: str
    files: List[str]
    links: List[str]
    website: str
    include_categories: List[str]
    exclude_patterns: List[str]


def build_sources(
    video_input_files: List[str],
    video_input_links: List[str],
    website: str,
    include_categories: List[str],
    exclude_patterns: List[str],
) -> List[Source]:
    sources = gather_sources(video_input_files, video_input_links)
    if website and include_categories:
        sources.extend(
            auto_pull_sources(
                website,
                include_categories,
                exclude_patterns,
            )
        )
    return truncate_sources(sources, max_chars=5000)


def sources_summary(sources: List[Source]) -> str:
    if not sources:
        return "(no sources)"
    blocks: List[str] = []
    for source in sources:
        blocks.append(
            f"[{source.source_type}] {source.source_id}\n{source.content[:1200]}"
        )
    return "\n\n".join(blocks)


def _to_str(value: Any, fallback: str = "") -> str:
    if isinstance(value, str):
        trimmed = value.strip()
        return trimmed if trimmed else fallback
    if value is None:
        return fallback
    return str(value)


def _to_int(value: Any, fallback: int) -> int:
    try:
        parsed = int(round(float(value)))
    except (TypeError, ValueError):
        return fallback
    return parsed


def _to_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _normalize_aspect_ratio(value: Any, fallback: str) -> str:
    candidate = _to_str(value, fallback)
    if candidate in {"16:9", "1:1", "9:16"}:
        return candidate
    return fallback


def _normalize_layout(value: Any, fallback: str) -> str:
    candidate = _to_str(value, fallback)
    if candidate in {"split", "stacked", "focus", "cards-first"}:
        return candidate
    return fallback


def _normalize_scene_type(value: Any, fallback: str) -> str:
    candidate = _to_str(value, fallback)
    if candidate in SCENE_ORDER:
        return candidate
    return fallback


def _normalize_component_id(scene_type: str, requested: Any, fallback: str) -> str:
    allowlist = VIZ_ALLOWLIST_BY_SCENE[scene_type]
    requested_str = _to_str(requested, "")
    if requested_str in allowlist:
        return requested_str
    if fallback in allowlist:
        return fallback
    return allowlist[0]


def _parse_scale_value(value: Any, fallback: float) -> Tuple[float, str | None, bool]:
    if isinstance(value, (int, float)):
        return float(value), None, False

    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return fallback, None, False
        try:
            return float(stripped), None, False
        except ValueError:
            normalized = stripped.lower()
            if normalized in QUALITATIVE_TO_NUMERIC:
                return float(QUALITATIVE_TO_NUMERIC[normalized]), stripped, True
            return fallback, stripped, True

    return fallback, None, False


def _normalize_flow_visualization(source: Dict[str, Any], fallback: Dict[str, Any], component_id: str) -> Dict[str, Any]:
    fallback_nodes = _to_list(fallback.get("nodes"))[:MAX_FLOW_NODES]
    raw_nodes = _to_list(source.get("nodes")) or fallback_nodes

    nodes: List[Dict[str, Any]] = []
    for index, raw in enumerate(raw_nodes[:MAX_FLOW_NODES]):
        if not isinstance(raw, dict):
            continue
        fallback_node = fallback_nodes[index] if index < len(fallback_nodes) else {}
        nodes.append(
            {
                "id": _to_str(raw.get("id"), _to_str(fallback_node.get("id"), f"node-{index+1}")),
                "label": _to_str(raw.get("label"), _to_str(fallback_node.get("label"), f"Step {index+1}")),
                "detail": _to_str(raw.get("detail"), _to_str(fallback_node.get("detail"), "")),
                "lane": _to_str(raw.get("lane"), _to_str(fallback_node.get("lane"), "")),
            }
        )

    if not nodes and fallback_nodes:
        nodes = fallback_nodes

    valid_ids = {node.get("id") for node in nodes}

    fallback_edges = _to_list(fallback.get("edges"))
    raw_edges = _to_list(source.get("edges")) or fallback_edges

    edges: List[Dict[str, Any]] = []
    for index, raw in enumerate(raw_edges[:MAX_FLOW_EDGES]):
        if not isinstance(raw, dict):
            continue
        fallback_edge = fallback_edges[index] if index < len(fallback_edges) else {}
        source_id = _to_str(raw.get("source"), _to_str(fallback_edge.get("source"), ""))
        target_id = _to_str(raw.get("target"), _to_str(fallback_edge.get("target"), ""))
        if source_id not in valid_ids or target_id not in valid_ids:
            continue
        edges.append(
            {
                "id": _to_str(raw.get("id"), _to_str(fallback_edge.get("id"), f"edge-{index+1}")),
                "source": source_id,
                "target": target_id,
                "label": _to_str(raw.get("label"), _to_str(fallback_edge.get("label"), "")),
            }
        )

    if not edges and fallback_edges:
        edges = fallback_edges

    lane_labels = [
        _to_str(item, "") for item in _to_list(source.get("laneLabels")) if _to_str(item, "")
    ][:MAX_LANES]
    if not lane_labels:
        lane_labels = [
            _to_str(item, "") for item in _to_list(fallback.get("laneLabels")) if _to_str(item, "")
        ]

    return {
        "componentId": component_id,
        "title": _to_str(source.get("title"), _to_str(fallback.get("title"), "Visualization")),
        "caption": _to_str(source.get("caption"), _to_str(fallback.get("caption"), "")),
        "themeVariant": _to_str(source.get("themeVariant"), _to_str(fallback.get("themeVariant"), "default")),
        "nodes": nodes,
        "edges": edges,
        "laneLabels": lane_labels,
    }


def _normalize_series(
    source_series: List[Any],
    fallback_series: List[Any],
    category_length: int,
    max_series: int,
) -> Tuple[List[Dict[str, Any]], str]:
    series_input = source_series or fallback_series
    has_qualitative = False
    output: List[Dict[str, Any]] = []

    for index, raw in enumerate(series_input[:max_series]):
        if not isinstance(raw, dict):
            continue

        fallback_item = fallback_series[index] if index < len(fallback_series) else {}
        values_input = _to_list(raw.get("values")) or _to_list(fallback_item.get("values"))
        fallback_values = _to_list(fallback_item.get("values"))

        values: List[float] = []
        raw_values: List[str] = []

        for value_index in range(category_length):
            fallback_value = float(fallback_values[value_index]) if value_index < len(fallback_values) else 0.0
            source_value = values_input[value_index] if value_index < len(values_input) else fallback_value
            numeric, raw_value, qualitative = _parse_scale_value(source_value, fallback_value)
            values.append(float(numeric))
            if raw_value:
                raw_values.append(raw_value)
            if qualitative:
                has_qualitative = True

        output.append(
            {
                "id": _to_str(raw.get("id"), _to_str(fallback_item.get("id"), f"series-{index+1}")),
                "label": _to_str(raw.get("label"), _to_str(fallback_item.get("label"), f"Series {index+1}")),
                "values": values,
                "rawValues": raw_values if raw_values else _to_list(fallback_item.get("rawValues")),
                "color": _to_str(raw.get("color"), _to_str(fallback_item.get("color"), "")),
            }
        )

    if not output and fallback_series:
        output = fallback_series[:max_series]

    return output, ("qualitative" if has_qualitative else "numeric")


def _normalize_bar_visualization(source: Dict[str, Any], fallback: Dict[str, Any], component_id: str) -> Dict[str, Any]:
    categories = [
        _to_str(item, "") for item in _to_list(source.get("categories")) if _to_str(item, "")
    ][:MAX_BAR_CATEGORIES]
    if not categories:
        categories = [
            _to_str(item, "") for item in _to_list(fallback.get("categories")) if _to_str(item, "")
        ][:MAX_BAR_CATEGORIES]

    max_series = MAX_STACKED_SERIES if component_id == "chart.bar.stacked" else MAX_BAR_SERIES
    series, value_mode = _normalize_series(
        _to_list(source.get("series")),
        _to_list(fallback.get("series")),
        max(len(categories), 1),
        max_series,
    )

    return {
        "componentId": component_id,
        "title": _to_str(source.get("title"), _to_str(fallback.get("title"), "Visualization")),
        "caption": _to_str(source.get("caption"), _to_str(fallback.get("caption"), "")),
        "themeVariant": _to_str(source.get("themeVariant"), _to_str(fallback.get("themeVariant"), "default")),
        "valueMode": _to_str(source.get("valueMode"), value_mode),
        "categories": categories,
        "series": series,
    }


def _normalize_line_visualization(source: Dict[str, Any], fallback: Dict[str, Any]) -> Dict[str, Any]:
    categories = [
        _to_str(item, "") for item in _to_list(source.get("categories")) if _to_str(item, "")
    ][:MAX_LINE_CATEGORIES]
    if not categories:
        categories = [
            _to_str(item, "") for item in _to_list(fallback.get("categories")) if _to_str(item, "")
        ][:MAX_LINE_CATEGORIES]

    series, value_mode = _normalize_series(
        _to_list(source.get("series")),
        _to_list(fallback.get("series")),
        max(len(categories), 1),
        MAX_LINE_SERIES,
    )

    return {
        "componentId": "chart.line.timeline",
        "title": _to_str(source.get("title"), _to_str(fallback.get("title"), "Visualization")),
        "caption": _to_str(source.get("caption"), _to_str(fallback.get("caption"), "")),
        "themeVariant": _to_str(source.get("themeVariant"), _to_str(fallback.get("themeVariant"), "default")),
        "valueMode": _to_str(source.get("valueMode"), value_mode),
        "categories": categories,
        "series": series,
    }


def _normalize_pie_visualization(source: Dict[str, Any], fallback: Dict[str, Any]) -> Dict[str, Any]:
    raw_slices = _to_list(source.get("slices")) or _to_list(fallback.get("slices"))
    fallback_slices = _to_list(fallback.get("slices"))

    has_qualitative = False
    slices: List[Dict[str, Any]] = []

    for index, raw in enumerate(raw_slices[:MAX_PIE_SLICES]):
        if not isinstance(raw, dict):
            continue
        fallback_slice = fallback_slices[index] if index < len(fallback_slices) else {}
        numeric, raw_value, qualitative = _parse_scale_value(
            raw.get("value"), float(fallback_slice.get("value", 0.0))
        )
        if qualitative:
            has_qualitative = True

        slices.append(
            {
                "id": _to_str(raw.get("id"), _to_str(fallback_slice.get("id"), f"slice-{index+1}")),
                "label": _to_str(raw.get("label"), _to_str(fallback_slice.get("label"), f"Slice {index+1}")),
                "value": numeric,
                "rawValue": _to_str(raw_value, _to_str(fallback_slice.get("rawValue"), "")),
                "color": _to_str(raw.get("color"), _to_str(fallback_slice.get("color"), "")),
                "detail": _to_str(raw.get("detail"), _to_str(fallback_slice.get("detail"), "")),
            }
        )

    if not slices and fallback_slices:
        slices = fallback_slices

    return {
        "componentId": "chart.pie.allocation",
        "title": _to_str(source.get("title"), _to_str(fallback.get("title"), "Visualization")),
        "caption": _to_str(source.get("caption"), _to_str(fallback.get("caption"), "")),
        "themeVariant": _to_str(source.get("themeVariant"), _to_str(fallback.get("themeVariant"), "default")),
        "valueMode": _to_str(source.get("valueMode"), "qualitative" if has_qualitative else "numeric"),
        "slices": slices,
    }


def _normalize_scatter_visualization(source: Dict[str, Any], fallback: Dict[str, Any]) -> Dict[str, Any]:
    raw_points = _to_list(source.get("points")) or _to_list(fallback.get("points"))
    fallback_points = _to_list(fallback.get("points"))

    has_qualitative = False
    points: List[Dict[str, Any]] = []

    for index, raw in enumerate(raw_points[:MAX_SCATTER_POINTS]):
        if not isinstance(raw, dict):
            continue

        fallback_point = fallback_points[index] if index < len(fallback_points) else {}

        x, raw_x, qx = _parse_scale_value(raw.get("x"), float(fallback_point.get("x", 3.0)))
        y, raw_y, qy = _parse_scale_value(raw.get("y"), float(fallback_point.get("y", 3.0)))
        has_qualitative = has_qualitative or qx or qy

        points.append(
            {
                "id": _to_str(raw.get("id"), _to_str(fallback_point.get("id"), f"point-{index+1}")),
                "label": _to_str(raw.get("label"), _to_str(fallback_point.get("label"), f"Point {index+1}")),
                "x": x,
                "y": y,
                "rawX": _to_str(raw_x, _to_str(fallback_point.get("rawX"), "")),
                "rawY": _to_str(raw_y, _to_str(fallback_point.get("rawY"), "")),
                "size": float(raw.get("size", fallback_point.get("size", 14))),
                "detail": _to_str(raw.get("detail"), _to_str(fallback_point.get("detail"), "")),
            }
        )

    if not points and fallback_points:
        points = fallback_points
    if len(points) > 1:
        unique_y = len({round(float(point.get("y", 0))) for point in points})
        if unique_y == 1:
            for index, point in enumerate(points):
                adjusted = float(point.get("y", 3.0)) + (index - 1) * 0.8
                point["y"] = max(1.0, min(5.0, adjusted))

    return {
        "componentId": "chart.scatter.impactRisk",
        "title": _to_str(source.get("title"), _to_str(fallback.get("title"), "Visualization")),
        "caption": _to_str(source.get("caption"), _to_str(fallback.get("caption"), "")),
        "themeVariant": _to_str(source.get("themeVariant"), _to_str(fallback.get("themeVariant"), "default")),
        "valueMode": _to_str(source.get("valueMode"), "qualitative" if has_qualitative else "numeric"),
        "xLabel": _to_str(source.get("xLabel"), _to_str(fallback.get("xLabel"), "Impact")),
        "yLabel": _to_str(source.get("yLabel"), _to_str(fallback.get("yLabel"), "Risk")),
        "points": points,
    }


def _normalize_kpi_visualization(source: Dict[str, Any], fallback: Dict[str, Any]) -> Dict[str, Any]:
    raw_items = _to_list(source.get("items")) or _to_list(fallback.get("items"))
    fallback_items = _to_list(fallback.get("items"))

    items: List[Dict[str, Any]] = []
    for index, raw in enumerate(raw_items[:MAX_KPI_ITEMS]):
        if not isinstance(raw, dict):
            continue
        fallback_item = fallback_items[index] if index < len(fallback_items) else {}
        trend = _to_str(raw.get("trend"), _to_str(fallback_item.get("trend"), "flat"))
        if trend not in {"up", "down", "flat"}:
            trend = "flat"

        items.append(
            {
                "id": _to_str(raw.get("id"), _to_str(fallback_item.get("id"), f"kpi-{index+1}")),
                "label": _to_str(raw.get("label"), _to_str(fallback_item.get("label"), f"KPI {index+1}")),
                "value": _to_str(raw.get("value"), _to_str(fallback_item.get("value"), "N/A")),
                "delta": _to_str(raw.get("delta"), _to_str(fallback_item.get("delta"), "")),
                "trend": trend,
                "detail": _to_str(raw.get("detail"), _to_str(fallback_item.get("detail"), "")),
            }
        )

    if not items and fallback_items:
        items = fallback_items

    return {
        "componentId": "chart.kpi.cards",
        "title": _to_str(source.get("title"), _to_str(fallback.get("title"), "Visualization")),
        "caption": _to_str(source.get("caption"), _to_str(fallback.get("caption"), "")),
        "themeVariant": _to_str(source.get("themeVariant"), _to_str(fallback.get("themeVariant"), "default")),
        "valueMode": "qualitative",
        "items": items,
    }


def _normalize_visualization(scene_type: str, source_viz: Any, fallback_viz: Dict[str, Any]) -> Dict[str, Any]:
    source = source_viz if isinstance(source_viz, dict) else {}
    component_id = _normalize_component_id(
        scene_type,
        source.get("componentId"),
        _to_str(fallback_viz.get("componentId"), VIZ_DEFAULT_BY_SCENE[scene_type]),
    )

    if component_id in {"flow.pipeline", "flow.swimlane", "flow.cycle"}:
        return _normalize_flow_visualization(source, fallback_viz, component_id)

    if component_id in {"chart.bar.comparison", "chart.bar.stacked"}:
        return _normalize_bar_visualization(source, fallback_viz, component_id)

    if component_id == "chart.line.timeline":
        return _normalize_line_visualization(source, fallback_viz)

    if component_id == "chart.pie.allocation":
        return _normalize_pie_visualization(source, fallback_viz)

    if component_id == "chart.scatter.impactRisk":
        return _normalize_scatter_visualization(source, fallback_viz)

    return _normalize_kpi_visualization(source, fallback_viz)


def _coerce_scene(scene: Dict[str, Any], fallback_scene: Dict[str, Any], index: int) -> Dict[str, Any]:
    scene_type = _normalize_scene_type(scene.get("type"), fallback_scene.get("type", SCENE_ORDER[index]))
    fallback_visualization = fallback_scene.get("visualization", {})

    return {
        "id": _to_str(scene.get("id"), _to_str(fallback_scene.get("id"), f"scene-{index+1}")),
        "type": scene_type,
        "durationSec": max(3, _to_int(scene.get("durationSec"), _to_int(fallback_scene.get("durationSec"), 8))),
        "headline": _to_str(scene.get("headline"), _to_str(fallback_scene.get("headline"), "")),
        "subcopy": _to_str(scene.get("subcopy"), _to_str(fallback_scene.get("subcopy"), "")),
        "voiceoverScript": _to_str(scene.get("voiceoverScript"), _to_str(fallback_scene.get("voiceoverScript"), "")),
        "layoutVariant": _normalize_layout(
            scene.get("layoutVariant"), _to_str(fallback_scene.get("layoutVariant"), DEFAULT_LAYOUT_BY_SCENE[scene_type])
        ),
        "illustrationPrompt": _to_str(
            scene.get("illustrationPrompt"),
            _to_str(fallback_scene.get("illustrationPrompt"), ""),
        ),
        "visualization": _normalize_visualization(scene_type, scene.get("visualization"), fallback_visualization),
        "bullets": [
            _to_str(item, "")
            for item in (_to_list(scene.get("bullets")) or _to_list(fallback_scene.get("bullets")))[:MAX_BULLETS]
            if _to_str(item, "")
        ],
        "cards": [
            {
                "title": _to_str(card.get("title"), ""),
                "text": _to_str(card.get("text"), ""),
            }
            for card in (_to_list(scene.get("cards")) or _to_list(fallback_scene.get("cards")))[:MAX_CARDS]
            if isinstance(card, dict)
        ],
    }


def normalize_script(script: dict, fallback: dict) -> dict:
    meta = script.get("meta", {}) if isinstance(script, dict) else {}
    source_scenes = script.get("scenes", []) if isinstance(script, dict) else []
    source_scenes = source_scenes if isinstance(source_scenes, list) else []

    fallback_scenes = fallback.get("scenes", [])
    fallback_by_type = {
        scene.get("type", SCENE_ORDER[index]): scene
        for index, scene in enumerate(fallback_scenes)
        if isinstance(scene, dict)
    }

    consumed_indexes = set()
    normalized_scenes: List[Dict[str, Any]] = []

    for index, scene_type in enumerate(SCENE_ORDER):
        fallback_scene = fallback_by_type.get(scene_type, fallback_scenes[index] if index < len(fallback_scenes) else {})

        source_scene: Dict[str, Any] = {}

        for candidate_index, candidate in enumerate(source_scenes):
            if candidate_index in consumed_indexes:
                continue
            if not isinstance(candidate, dict):
                continue
            if _normalize_scene_type(candidate.get("type"), scene_type) == scene_type:
                source_scene = candidate
                consumed_indexes.add(candidate_index)
                break

        if not source_scene and index < len(source_scenes):
            candidate = source_scenes[index]
            if isinstance(candidate, dict):
                source_scene = candidate
                consumed_indexes.add(index)

        normalized_scenes.append(_coerce_scene(source_scene, fallback_scene, index))

    duration_sum = sum(_to_int(scene.get("durationSec"), 0) for scene in normalized_scenes)

    normalized = {
        "meta": {
            "schemaVersion": 2,
            "title": _to_str(meta.get("title"), _to_str(fallback.get("meta", {}).get("title"), "Eduba Video")),
            "slug": _to_str(meta.get("slug"), _to_str(fallback.get("meta", {}).get("slug"), "video")),
            "company": _to_str(meta.get("company"), _to_str(fallback.get("meta", {}).get("company"), "Company")),
            "sector": _to_str(meta.get("sector"), _to_str(fallback.get("meta", {}).get("sector"), "Sector")),
            "template": _to_str(meta.get("template"), _to_str(fallback.get("meta", {}).get("template"), "eduba-core-v1")),
            "aspectRatio": _normalize_aspect_ratio(
                meta.get("aspectRatio"), _to_str(fallback.get("meta", {}).get("aspectRatio"), "16:9")
            ),
            "durationSec": duration_sum,
            "ctaText": _to_str(meta.get("ctaText"), _to_str(fallback.get("meta", {}).get("ctaText"), "LET'S TALK")),
            "voiceoverEnabled": bool(
                meta.get("voiceoverEnabled", fallback.get("meta", {}).get("voiceoverEnabled", True))
            ),
            "illustrationStyle": _to_str(
                meta.get("illustrationStyle"),
                _to_str(fallback.get("meta", {}).get("illustrationStyle"), "eduba editorial diagrams"),
            ),
        },
        "scenes": normalized_scenes,
    }

    return normalized


def _compute_scene_durations(target_duration: int) -> List[int]:
    safe_target = max(target_duration, 48)
    scene_durations = [
        max(5, int(round(safe_target * weight))) for weight in SCENE_WEIGHTS
    ]
    delta = safe_target - sum(scene_durations)
    while delta != 0:
        if delta > 0:
            scene_durations[-1] += 1
            delta -= 1
            continue
        max_index = max(
            range(len(scene_durations)), key=lambda idx: scene_durations[idx]
        )
        if scene_durations[max_index] <= 5:
            break
        scene_durations[max_index] -= 1
        delta += 1
    return scene_durations


def default_script(video_input: VideoInput) -> dict:
    durations = _compute_scene_durations(video_input.duration_sec)

    return {
        "meta": {
            "schemaVersion": 2,
            "title": f"{video_input.company} x Eduba",
            "slug": video_input.slug,
            "company": video_input.company,
            "sector": video_input.sector,
            "template": video_input.template,
            "aspectRatio": _normalize_aspect_ratio(video_input.aspect_ratio, "16:9"),
            "durationSec": sum(durations),
            "ctaText": "LET'S TALK",
            "voiceoverEnabled": True,
            "illustrationStyle": video_input.custom_prompt.strip() or "eduba editorial diagrams",
        },
        "scenes": [
            {
                "id": "scene-hero",
                "type": "hero",
                "durationSec": durations[0],
                "headline": f"{video_input.sector} AI, minus the theater.",
                "subcopy": "Working pipelines, measurable outcomes, and full capability transfer.",
                "voiceoverScript": "Eduba helps teams ship reliable AI pipelines with adoption and governance built in.",
                "layoutVariant": "focus",
                "illustrationPrompt": "A bold hero canvas showing people, systems, and decision checkpoints aligned.",
                "visualization": {
                    "componentId": "chart.kpi.cards",
                    "title": "Signal to value",
                    "caption": "Decision quality, adoption readiness, and execution confidence.",
                    "valueMode": "qualitative",
                    "items": [
                        {"id": "kpi-1", "label": "Decision quality", "value": "High", "delta": "human-in-loop", "trend": "up"},
                        {"id": "kpi-2", "label": "Adoption", "value": "Strong", "delta": "governance built in", "trend": "up"},
                        {"id": "kpi-3", "label": "Risk", "value": "Controlled", "delta": "evaluation harness", "trend": "flat"},
                    ],
                },
                "bullets": [],
                "cards": [],
            },
            {
                "id": "scene-consulting",
                "type": "consulting",
                "durationSec": durations[1],
                "headline": "Your orchestration partner",
                "subcopy": "Move from scattered experiments to production-minded systems.",
                "voiceoverScript": "We orchestrate tools, models, and workflows so teams can run and trust outputs.",
                "layoutVariant": "split",
                "illustrationPrompt": "A structured workflow map with clear ownership and governance gates.",
                "visualization": {
                    "componentId": "flow.swimlane",
                    "title": "Operating lanes",
                    "caption": "Business, model operations, and governance stay synchronized.",
                    "laneLabels": ["Business", "Model Ops", "Governance"],
                    "nodes": [
                        {"id": "n1", "label": "Opportunity", "detail": "use-case intake", "lane": "Business"},
                        {"id": "n2", "label": "Model orchestration", "detail": "prompting + fallback", "lane": "Model Ops"},
                        {"id": "n3", "label": "Human review", "detail": "approval + exceptions", "lane": "Governance"},
                        {"id": "n4", "label": "Rollout", "detail": "measured adoption", "lane": "Business"},
                    ],
                    "edges": [
                        {"id": "e1", "source": "n1", "target": "n2", "label": "handoff"},
                        {"id": "e2", "source": "n2", "target": "n3", "label": "guardrail"},
                        {"id": "e3", "source": "n3", "target": "n4", "label": "go-live"},
                    ],
                },
                "bullets": [
                    "Orchestration over tool sprawl",
                    "Governance and adoption built in",
                    "Reliability across models",
                ],
                "cards": [],
            },
            {
                "id": "scene-why-us",
                "type": "why-us",
                "durationSec": durations[2],
                "headline": "Why teams choose Eduba",
                "subcopy": "Truth over hype, working POCs, and capability transfer.",
                "voiceoverScript": "Our work is outcome-first. We deliver measurable progress quickly and transfer capability to your team.",
                "layoutVariant": "stacked",
                "illustrationPrompt": "A business matrix weighing impact, risk, and speed to value.",
                "visualization": {
                    "componentId": "chart.scatter.impactRisk",
                    "title": "Outcome confidence map",
                    "caption": "Prioritize high-impact and controlled-risk opportunities.",
                    "valueMode": "qualitative",
                    "xLabel": "Impact",
                    "yLabel": "Risk",
                    "points": [
                        {"id": "p1", "label": "Working POCs", "x": "very high", "y": "low", "size": 18},
                        {"id": "p2", "label": "Governance", "x": "high", "y": "medium", "size": 14},
                        {"id": "p3", "label": "Transfer", "x": "high", "y": "medium", "size": 15},
                    ],
                },
                "bullets": [
                    "Working POCs over slides",
                    "Governance from day one",
                    "Fast decision bandwidth",
                ],
                "cards": [],
            },
            {
                "id": "scene-services",
                "type": "services",
                "durationSec": durations[3],
                "headline": "Services for real delivery",
                "subcopy": "Advisory, workshops, prototypes, and orchestration execution.",
                "voiceoverScript": "Each service is designed to move from strategy to production with clear ownership.",
                "layoutVariant": "cards-first",
                "illustrationPrompt": "A service blueprint linking each engagement to measurable milestones.",
                "visualization": {
                    "componentId": "chart.bar.stacked",
                    "title": "Service contribution mix",
                    "caption": "Balance speed, governance, and capability transfer.",
                    "valueMode": "qualitative",
                    "categories": ["Advisory", "Workshops", "Prototype", "Scale"],
                    "series": [
                        {"id": "s1", "label": "Speed-to-value", "values": ["high", "medium", "very high", "high"]},
                        {"id": "s2", "label": "Governance", "values": ["medium", "high", "high", "very high"]},
                        {"id": "s3", "label": "Transfer", "values": ["medium", "very high", "high", "very high"]},
                    ],
                },
                "bullets": [],
                "cards": [
                    {"title": "Advisory", "text": "Opportunity map and roadmap"},
                    {"title": "Prototype", "text": "4-6 week production-minded POC"},
                    {"title": "Scale", "text": "Handover with docs and training"},
                ],
            },
            {
                "id": "scene-methodology",
                "type": "methodology",
                "durationSec": durations[4],
                "headline": "Methodology that ships",
                "subcopy": "Discover, triage, build, pilot, orchestrate, and scale.",
                "voiceoverScript": "Execution follows a strict rhythm so risk stays controlled and momentum stays high.",
                "layoutVariant": "split",
                "illustrationPrompt": "A six-step execution timeline with checkpoints and go/no-go gates.",
                "visualization": {
                    "componentId": "chart.line.timeline",
                    "title": "Delivery timeline",
                    "caption": "Predictable path from discovery to handover.",
                    "valueMode": "qualitative",
                    "categories": ["Discover", "Triage", "Build", "Pilot", "Orchestrate", "Scale"],
                    "series": [
                        {"id": "t1", "label": "Readiness", "values": ["low", "medium", "medium", "high", "high", "very high"]},
                        {"id": "t2", "label": "Decision confidence", "values": ["low", "medium", "medium", "medium", "high", "very high"]},
                    ],
                },
                "bullets": [
                    "Discovery and triage",
                    "Build with evaluation",
                    "Pilot and scale handover",
                ],
                "cards": [],
            },
            {
                "id": "scene-choice",
                "type": "choice",
                "durationSec": durations[5],
                "headline": "Choose your engagement model",
                "subcopy": "Advisory sprint, co-build squad, or project-based delivery.",
                "voiceoverScript": "Pick the model that matches your internal bandwidth and urgency.",
                "layoutVariant": "cards-first",
                "illustrationPrompt": "A side-by-side model selection board comparing ownership, speed, and support.",
                "visualization": {
                    "componentId": "chart.bar.comparison",
                    "title": "Model selection",
                    "caption": "Align delivery mode to capacity and urgency.",
                    "valueMode": "qualitative",
                    "categories": ["Advisory", "Co-build", "Project"],
                    "series": [
                        {"id": "c1", "label": "Speed", "values": ["medium", "high", "very high"]},
                        {"id": "c2", "label": "Control", "values": ["very high", "high", "medium"]},
                    ],
                },
                "bullets": [],
                "cards": [
                    {"title": "Advisory", "text": "Fixed-scope clarity"},
                    {"title": "Co-build", "text": "Ship with your team"},
                    {"title": "Project", "text": "End-to-end delivery"},
                ],
            },
            {
                "id": "scene-faq",
                "type": "faq",
                "durationSec": durations[6],
                "headline": "FAQ before commitment",
                "subcopy": "Security, ROI, and long-term maintainability answered clearly.",
                "voiceoverScript": "We handle common buyer objections with evidence and delivery discipline.",
                "layoutVariant": "split",
                "illustrationPrompt": "A FAQ evidence board with compliance, ROI, and maintainability checklists.",
                "visualization": {
                    "componentId": "chart.kpi.cards",
                    "title": "Objection handling",
                    "caption": "Clear answers before full rollout.",
                    "items": [
                        {"id": "f1", "label": "Security", "value": "Audit-ready", "delta": "RBAC + trails", "trend": "up"},
                        {"id": "f2", "label": "ROI", "value": "Measurable", "delta": "cohort-level tracking", "trend": "up"},
                        {"id": "f3", "label": "Ownership", "value": "In-house", "delta": "runbooks + training", "trend": "up"},
                    ],
                },
                "bullets": [
                    "First use case selection",
                    "Security and compliance approach",
                    "Post-handover maintainability",
                ],
                "cards": [],
            },
            {
                "id": "scene-cta",
                "type": "cta",
                "durationSec": durations[7],
                "headline": "Book a no-obligation consultation.",
                "subcopy": "Define the highest-impact first use case for your team.",
                "voiceoverScript": "Book a no-obligation consultation and we will map your first high-impact implementation path.",
                "layoutVariant": "focus",
                "illustrationPrompt": "A launch dashboard with approved roadmap and accountable owners.",
                "visualization": {
                    "componentId": "flow.cycle",
                    "title": "Adoption loop",
                    "caption": "Pilot, measure, expand, operationalize.",
                    "nodes": [
                        {"id": "a1", "label": "Pilot", "detail": "target one workflow"},
                        {"id": "a2", "label": "Measure", "detail": "prove value"},
                        {"id": "a3", "label": "Expand", "detail": "scale coverage"},
                        {"id": "a4", "label": "Operationalize", "detail": "handover + governance"},
                    ],
                    "edges": [
                        {"id": "ae1", "source": "a1", "target": "a2"},
                        {"id": "ae2", "source": "a2", "target": "a3"},
                        {"id": "ae3", "source": "a3", "target": "a4"},
                        {"id": "ae4", "source": "a4", "target": "a1"},
                    ],
                },
                "bullets": [],
                "cards": [],
            },
        ],
    }


def generate_video_script(video_input: VideoInput, settings: Settings) -> dict:
    sources = build_sources(
        video_input.files,
        video_input.links,
        video_input.website,
        video_input.include_categories,
        video_input.exclude_patterns,
    )
    summary = sources_summary(sources)

    prompt = VIDEO_GENERATE_PROMPT.format(
        company=video_input.company,
        sector=video_input.sector,
        slug=video_input.slug,
        template=video_input.template,
        aspect_ratio=video_input.aspect_ratio,
        duration_sec=video_input.duration_sec,
        custom_prompt=video_input.custom_prompt or "(none)",
        context=video_input.context or "(no additional context)",
        sources_summary=summary,
        component_catalog=VIDEO_COMPONENT_CATALOG.strip(),
    )

    client = OpenAIClient(
        api_key=settings.openai_api_key,
        model=settings.openai_model,
        temperature=settings.openai_temperature,
        max_output_tokens=settings.max_output_tokens,
    )

    generated = client.generate_json(VIDEO_SYSTEM_PROMPT, prompt)
    fallback = default_script(video_input)
    return normalize_script(generated, fallback)


def edit_video_script(edit_input: VideoEditInput, settings: Settings) -> dict:
    sources = build_sources(
        edit_input.files,
        edit_input.links,
        edit_input.website,
        edit_input.include_categories,
        edit_input.exclude_patterns,
    )
    summary = sources_summary(sources)

    existing_script = json.dumps(edit_input.script, indent=2)
    prompt = VIDEO_EDIT_PROMPT.format(
        instructions=edit_input.instructions,
        custom_prompt=edit_input.custom_prompt or "(none)",
        context=edit_input.context or "(no additional context)",
        sources_summary=summary,
        component_catalog=VIDEO_COMPONENT_CATALOG.strip(),
        existing_script=existing_script,
    )

    client = OpenAIClient(
        api_key=settings.openai_api_key,
        model=settings.openai_model,
        temperature=settings.openai_temperature,
        max_output_tokens=settings.max_output_tokens,
    )

    generated = client.generate_json(VIDEO_SYSTEM_PROMPT, prompt)
    fallback_input = VideoInput(
        company=str(edit_input.script.get("meta", {}).get("company") or "Company"),
        sector=str(edit_input.script.get("meta", {}).get("sector") or "Sector"),
        slug=str(edit_input.script.get("meta", {}).get("slug") or "video"),
        context=edit_input.context,
        custom_prompt=edit_input.custom_prompt,
        files=[],
        links=[],
        website="",
        include_categories=[],
        exclude_patterns=[],
        template=str(
            edit_input.script.get("meta", {}).get("template") or "eduba-core-v1"
        ),
        aspect_ratio=str(
            edit_input.script.get("meta", {}).get("aspectRatio") or "16:9"
        ),
        duration_sec=int(edit_input.script.get("meta", {}).get("durationSec") or 72),
    )
    fallback = default_script(fallback_input)
    fallback_meta = edit_input.script.get("meta", {})
    if isinstance(fallback_meta, dict):
        fallback["meta"].update(fallback_meta)
    return normalize_script(generated, fallback)
