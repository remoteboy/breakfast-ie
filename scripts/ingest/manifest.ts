import { MANIFEST_DIR } from './config';
import { VenueManifestSchema, type VenueManifestEntry } from './schema';
import { readJson } from './utils';

export async function loadManifest(name: string): Promise<VenueManifestEntry[]> {
  const url = new URL(`${name}.json`, MANIFEST_DIR);
  const raw = await readJson<unknown>(url);
  return VenueManifestSchema.parse(raw);
}
