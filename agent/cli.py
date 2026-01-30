from __future__ import annotations

import argparse

from agent.config import get_settings
from agent.pipeline import AgentInput, generate_sector_payload, publish_sector_payload


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate and publish Eduba sector pages")
    parser.add_argument("--company", required=True, help="Company name")
    parser.add_argument("--sector", required=True, help="Target sector label")
    parser.add_argument("--slug", help="Custom slug (optional)")
    parser.add_argument("--context", default="", help="Chat/context summary")
    parser.add_argument("--doc", action="append", default=[], help="Path to document")
    parser.add_argument("--link", action="append", default=[], help="Source link")
    parser.add_argument("--no-publish", action="store_true", help="Skip publishing")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    settings = get_settings()

    agent_input = AgentInput(
        company_name=args.company,
        sector_label=args.sector,
        slug=args.slug,
        context=args.context,
        files=args.doc,
        links=args.link,
    )

    payload = generate_sector_payload(agent_input, settings)

    if args.no_publish:
        print(payload)
        return

    url = publish_sector_payload(payload, settings)
    print(f"Published: {url}")


if __name__ == "__main__":
    main()
