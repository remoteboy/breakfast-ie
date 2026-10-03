import { readFile } from 'node:fs/promises';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { DEFAULT_MODEL } from './config';
import { EXTRACTION_INSTRUCTIONS } from './prompts';
import {
  VenueExtractionSchema,
  type FetchedDocument,
  type VenueManifestEntry,
} from './schema';
import { prepareRelevantText } from './relevance';
import { normalizeVenueExtraction } from './normalize';

export async function extractVenueWithAi(
  venue: VenueManifestEntry,
  documents: FetchedDocument[],
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Run fetch-only or export the key before AI extraction.');
  }

  const client = new OpenAI();
  const sections = await Promise.all(
    documents.map(async (document) => {
      const raw = await readFile(document.textPath, 'utf8');
      return [
        `SOURCE: ${document.source.label}`,
        `URL: ${document.source.url}`,
        `KIND: ${document.source.kind}`,
        '',
        prepareRelevantText(raw),
      ].join('\n');
    }),
  );

  const input = `VENUE: ${venue.name}\nSLUG: ${venue.slug}\nCITY: ${venue.city}\n\n${sections.join('\n\n==============================\n\n')}`;

  const response = await client.responses.parse({
    model: DEFAULT_MODEL,
    instructions: EXTRACTION_INSTRUCTIONS,
    input,
    text: {
      format: zodTextFormat(VenueExtractionSchema, 'breakfast_menu_extraction'),
    },
  });

  if (!response.output_parsed) {
    throw new Error(`No parsed structured output for ${venue.slug} (status: ${response.status})`);
  }

  const allowedSourceUrls = new Set(venue.sources.map((source) => source.url));

  for (const item of response.output_parsed.menuItems) {
    if (!allowedSourceUrls.has(item.sourceUrl)) {
      throw new Error(
        `AI returned unexpected sourceUrl for ${venue.slug}: ${item.sourceUrl}`,
      );
    }
  }

  return normalizeVenueExtraction({
    ...response.output_parsed,
    slug: venue.slug,
    venueName: venue.name,
  });
}
