import type { MenuItem, VenueExtraction } from './schema';

function normalizeText(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function normalizedItemName(name: string) {
  return normalizeText(name);
}

function componentSignature(item: MenuItem) {
  return item.components
    .map((part) => [
      normalizeText(part.name),
      part.quantity == null ? '' : String(part.quantity),
      normalizeText(part.unit),
    ].join(':'))
    .sort()
    .join('|');
}

function exactItemFingerprint(item: MenuItem) {
  const price = item.price ? `${item.price.amount}:${item.price.currency}` : '';
  return [
    normalizedItemName(item.name),
    price,
    componentSignature(item),
    normalizeText(item.sourceUrl),
  ].join('||');
}

export function normalizeVenueExtraction(extraction: VenueExtraction): VenueExtraction {
  const bestByFingerprint = new Map<string, MenuItem>();
  let removed = 0;

  for (const item of extraction.menuItems) {
    const key = exactItemFingerprint(item);
    const existing = bestByFingerprint.get(key);

    if (!existing) {
      bestByFingerprint.set(key, item);
      continue;
    }

    removed += 1;
    if (item.confidence > existing.confidence) {
      bestByFingerprint.set(key, item);
    }
  }

  return {
    ...extraction,
    menuItems: [...bestByFingerprint.values()],
    warnings: removed
      ? [...extraction.warnings, `Collapsed ${removed} exact duplicate menu item(s) from repeated source content.`]
      : extraction.warnings,
  };
}
