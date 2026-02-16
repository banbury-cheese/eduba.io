from __future__ import annotations

import argparse
import json

from agent.config import get_settings
from agent.video_pipeline import (
    VideoEditInput,
    VideoInput,
    edit_video_script,
    generate_video_script,
    slugify,
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate/edit Eduba video scripts")
    subparsers = parser.add_subparsers(dest="command", required=True)

    generate = subparsers.add_parser("generate", help="Generate a new script")
    generate.add_argument("--company", required=True)
    generate.add_argument("--sector", required=True)
    generate.add_argument("--slug")
    generate.add_argument("--context", default="")
    generate.add_argument("--custom-prompt", default="")
    generate.add_argument("--doc", action="append", default=[])
    generate.add_argument("--link", action="append", default=[])
    generate.add_argument("--website", default="")
    generate.add_argument("--include", action="append", default=[])
    generate.add_argument("--exclude", action="append", default=[])
    generate.add_argument("--template", default="eduba-core-v1")
    generate.add_argument("--aspect-ratio", default="16:9")
    generate.add_argument("--duration", type=int, default=45)
    generate.add_argument("--out")

    edit = subparsers.add_parser("edit", help="Edit existing script")
    edit.add_argument("--script-path", required=True)
    edit.add_argument("--instructions", required=True)
    edit.add_argument("--context", default="")
    edit.add_argument("--custom-prompt", default="")
    edit.add_argument("--doc", action="append", default=[])
    edit.add_argument("--link", action="append", default=[])
    edit.add_argument("--website", default="")
    edit.add_argument("--include", action="append", default=[])
    edit.add_argument("--exclude", action="append", default=[])
    edit.add_argument("--out")

    return parser


def _write_or_print(payload: dict, out: str | None) -> None:
    body = json.dumps(payload)
    if out:
        with open(out, "w", encoding="utf-8") as handle:
            handle.write(body)
        return
    print(body)


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    settings = get_settings()

    if args.command == "generate":
        include_categories = args.include
        if args.website and not include_categories:
            include_categories = ["about", "blog", "press", "careers"]
        slug = args.slug or slugify(args.company)
        payload = generate_video_script(
            VideoInput(
                company=args.company,
                sector=args.sector,
                slug=slug,
                context=args.context,
                custom_prompt=args.custom_prompt,
                files=args.doc,
                links=args.link,
                website=args.website,
                include_categories=include_categories,
                exclude_patterns=args.exclude,
                template=args.template,
                aspect_ratio=args.aspect_ratio,
                duration_sec=args.duration,
            ),
            settings,
        )
        _write_or_print(payload, args.out)
        return

    with open(args.script_path, "r", encoding="utf-8") as handle:
        script = json.load(handle)

    include_categories = args.include
    if args.website and not include_categories:
        include_categories = ["about", "blog", "press", "careers"]

    payload = edit_video_script(
        VideoEditInput(
            script=script,
            instructions=args.instructions,
            context=args.context,
            custom_prompt=args.custom_prompt,
            files=args.doc,
            links=args.link,
            website=args.website,
            include_categories=include_categories,
            exclude_patterns=args.exclude,
        ),
        settings,
    )
    _write_or_print(payload, args.out)


if __name__ == "__main__":
    main()
