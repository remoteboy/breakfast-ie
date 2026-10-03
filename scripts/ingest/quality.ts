import { MIN_PUBLISH_CONFIDENCE } from './config';
import { normalizedItemName } from './normalize';
import type {
  MenuItem,
  VenueExtraction,
  VenueManifestEntry,
  VenueQualityAssessment,
} from './schema';

export interface SourceErrorLike {
  label: string;
  url: string;
  error: string;
}

const ALLOWED_MEAL_CONTEXTS = new Set([
  'breakfast',
  'brunch',
  'all-day-breakfast',
]);

const STALE_PATTERN = /\b(sample|older|stale|verify current|verify freshness|verify current pricing|archived|2024|2025)\b/i;
const SEASONAL_SECTION_PATTERN = /\b(festive|christmas|halloween|elves?|easter|valentine|seasonal|summer special|winter special)\b/i;
const GENERIC_SECTION_PATTERN = /^(ciabatta(?: or |\s*&\s*)wrap|sandwich(?:es)?|wraps?|toasties?|burgers?|lunch|mains?|salads?)$/i;
const BREAKFAST_CUE_PATTERN = /\b(breakfast|brekkie|brunch|egg|eggs|benedict|pancake|pancakes|waffle|waffles|porridge|granola|sausage|sausages|pudding|hash brown|hash browns|french toast|shakshuka|fry|bap|breakfast roll)\b/i;

function staleSourceReasons(venue: VenueManifestEntry, extraction: VenueExtraction) {
  const reasons: string[] = [];
  const usedUrls = new Set(extraction.menuItems.map((item) => item.sourceUrl));

  for (const source of venue.sources) {
    if (!usedUrls.has(source.url)) continue;
    if (STALE_PATTERN.test(source.label)) {
      reasons.push(`Source may be stale: ${source.label}`);
    }
  }

  for (const warning of extraction.warnings) {
    if (STALE_PATTERN.test(warning)) {
      reasons.push(`Extraction warning suggests stale/sample data: ${warning}`);
    }
  }

  return [...new Set(reasons)];
}

function itemSearchText(item: MenuItem) {
  return [
    item.name,
    item.description,
    item.evidence,
    ...item.components.map((part) => part.name),
  ].filter(Boolean).join(' ');
}

function isThinItem(item: MenuItem) {
  return item.price == null
    && item.components.length === 0
    && item.includedDrinks.length === 0;
}

function conflictingNameIndexes(extraction: VenueExtraction) {
  const groups = new Map<string, number[]>();

  extraction.menuItems.forEach((item, index) => {
    const key = normalizedItemName(item.name);
    const indexes = groups.get(key) ?? [];
    indexes.push(index);
    groups.set(key, indexes);
  });

  const conflicts = new Set<number>();
  for (const indexes of groups.values()) {
    if (indexes.length < 2) continue;

    const signatures = new Set(indexes.map((index) => {
      const item = extraction.menuItems[index];
      const price = item.price?.amount ?? null;
      const section = item.section?.toLowerCase().trim() ?? null;
      const components = item.components
        .map((part) => `${part.name.toLowerCase()}:${part.quantity ?? ''}`)
        .sort()
        .join('|');
      return JSON.stringify({ price, section, components });
    }));

    if (signatures.size > 1) {
      indexes.forEach((index) => conflicts.add(index));
    }
  }

  return conflicts;
}

export function assessVenueExtraction(
  venue: VenueManifestEntry,
  extraction: VenueExtraction,
  sourceErrors: SourceErrorLike[] = [],
): VenueQualityAssessment {
  const nameConflicts = conflictingNameIndexes(extraction);

  const items = extraction.menuItems.map((item, index) => {
    const rejectReasons: string[] = [];
    const reviewReasons: string[] = [];

    if (item.evidenceType !== 'menu') {
      rejectReasons.push(`Evidence type is ${item.evidenceType}, not menu content.`);
    }

    if (!ALLOWED_MEAL_CONTEXTS.has(item.mealContext)) {
      rejectReasons.push(`Meal context is ${item.mealContext}, not breakfast/brunch/all-day-breakfast.`);
    }

    if (item.audience === 'kids') {
      rejectReasons.push('Item belongs to a kids/children\'s menu.');
    }

    const section = item.section?.trim() ?? '';
    if (section && SEASONAL_SECTION_PATTERN.test(section)) {
      reviewReasons.push(`Item is inside a seasonal/promotional section: ${section}.`);
    }

    if (item.seasonal === true) {
      reviewReasons.push('Item is explicitly seasonal or limited-time.');
    }

    if (
      section
      && GENERIC_SECTION_PATTERN.test(section)
      && !BREAKFAST_CUE_PATTERN.test(itemSearchText(item))
    ) {
      rejectReasons.push(
        `Generic section "${section}" has no breakfast-specific evidence in the item.`,
      );
    }

    if (isThinItem(item)) {
      reviewReasons.push('Item has no price, components, or included-drink detail; source evidence is too thin for automatic publication.');
    }

    if (nameConflicts.has(index)) {
      reviewReasons.push('Another distinct extracted item has the same normalized name; possible duplicate/variant/menu-version conflict.');
    }

    if (item.confidence < MIN_PUBLISH_CONFIDENCE) {
      reviewReasons.push(
        `Confidence ${item.confidence.toFixed(2)} is below ${MIN_PUBLISH_CONFIDENCE.toFixed(2)}.`,
      );
    }

    if (!item.evidence?.trim()) {
      reviewReasons.push('No compact evidence string was returned.');
    }

    if (rejectReasons.length) {
      return {
        index,
        name: item.name,
        decision: 'reject' as const,
        reasons: rejectReasons,
      };
    }

    if (reviewReasons.length) {
      return {
        index,
        name: item.name,
        decision: 'review' as const,
        reasons: [...new Set(reviewReasons)],
      };
    }

    return {
      index,
      name: item.name,
      decision: 'accept' as const,
      reasons: [],
    };
  });

  const publishableItems = items.filter((item) => item.decision === 'accept').length;
  const reviewItems = items.filter((item) => item.decision === 'review').length;
  const rejectedItems = items.filter((item) => item.decision === 'reject').length;
  const reasons: string[] = [];

  if (sourceErrors.length) {
    reasons.push(`${sourceErrors.length} configured source(s) failed to fetch.`);
  }

  if (rejectedItems) {
    reasons.push(`${rejectedItems} extracted item(s) were rejected by the quality gate.`);
  }

  if (reviewItems) {
    reasons.push(`${reviewItems} extracted item(s) need manual review.`);
  }

  const staleReasons = staleSourceReasons(venue, extraction);
  reasons.push(...staleReasons);

  let status: VenueQualityAssessment['status'];

  if (publishableItems + reviewItems === 0) {
    status = 'source-too-thin';
    reasons.push('No breakfast/brunch menu items survived the quality gate.');
  } else if (staleReasons.length) {
    status = 'source-stale';
  } else if (sourceErrors.length || rejectedItems || reviewItems) {
    status = 'review-required';
  } else {
    status = 'publishable';
  }

  return {
    status,
    publishableItems,
    reviewItems,
    rejectedItems,
    reasons: [...new Set(reasons)],
    items,
  };
}
