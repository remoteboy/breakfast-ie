import { readFile } from "node:fs/promises";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { DEFAULT_MODEL } from "./config";
import {
  VenueExtractionSchema,
  type FetchedDocument,
  type VenueManifestEntry,
} from "./schema";
import { prepareRelevantText } from "./relevance";

const INSTRUCTIONS = `You extract structured breakfast menu information for breakfast.ie, an Irish breakfast directory.

Rules:
- Use ONLY facts explicitly present in the supplied source text.
- Never invent an ingredient, quantity, price, drink inclusion, dietary status, or service time.
- If a quantity is not explicit, use null.
- A drink is included only when the source explicitly says it is included in the dish price.
- Do not treat an optional paid add-on as included.
- Preserve menu item names closely, but normalize obvious whitespace/punctuation.
- Components should be food/drink components that make the item useful for comparison.
- Do not explode sauces or minor garnishes into components unless materially useful.
- Prices are EUR when shown with € or clearly presented on an Irish menu.

DIETARY CLASSIFICATION:
- If the item name or description explicitly says "vegetarian", set vegetarian to true.
- If the item name or description explicitly says "vegan", set vegan to true.
- A vegan item may also be normalized as vegetarian: true.
- Do not infer vegetarian or vegan status merely from apparent ingredients.
- Set dietary flags to null when the source does not establish them.

CATEGORIES:
- "Full Irish Breakfast" => full-irish.
- Vegetarian or vegan variants of an Irish fry/breakfast plate => irish-breakfast.
- Breakfast bap/roll => breakfast-roll.
- Do not classify based on ingredients that are not present in the source.

OTHER:
- confidence measures extraction certainty from the source, not venue quality.
- sourceUrl must be one of the supplied source URLs.
- summary must be a neutral one-line factual description, or null.
- Put contradictions, stale/sample-menu caveats, or ambiguous wording in warnings.
- evidence should be the shortest source phrase that directly supports
  the item extraction, usually the menu item name and price.
- Do not copy long source passages.
`;

export async function extractVenueWithAi(
  venue: VenueManifestEntry,
  documents: FetchedDocument[],
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Run fetch-only or export the key before AI extraction.",
    );
  }

  const client = new OpenAI();
  const sections = await Promise.all(
    documents.map(async (document) => {
      const raw = await readFile(document.textPath, "utf8");
      return `SOURCE: ${document.source.label}\nURL: ${document.source.url}\nKIND: ${document.source.kind}\n\n${prepareRelevantText(raw)}`;
    }),
  );

  const input = `VENUE: ${venue.name}\nSLUG: ${venue.slug}\nCITY: ${venue.city}\n\n${sections.join("\n\n==============================\n\n")}`;

  const response = await client.responses.parse({
    model: DEFAULT_MODEL,
    instructions: INSTRUCTIONS,
    input,
    text: {
      format: zodTextFormat(VenueExtractionSchema, "breakfast_menu_extraction"),
    },
  });

  if (!response.output_parsed) {
    throw new Error(
      `No parsed structured output for ${venue.slug} (status: ${response.status})`,
    );
  }

  const allowedSourceUrls = new Set(venue.sources.map((source) => source.url));

  for (const item of response.output_parsed.menuItems) {
    if (!allowedSourceUrls.has(item.sourceUrl)) {
      throw new Error(
        `AI returned unexpected sourceUrl for ${venue.slug}: ${item.sourceUrl}`,
      );
    }
  }

  return {
    ...response.output_parsed,
    slug: venue.slug,
    venueName: venue.name,
  };
}
