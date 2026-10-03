import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  CACHE_RAW_DIR,
  CACHE_TEXT_DIR,
  REQUEST_TIMEOUT_MS,
  USER_AGENT,
} from './config';
import type { Source, VenueManifestEntry, FetchedDocument } from './schema';
import { extractText } from './extract-text';
import { ensureDir, sha256, writeJson } from './utils';

function extensionFor(contentType: string, url: string) {
  if (contentType.includes('pdf') || url.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'html';
}

export async function fetchVenue(
  venue: VenueManifestEntry,
  options: { force?: boolean } = {},
): Promise<FetchedDocument[]> {
  return Promise.all(venue.sources.map((source) => fetchSource(venue.slug, source, options)));
}

async function fetchSource(
  slug: string,
  source: Source,
  options: { force?: boolean },
): Promise<FetchedDocument> {
  await ensureDir(CACHE_RAW_DIR);
  await ensureDir(CACHE_TEXT_DIR);

  const sourceKey = sha256(source.url).slice(0, 12);
  const metadataUrl = new URL(`${slug}--${sourceKey}.json`, CACHE_TEXT_DIR);

  if (!options.force) {
    try {
      return JSON.parse(await readFile(fileURLToPath(metadataUrl), 'utf8')) as FetchedDocument;
    } catch {
      // Cache miss.
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(source.url, {
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.5',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} fetching ${source.url}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const digest = sha256(bytes);
  const extension = extensionFor(contentType, source.url);
  const rawUrl = new URL(`${slug}--${sourceKey}--${digest.slice(0, 12)}.${extension}`, CACHE_RAW_DIR);
  const textUrl = new URL(`${slug}--${sourceKey}--${digest.slice(0, 12)}.txt`, CACHE_TEXT_DIR);

  await writeFile(fileURLToPath(rawUrl), bytes);
  const text = await extractText(bytes, contentType, source.url);
  await writeFile(fileURLToPath(textUrl), text, 'utf8');

  const document: FetchedDocument = {
    slug,
    source,
    fetchedAt: new Date().toISOString(),
    contentType,
    sha256: digest,
    rawPath: fileURLToPath(rawUrl),
    textPath: fileURLToPath(textUrl),
    characterCount: text.length,
  };

  await writeJson(metadataUrl, document);
  return document;
}
