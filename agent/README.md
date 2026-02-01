 # Eduba Sector Agent (Python)

Generates a custom sector page payload from chat + docs + links, applies pricing guardrails, and auto‑publishes to Sanity.

## How the workflow works

1. **Input**: You provide a company name, sector label, optional slug, a context summary, and optional docs/links.
2. **Ingestion**: Files are parsed (PDF/DOCX/TXT/MD) and links are fetched/cleaned.
3. **Prompting**: A structured prompt (see `prompts.py`) asks the LLM to return JSON for all 6 sections.
4. **Guardrails**: Prices are overridden with static ranges (`pricing.py`).
5. **Sanity publish**: The payload is mapped to the `sector` schema and upserted.
6. **Result**: You get the published URL at `/sectors/{slug}`.

## Files and responsibilities

- `config.py`
  - Loads `.env.local` + env vars.
  - Holds default model settings and Sanity config.

- `ingest.py`
  - Extracts text from PDFs, DOCX, and text files.
  - Fetches and cleans HTML from URLs.

- `prompts.py`
  - System + user prompts for generating sector JSON.
  - Defines schema + output rules.

- `openai_client.py`
  - OpenAI Responses API wrapper.
  - Parses model output into JSON.

- `pricing.py`
  - Static pricing guardrails for service cards.

- `sanity_client.py`
  - Publishes documents to Sanity.
  - Reads existing slugs to set `pageIndex` order.

- `pipeline.py`
  - Orchestrates ingestion → LLM → guardrails → publish.
  - Adds `_key` values required by Sanity arrays.

- `cli.py`
  - CLI entry point to run the agent locally.

## Setup

```bash
pip install -r agent/requirements.txt
```

Add env vars to `.env.local`:

```
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.4
OPENAI_MAX_OUTPUT_TOKENS=1800
SANITY_PROJECT_ID=...
SANITY_DATASET=production
SANITY_API_VERSION=2023-08-01
SANITY_API_WRITE_TOKEN=...   # editor/write token
SITE_URL=http://localhost:3000
```

## Run

```bash
python -m agent.cli \
  --company "Acme Aerospace" \
  --sector "Aerospace" \
  --context "They build propulsion systems and want faster certification." \
  --doc /path/to/brief.pdf \
  --link https://example.com/case-study
```

Add `--no-publish` to print the JSON without sending to Sanity.

## Notes

- Pricing guardrails are intentionally static for now.
- Slug ordering drives `pageIndex` by current Sanity order.
- For the web form, `/create-page` calls the same CLI via the API route.
