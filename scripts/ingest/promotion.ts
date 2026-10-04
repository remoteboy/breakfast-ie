import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUTPUT_DIR } from './config';
import { loadManifest } from './manifest';
import {
  VenueCandidateSchema,
  type MenuItem,
  type VenueCandidate,
} from './schema';

const SITE_MENU_OUTPUT = new URL(
  '../../src/data/generated/breakfast-menus.ts',
  import.meta.url,
);

interface PromotionOptions {
  includeStale?: boolean;
  dryRun?: boolean;
}

type ApprovableQualityStatus = 'review-required' | 'source-stale';

interface PromotionApproval {
  qualityStatuses: ApprovableQualityStatus[];
  approvedAt: string;
  expiresAt: string;
  note: string;
  sourceUrls: string[];
}

type PromotionApprovalRegistry = Record<string, PromotionApproval>;

interface PromotionVenueResult {
  slug: string;
  name: string;
  qualityStatus: VenueCandidate['quality']['status'] | 'missing';
  promotedItems: number;
  skippedReviewItems: number;
  skippedRejectedItems: number;
  promoted: boolean;
  reason: string | null;
}

interface PublishedMenuItem {
  name: MenuItem['name'];
  category: MenuItem['category'];
  section: MenuItem['section'];
  mealContext: Exclude<MenuItem['mealContext'], 'other'>;
  description: MenuItem['description'];
  price: MenuItem['price'];
  components: MenuItem['components'];
  includedDrinks: MenuItem['includedDrinks'];
  dietary: MenuItem['dietary'];
  availabilityNotes: MenuItem['availabilityNotes'];
  source: {
    url: string;
    evidence: string | null;
    confidence: number;
  };
}

interface PublishedVenueMenu {
  venueName: string;
  sourceStatus: 'publishable' | 'review-required' | 'source-stale';
  promotionApproval: {
    approvedAt: string;
    expiresAt: string;
    note: string;
    sourceUrls: string[];
  } | null;
  items: PublishedMenuItem[];
}

async function loadPromotionApprovals(
  manifestName: string,
): Promise<PromotionApprovalRegistry> {
  const url = new URL(`./promotion-approvals/${manifestName}.json`, import.meta.url);

  try {
    const raw = JSON.parse(await readFile(fileURLToPath(url), 'utf8')) as unknown;

    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      throw new Error(`Invalid promotion approvals file: ${fileURLToPath(url)}`);
    }

    return raw as PromotionApprovalRegistry;
  } catch (error) {
    if (
      error instanceof Error
      && 'code' in error
      && (error as { code?: string }).code === 'ENOENT'
    ) {
      return {};
    }
    throw error;
  }
}

function activeApproval(
  slug: string,
  candidate: VenueCandidate,
  approvals: PromotionApprovalRegistry,
) {
  const approval = approvals[slug];
  if (!approval) return null;

  if (
    candidate.quality.status !== 'review-required'
    && candidate.quality.status !== 'source-stale'
  ) {
    return null;
  }

  if (!approval.qualityStatuses.includes(candidate.quality.status)) {
    return null;
  }

  const expiry = Date.parse(`${approval.expiresAt}T23:59:59Z`);
  if (!Number.isFinite(expiry) || expiry < Date.now()) {
    return null;
  }

  return approval;
}

async function readCandidate(slug: string) {
  const url = new URL(`${slug}.json`, OUTPUT_DIR);
  try {
    const raw = JSON.parse(await readFile(fileURLToPath(url), 'utf8'));
    return VenueCandidateSchema.parse(raw);
  } catch (error) {
    if (
      error instanceof Error
      && 'code' in error
      && (error as { code?: string }).code === 'ENOENT'
    ) {
      return null;
    }
    throw error;
  }
}

function acceptedItems(candidate: VenueCandidate): PublishedMenuItem[] {
  const acceptedIndexes = new Set(
    candidate.quality.items
      .filter((item) => item.decision === 'accept')
      .map((item) => item.index),
  );

  return candidate.menuItems.flatMap((item, index) => {
    if (!acceptedIndexes.has(index)) return [];
    if (item.mealContext === 'other') return [];

    return [{
      name: item.name,
      category: item.category,
      section: item.section,
      mealContext: item.mealContext,
      description: item.description,
      price: item.price,
      components: item.components,
      includedDrinks: item.includedDrinks,
      dietary: item.dietary,
      availabilityNotes: item.availabilityNotes,
      source: {
        url: item.sourceUrl,
        evidence: item.evidence,
        confidence: item.confidence,
      },
    } satisfies PublishedMenuItem];
  });
}

function promotionEligibility(
  candidate: VenueCandidate,
  options: PromotionOptions,
  approval: PromotionApproval | null,
) {
  if (candidate.quality.status === 'publishable') {
    return { promote: true, reason: null };
  }

  if (approval) {
    return {
      promote: true,
      reason: `Manually approved through ${approval.expiresAt}: ${approval.note}`,
    };
  }

  if (candidate.quality.status === 'source-stale' && options.includeStale) {
    return {
      promote: true,
      reason: 'Included with --include-stale; verify prices/availability before publishing.',
    };
  }

  if (candidate.quality.status === 'source-stale') {
    return {
      promote: false,
      reason: 'Source is stale/sample data and has no active promotion approval.',
    };
  }

  if (candidate.quality.status === 'review-required') {
    return {
      promote: false,
      reason: 'Venue has accepted items but no active promotion approval for review-required output.',
    };
  }

  return {
    promote: false,
    reason: 'Source is too thin for promotion.',
  };
}

function renderGeneratedModule(data: Record<string, PublishedVenueMenu>) {
  return `// AUTO-GENERATED by scripts/ingest/cli.ts promote.\n`
    + `// Do not edit this file by hand; change ingestion/review data and regenerate it.\n\n`
    + `export const breakfastMenus = ${JSON.stringify(data, null, 2)} as const;\n\n`
    + `export type BreakfastMenuSlug = keyof typeof breakfastMenus;\n`;
}

function renderPromotionMarkdown(
  manifestName: string,
  results: PromotionVenueResult[],
  includeStale: boolean,
) {
  const promoted = results.filter((result) => result.promoted);
  const skipped = results.filter((result) => !result.promoted);
  const itemCount = promoted.reduce((total, result) => total + result.promotedItems, 0);

  const lines = [
    `# breakfast.ie promotion report: ${manifestName}`,
    '',
    `Mode: ${includeStale ? 'publishable + manually allowed stale sources' : 'strict publishable only'}`,
    '',
    `Promoted venues: **${promoted.length}**`,
    `Promoted menu items: **${itemCount}**`,
    `Skipped venues: **${skipped.length}**`,
    '',
    '## Promoted',
    '',
  ];

  if (!promoted.length) {
    lines.push('_None._', '');
  } else {
    for (const result of promoted) {
      lines.push(
        `- **${result.name}** — ${result.promotedItems} item(s) · ${result.qualityStatus}${result.reason ? ` · ${result.reason}` : ''}`,
      );
    }
    lines.push('');
  }

  lines.push('## Skipped', '');
  if (!skipped.length) {
    lines.push('_None._', '');
  } else {
    for (const result of skipped) {
      lines.push(
        `- **${result.name}** — ${result.qualityStatus}: ${result.reason ?? 'not eligible'}`,
      );
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

export async function promoteManifest(
  manifestName: string,
  options: PromotionOptions = {},
) {
  const manifest = await loadManifest(manifestName);
  const approvals = await loadPromotionApprovals(manifestName);
  const published: Record<string, PublishedVenueMenu> = {};
  const results: PromotionVenueResult[] = [];

  for (const venue of manifest) {
    const candidate = await readCandidate(venue.slug);

    if (!candidate) {
      results.push({
        slug: venue.slug,
        name: venue.name,
        qualityStatus: 'missing',
        promotedItems: 0,
        skippedReviewItems: 0,
        skippedRejectedItems: 0,
        promoted: false,
        reason: 'No candidate JSON exists (usually a blocked/failed source).',
      });
      continue;
    }

    const accepted = acceptedItems(candidate);
    const approval = activeApproval(venue.slug, candidate, approvals);
    const approvedSources = approval ? new Set(approval.sourceUrls) : null;
    const sourceLockedApproval = approval && accepted.every(
      (item) => approvedSources?.has(item.source.url),
    )
      ? approval
      : null;
    const eligibility = promotionEligibility(
      candidate,
      options,
      sourceLockedApproval,
    );
    const reviewItems = candidate.quality.items.filter(
      (item) => item.decision === 'review',
    ).length;
    const rejectedItems = candidate.quality.items.filter(
      (item) => item.decision === 'reject',
    ).length;

    if (!eligibility.promote || accepted.length === 0) {
      results.push({
        slug: venue.slug,
        name: venue.name,
        qualityStatus: candidate.quality.status,
        promotedItems: 0,
        skippedReviewItems: reviewItems,
        skippedRejectedItems: rejectedItems,
        promoted: false,
        reason: accepted.length === 0
          ? 'No accepted menu items are available for promotion.'
          : eligibility.reason,
      });
      continue;
    }

    published[venue.slug] = {
      venueName: venue.name,
      sourceStatus: candidate.quality.status as PublishedVenueMenu['sourceStatus'],
      promotionApproval: sourceLockedApproval
        ? {
            approvedAt: sourceLockedApproval.approvedAt,
            expiresAt: sourceLockedApproval.expiresAt,
            note: sourceLockedApproval.note,
            sourceUrls: sourceLockedApproval.sourceUrls,
          }
        : null,
      items: accepted,
    };

    results.push({
      slug: venue.slug,
      name: venue.name,
      qualityStatus: candidate.quality.status,
      promotedItems: accepted.length,
      skippedReviewItems: reviewItems,
      skippedRejectedItems: rejectedItems,
      promoted: true,
      reason: eligibility.reason,
    });
  }

  const generatedAt = new Date().toISOString();
  const summary = {
    generatedAt,
    manifest: manifestName,
    includeStale: options.includeStale ?? false,
    activeApprovals: Object.keys(approvals).length,
    promotedVenues: results.filter((result) => result.promoted).length,
    promotedItems: results
      .filter((result) => result.promoted)
      .reduce((total, result) => total + result.promotedItems, 0),
    venues: results,
  };

  if (!options.dryRun) {
    const sitePath = fileURLToPath(SITE_MENU_OUTPUT);
    await mkdir(dirname(sitePath), { recursive: true });
    await writeFile(sitePath, renderGeneratedModule(published), 'utf8');

    const summaryUrl = new URL(`${manifestName}-promotion.json`, OUTPUT_DIR);
    const reportUrl = new URL(`${manifestName}-promotion.md`, OUTPUT_DIR);
    await mkdir(dirname(fileURLToPath(summaryUrl)), { recursive: true });
    await writeFile(
      fileURLToPath(summaryUrl),
      `${JSON.stringify(summary, null, 2)}\n`,
      'utf8',
    );
    await writeFile(
      fileURLToPath(reportUrl),
      renderPromotionMarkdown(manifestName, results, options.includeStale ?? false),
      'utf8',
    );
  }

  return summary;
}
