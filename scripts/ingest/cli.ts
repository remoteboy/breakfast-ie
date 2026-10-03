import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { OUTPUT_DIR } from './config';
import { fetchVenue } from './fetch';
import { extractVenueWithAi } from './ai';
import { loadManifest } from './manifest';
import { assessVenueExtraction } from './quality';
import { promoteManifest } from './promotion';
import { writeReport } from './report';
import type { Source, VenueManifestEntry } from './schema';
import { ensureDir, writeJson } from './utils';

interface BatchFailure {
  slug: string;
  name: string;
  error: string;
  sourceErrors: Array<{
    label: string;
    url: string;
    error: string;
  }>;
  updatedAt: string;
}

type QualityStatus =
  | 'publishable'
  | 'review-required'
  | 'source-too-thin'
  | 'source-stale'
  | 'source-blocked'
  | 'failed';

interface BatchResult {
  slug: string;
  name: string;
  status: 'success' | 'partial' | 'failed';
  qualityStatus: QualityStatus;
  sourcesConfigured: number;
  sourcesFetched: number;
  sourceErrors: Array<{
    label: string;
    url: string;
    error: string;
  }>;
  menuItems: number | null;
  publishableItems: number | null;
  reviewItems: number | null;
  rejectedItems: number | null;
  error: string | null;
}

function optionValue(rest: string[], name: string) {
  const index = rest.indexOf(name);
  return index >= 0 ? rest[index + 1] : undefined;
}

function integerOption(rest: string[], name: string, fallback?: number) {
  const raw = optionValue(rest, name);
  if (raw === undefined) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
}

function parseArgs(argv: string[]) {
  const [command = 'help', manifestName = 'dublin', ...rest] = argv;
  return {
    command,
    manifestName,
    slug: optionValue(rest, '--slug'),
    force: rest.includes('--force'),
    offset: integerOption(rest, '--offset', 0) ?? 0,
    limit: integerOption(rest, '--limit'),
    includeStale: rest.includes('--include-stale'),
    dryRun: rest.includes('--dry-run'),
  };
}

function selectVenues(
  manifest: VenueManifestEntry[],
  args: ReturnType<typeof parseArgs>,
) {
  if (args.slug) {
    const venue = manifest.find((candidate) => candidate.slug === args.slug);
    if (!venue) {
      throw new Error(`No venue named ${args.slug} in manifest ${args.manifestName}`);
    }
    return [venue];
  }

  const end = args.limit === undefined ? undefined : args.offset + args.limit;
  return manifest.slice(args.offset, end);
}

function help() {
  console.log(`breakfast.ie ingestion toolkit

Commands:
  fetch <manifest> [--slug slug] [--offset n] [--limit n] [--force]
      Fetch/cache first-party source pages and extract plain text.

  run <manifest> [--slug slug] [--offset n] [--limit n] [--force]
      Fetch sources, run structured AI extraction, then apply the quality gate.
      Stops on first venue error.

  batch <manifest> [--offset n] [--limit n] [--force]
      Batch extraction that continues after venue/source failures.
      Writes candidate JSON, quality status, batch summary and failure registry.

  report <manifest> [--offset n] [--limit n]
      Generate a Markdown review report from quality-gated candidates.

  promote <manifest> [--include-stale] [--dry-run]
      Export quality-approved menu items to src/data/generated/breakfast-menus.ts.
      Strict mode promotes only venues with qualityStatus=publishable.

Examples:
  yarn tsx scripts/ingest/cli.ts run dublin --slug keoghs-cafe
  yarn tsx scripts/ingest/cli.ts batch dublin --limit 10
  yarn tsx scripts/ingest/cli.ts batch dublin --offset 10 --limit 10
  yarn tsx scripts/ingest/cli.ts report dublin
  yarn tsx scripts/ingest/cli.ts promote dublin --dry-run
  yarn tsx scripts/ingest/cli.ts promote dublin
`);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function failedQualityStatus(sourceErrors: BatchResult['sourceErrors']): QualityStatus {
  if (
    sourceErrors.length > 0 &&
    sourceErrors.every((sourceError) => /\b(401|403)\b/.test(sourceError.error))
  ) {
    return 'source-blocked';
  }
  return 'failed';
}

async function loadFailureRegistry(manifestName: string) {
  const url = new URL(`${manifestName}-failures.json`, OUTPUT_DIR);
  try {
    const raw = JSON.parse(await readFile(fileURLToPath(url), 'utf8')) as BatchFailure[];
    return new Map(raw.map((failure) => [failure.slug, failure]));
  } catch {
    return new Map<string, BatchFailure>();
  }
}

async function loadBatchSummary(manifestName: string) {
  const url = new URL(`${manifestName}-batch-latest.json`, OUTPUT_DIR);
  try {
    const raw = JSON.parse(await readFile(fileURLToPath(url), 'utf8')) as {
      venues?: BatchResult[];
    };
    const currentSchemaResults = (raw.venues ?? []).filter(
      (result) => typeof result.qualityStatus === 'string',
    );
    return new Map(currentSchemaResults.map((result) => [result.slug, result]));
  } catch {
    return new Map<string, BatchResult>();
  }
}

async function runBatch(
  manifestName: string,
  venues: VenueManifestEntry[],
  force: boolean,
  reportVenues: VenueManifestEntry[],
) {
  await ensureDir(OUTPUT_DIR);

  const results: BatchResult[] = [];
  const failureRegistry = await loadFailureRegistry(manifestName);
  const batchRegistry = await loadBatchSummary(manifestName);

  for (const venue of venues) {
    console.log(`\n→ ${venue.name}`);
    const sourceErrors: BatchResult['sourceErrors'] = [];

    try {
      const documents = await fetchVenue(venue, {
        force,
        bestEffort: true,
        onSourceError(source: Source, error: Error) {
          sourceErrors.push({
            label: source.label,
            url: source.url,
            error: error.message,
          });
          console.warn(`  source failed: ${source.label}: ${error.message}`);
        },
      });

      console.log(`  fetched ${documents.length}/${venue.sources.length} source(s)`);

      const extraction = await extractVenueWithAi(venue, documents);
      const quality = assessVenueExtraction(venue, extraction, sourceErrors);
      const candidate = { ...extraction, quality };
      const outputUrl = new URL(`${venue.slug}.json`, OUTPUT_DIR);
      await writeJson(outputUrl, candidate);

      console.log(
        `  extracted ${extraction.menuItems.length} item(s): ` +
        `${quality.publishableItems} accepted, ${quality.reviewItems} review, ${quality.rejectedItems} rejected`,
      );
      console.log(`  quality: ${quality.status}`);
      console.log(`  wrote ${fileURLToPath(outputUrl)}`);

      const status = sourceErrors.length ? 'partial' : 'success';
      results.push({
        slug: venue.slug,
        name: venue.name,
        status,
        qualityStatus: quality.status,
        sourcesConfigured: venue.sources.length,
        sourcesFetched: documents.length,
        sourceErrors,
        menuItems: extraction.menuItems.length,
        publishableItems: quality.publishableItems,
        reviewItems: quality.reviewItems,
        rejectedItems: quality.rejectedItems,
        error: null,
      });

      if (sourceErrors.length) {
        failureRegistry.set(venue.slug, {
          slug: venue.slug,
          name: venue.name,
          error: 'One or more configured sources failed, but extraction completed from remaining sources.',
          sourceErrors,
          updatedAt: new Date().toISOString(),
        });
      } else {
        failureRegistry.delete(venue.slug);
      }
    } catch (error) {
      const message = errorMessage(error);
      console.error(`  failed: ${message}`);

      results.push({
        slug: venue.slug,
        name: venue.name,
        status: 'failed',
        qualityStatus: failedQualityStatus(sourceErrors),
        sourcesConfigured: venue.sources.length,
        sourcesFetched: Math.max(0, venue.sources.length - sourceErrors.length),
        sourceErrors,
        menuItems: null,
        publishableItems: null,
        reviewItems: null,
        rejectedItems: null,
        error: message,
      });

      failureRegistry.set(venue.slug, {
        slug: venue.slug,
        name: venue.name,
        error: message,
        sourceErrors,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  for (const result of results) {
    batchRegistry.set(result.slug, result);
  }

  const manifestOrder = new Map(reportVenues.map((venue, index) => [venue.slug, index]));
  const mergedResults = [...batchRegistry.values()].sort(
    (a, b) => (manifestOrder.get(a.slug) ?? 9999) - (manifestOrder.get(b.slug) ?? 9999),
  );

  const batchSummaryUrl = new URL(`${manifestName}-batch-latest.json`, OUTPUT_DIR);
  await writeJson(batchSummaryUrl, {
    generatedAt: new Date().toISOString(),
    manifest: manifestName,
    venues: mergedResults,
  });

  const failuresUrl = new URL(`${manifestName}-failures.json`, OUTPUT_DIR);
  await writeJson(
    failuresUrl,
    [...failureRegistry.values()].sort((a, b) => a.name.localeCompare(b.name)),
  );

  const reportPath = await writeReport(manifestName, reportVenues);

  const successful = mergedResults.filter((result) => result.status === 'success').length;
  const partial = mergedResults.filter((result) => result.status === 'partial').length;
  const failed = mergedResults.filter((result) => result.status === 'failed').length;

  const qualityCounts = mergedResults.reduce<Record<string, number>>((counts, result) => {
    counts[result.qualityStatus] = (counts[result.qualityStatus] ?? 0) + 1;
    return counts;
  }, {});

  console.log(`\nAccumulated batch: ${successful} success, ${partial} partial, ${failed} failed`);
  console.log(
    `Quality: ${Object.entries(qualityCounts).map(([status, count]) => `${status}=${count}`).join(', ')}`,
  );
  console.log(`Batch summary: ${fileURLToPath(batchSummaryUrl)}`);
  console.log(`Failure registry: ${fileURLToPath(failuresUrl)}`);
  console.log(`Review report: ${reportPath}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === 'help' || args.command === '--help' || args.command === '-h') {
    help();
    return;
  }

  if (args.command === 'promote') {
    const summary = await promoteManifest(args.manifestName, {
      includeStale: args.includeStale,
      dryRun: args.dryRun,
    });
    console.log(
      `${args.dryRun ? 'Would promote' : 'Promoted'} ${summary.promotedVenues} venue(s) / ${summary.promotedItems} menu item(s)`,
    );
    if (args.includeStale) {
      console.log('Included source-stale venues; verify their prices/availability manually before committing generated data.');
    }
    return;
  }

  const manifest = await loadManifest(args.manifestName);
  const venues = selectVenues(manifest, args);

  if (args.command === 'report') {
    const path = await writeReport(args.manifestName, venues);
    console.log(`Wrote ${path}`);
    return;
  }

  if (args.command === 'batch') {
    await runBatch(args.manifestName, venues, args.force, manifest);
    return;
  }

  if (!['fetch', 'run'].includes(args.command)) {
    help();
    process.exitCode = 1;
    return;
  }

  await ensureDir(OUTPUT_DIR);

  for (const venue of venues) {
    console.log(`\n→ ${venue.name}`);
    const documents = await fetchVenue(venue, { force: args.force });
    console.log(`  fetched ${documents.length} source(s)`);

    if (args.command === 'fetch') continue;

    const extraction = await extractVenueWithAi(venue, documents);
    const quality = assessVenueExtraction(venue, extraction);
    const candidate = { ...extraction, quality };
    const outputUrl = new URL(`${venue.slug}.json`, OUTPUT_DIR);
    await writeJson(outputUrl, candidate);
    console.log(
      `  extracted ${extraction.menuItems.length} item(s): ` +
      `${quality.publishableItems} accepted, ${quality.reviewItems} review, ${quality.rejectedItems} rejected`,
    );
    console.log(`  quality: ${quality.status}`);
    console.log(`  wrote ${fileURLToPath(outputUrl)}`);
  }

  if (args.command === 'run' && !args.slug) {
    const path = await writeReport(args.manifestName, manifest);
    console.log(`\nReview report: ${path}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
