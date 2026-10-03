import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function ensureDir(url: URL) {
  await mkdir(fileURLToPath(url), { recursive: true });
}

export function sha256(input: Uint8Array | string) {
  return createHash('sha256').update(input).digest('hex');
}

export async function writeJson(url: URL, value: unknown) {
  await ensureDir(new URL('./', url));
  await writeFile(fileURLToPath(url), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function readJson<T>(url: URL): Promise<T> {
  const raw = await readFile(fileURLToPath(url), 'utf8');
  return JSON.parse(raw) as T;
}

export function compactWhitespace(value: string) {
  return value
    .replace(/\r/g, '')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
