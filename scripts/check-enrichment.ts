import places from '../src/data/places';
import { venueEnrichment, type VenueEnrichment } from '../src/data/venue-enrichment';
import { getBreakfastMenuSlugs } from '../src/lib/discovery';

const placeSlugs = new Set(places.map((place) => place.slug));
const menuSlugs = new Set(getBreakfastMenuSlugs());
const errors: string[] = [];
const warnings: string[] = [];

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const enrichmentEntries = Object.entries(venueEnrichment) as [string, VenueEnrichment][];

for (const [slug, enrichment] of enrichmentEntries) {
  if (!placeSlugs.has(slug)) {
    errors.push(`${slug}: enrichment exists without a place route`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(enrichment.checkedAt)) {
    errors.push(`${slug}: checkedAt must be YYYY-MM-DD`);
  }

  if (enrichment.geo) {
    const { latitude, longitude } = enrichment.geo;
    if (latitude < 53.2 || latitude > 53.5 || longitude < -6.5 || longitude > -6.0) {
      errors.push(`${slug}: geo point is outside the expected Dublin bounds`);
    }
  }

  for (const group of [enrichment.openingHours ?? [], enrichment.breakfastHours ?? []]) {
    for (const window of group) {
      if (!timePattern.test(window.opens)) {
        errors.push(`${slug}: invalid opens time ${window.opens}`);
      }
      if (window.closes !== null && !timePattern.test(window.closes)) {
        errors.push(`${slug}: invalid closes time ${window.closes}`);
      }
      if (!window.sourceUrl.startsWith('https://')) {
        errors.push(`${slug}: service window must have an https source URL`);
      }
      if (window.days.length === 0) {
        errors.push(`${slug}: service window has no days`);
      }
    }
  }

  if (menuSlugs.has(slug) && !enrichment.breakfastHours?.length) {
    warnings.push(`${slug}: promoted menu has no detailed breakfast-hours enrichment yet`);
  }
}

const enrichedRoutes = Object.keys(venueEnrichment).filter((slug) => placeSlugs.has(slug));
const enrichmentValues = Object.values(venueEnrichment) as VenueEnrichment[];
const geocoded = enrichmentValues.filter((entry) => Boolean(entry.geo)).length;
const detailedBreakfastHours = enrichmentValues.filter(
  (entry) => (entry.breakfastHours?.length ?? 0) > 0,
).length;

console.log(`Enrichment records: ${enrichedRoutes.length}`);
console.log(`With fallback coordinates: ${geocoded}`);
console.log(`With detailed breakfast/brunch hours: ${detailedBreakfastHours}`);
console.log(`Promoted menu slugs: ${menuSlugs.size}`);

warnings.forEach((warning) => console.warn(`WARN ${warning}`));

if (errors.length > 0) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  console.log('Enrichment integrity: OK');
}
