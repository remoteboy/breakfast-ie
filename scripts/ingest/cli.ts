import { fileURLToPath } from 'node:url';
import { OUTPUT_DIR } from './config';
import { fetchVenue } from './fetch';
import { extractVenueWithAi } from './ai';
import { loadManifest } from './manifest';
import { writeReport } from './report';
import { ensureDir, writeJson } from './utils';

function parseArgs(argv: string[]) {
  const [command = 'help', manifestName = 'dublin', ...rest] = argv;
  const slugIndex = rest.indexOf('--slug');
  const slug = slugIndex >= 0 ? rest[slugIndex + 1] : undefined;
  return {
    command,
    manifestName,
    slug,
    force: rest.includes('--force'),
  };
}

function help() {
  console.log(`breakfast.ie ingestion toolkit

Commands:
  fetch <manifest> [--slug slug] [--force]
      Fetch/cache first-party source pages and extract plain text.

  run <manifest> [--slug slug] [--force]
      Fetch sources, then run structured AI menu extraction.

  report <manifest>
      Generate a Markdown review report from extracted candidates.

Examples:
  yarn tsx scripts/ingest/cli.ts fetch dublin
  yarn tsx scripts/ingest/cli.ts run dublin --slug keoghs-cafe
  yarn tsx scripts/ingest/cli.ts run dublin
  yarn tsx scripts/ingest/cli.ts report dublin
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === 'help' || args.command === '--help' || args.command === '-h') {
    help();
    return;
  }

  const manifest = await loadManifest(args.manifestName);
  const venues = args.slug ? manifest.filter((venue) => venue.slug === args.slug) : manifest;

  if (args.slug && venues.length === 0) {
    throw new Error(`No venue named ${args.slug} in manifest ${args.manifestName}`);
  }

  if (args.command === 'report') {
    const path = await writeReport(args.manifestName, venues);
    console.log(`Wrote ${path}`);
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
    const outputUrl = new URL(`${venue.slug}.json`, OUTPUT_DIR);
    await writeJson(outputUrl, extraction);
    console.log(`  extracted ${extraction.menuItems.length} breakfast item(s)`);
    console.log(`  wrote ${fileURLToPath(outputUrl)}`);
  }

  if (args.command === 'run' && !args.slug) {
    const path = await writeReport(args.manifestName, venues);
    console.log(`\nReview report: ${path}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
