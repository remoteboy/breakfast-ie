export const INGEST_ROOT = new URL('./', import.meta.url);

export const CACHE_RAW_DIR = new URL('./cache/raw/', INGEST_ROOT);
export const CACHE_TEXT_DIR = new URL('./cache/text/', INGEST_ROOT);
export const OUTPUT_DIR = new URL('./output/', INGEST_ROOT);
export const MANIFEST_DIR = new URL('./manifests/', INGEST_ROOT);

export const USER_AGENT =
  'breakfast.ie research bot/0.2 (+https://breakfast.ie; low-volume menu verification)';

export const REQUEST_TIMEOUT_MS = 20_000;
export const MAX_MODEL_CHARACTERS = 45_000;
export const DEFAULT_MODEL = process.env.OPENAI_INGEST_MODEL || 'gpt-5.4-mini';

export const MIN_PUBLISH_CONFIDENCE = 0.75;
