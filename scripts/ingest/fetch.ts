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

function requestUrlFor(sourceUrl: string) {
  const url = new URL(sourceUrl);

  if (url.hostname === 'drive.google.com') {
    const match = url.pathname.match(/^\/file\/d\/([^/]+)\//);
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(match[1])}`;
    }
  }

  return sourceUrl;
}

function looksLikePdf(bytes: Uint8Array) {
  return bytes.length >= 5
    && bytes[0] === 0x25
    && bytes[1] === 0x50
    && bytes[2] === 0x44
    && bytes[3] === 0x46
    && bytes[4] === 0x2d;
}

export interface FetchVenueOptions {
  force?: boolean;
  bestEffort?: boolean;
  onSourceError?: (source: Source, error: Error) => void;
}

function asError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

export async function fetchVenue(
  venue: VenueManifestEntry,
  options: FetchVenueOptions = {},
): Promise<FetchedDocument[]> {
  if (!options.bestEffort) {
    return Promise.all(venue.sources.map((source) => fetchSource(venue.slug, source, options)));
  }

  const results = await Promise.allSettled(
    venue.sources.map((source) => fetchSource(venue.slug, source, options)),
  );

  const documents: FetchedDocument[] = [];
  const errors: Error[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      documents.push(result.value);
      return;
    }

    const error = asError(result.reason);
    errors.push(error);
    options.onSourceError?.(venue.sources[index], error);
  });

  if (documents.length === 0) {
    throw new AggregateError(errors, `All sources failed for ${venue.name}`);
  }

  return documents;
}

async function fetchSource(
  slug: string,
  source: Source,
  options: FetchVenueOptions,
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
    response = await fetch(requestUrlFor(source.url), {
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
  const responseContentType = response.headers.get('content-type') || 'application/octet-stream';
  const contentType = looksLikePdf(bytes) ? 'application/pdf' : responseContentType;
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
