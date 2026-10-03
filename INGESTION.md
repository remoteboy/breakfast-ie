# breakfast.ie ingestion toolkit

This is deliberately a CLI-first pipeline. It fetches **first-party venue sources**, caches the raw source and normalized text, then optionally sends the relevant source text to the OpenAI Responses API using Structured Outputs.

The output is a **candidate dataset for review**, not production data. Nothing is written into `src/data/places.ts` automatically.

## 1. Install dependencies

From the breakfast.ie repo root:

```bash
yarn add cheerio openai pdfjs-dist zod
yarn add -D tsx
```

The current Cheerio release expects a modern Node 22 runtime. Astro 7 already puts the project in that general territory; if Yarn reports an engine mismatch, check `node --version` before changing packages.

## 2. API key

AI extraction is optional. Fetching and text extraction work without an API key.

For AI extraction:

```bash
export OPENAI_API_KEY="..."
```

Optional model override:

```bash
export OPENAI_INGEST_MODEL="gpt-5-mini"
```

The script uses the official OpenAI Node SDK, the Responses API, and a strict Zod schema. Do not commit API keys.

## 3. Fetch the current Dublin test set

```bash
yarn tsx scripts/ingest/cli.ts fetch dublin
```

This creates ignored/cacheable material under:

```text
scripts/ingest/cache/raw/
scripts/ingest/cache/text/
```

The source manifest is:

```text
scripts/ingest/manifests/dublin.json
```

It currently contains the five venues already on the site.

Force a fresh fetch:

```bash
yarn tsx scripts/ingest/cli.ts fetch dublin --force
```

Fetch one venue only:

```bash
yarn tsx scripts/ingest/cli.ts fetch dublin --slug keoghs-cafe
```

## 4. Run structured menu extraction

Start with one venue:

```bash
yarn tsx scripts/ingest/cli.ts run dublin --slug keoghs-cafe
```

Then inspect:

```text
scripts/ingest/output/keoghs-cafe.json
```

If that looks sane, run the batch:

```bash
yarn tsx scripts/ingest/cli.ts run dublin
```

A Markdown review report is also written to:

```text
scripts/ingest/output/dublin.md
```

Regenerate the report without making API calls:

```bash
yarn tsx scripts/ingest/cli.ts report dublin
```

## What the extractor is strict about

The prompt intentionally biases toward **missing data rather than invented data**:

- no inferred ingredients
- no inferred quantities
- no inferred tea/coffee inclusion
- paid add-ons are not marked as included
- dietary status is `null` unless explicit/unambiguous
- sample/stale/contradictory menus create warnings
- every menu item keeps its source URL
- confidence describes extraction certainty, not restaurant quality

This is important for breakfast.ie. A blank `quantity` is far better than confidently claiming there are two sausages when the menu never said so.

## Current schema

A menu item looks roughly like:

```json
{
  "name": "The Full Hubbard",
  "category": "full-irish",
  "price": { "amount": 16.95, "currency": "EUR" },
  "components": [
    { "name": "sausages", "quantity": null, "unit": null, "notes": "Clonanny Farm" },
    { "name": "bacon rashers", "quantity": null, "unit": null, "notes": null },
    { "name": "fried egg", "quantity": 1, "unit": null, "notes": null },
    { "name": "black pudding", "quantity": null, "unit": null, "notes": "Clonakilty" },
    { "name": "baked beans", "quantity": null, "unit": null, "notes": null },
    { "name": "potato bread", "quantity": null, "unit": null, "notes": "colcannon-style herbed" }
  ],
  "includedDrinks": [],
  "sourceUrl": "https://...",
  "confidence": 0.98
}
```

Notice that the menu says “sausages” but does not say how many, so the quantity is `null`.

## Next step after validation

Do **not** auto-merge AI output into the public site yet.

Once 10–20 menus have been reviewed and the schema stops changing, add an explicit approval step:

```text
candidate JSON -> reviewed JSON -> generated site data
```

That gives breakfast.ie an audit trail and makes re-running extraction safe when menus change.
