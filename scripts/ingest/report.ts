import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { OUTPUT_DIR } from './config';
import { VenueExtractionSchema, type VenueExtraction, type VenueManifestEntry } from './schema';
import { ensureDir } from './utils';

export async function loadExtraction(slug: string): Promise<VenueExtraction | null> {
  try {
    const url = new URL(`${slug}.json`, OUTPUT_DIR);
    return VenueExtractionSchema.parse(JSON.parse(await readFile(fileURLToPath(url), 'utf8')));
  } catch {
    return null;
  }
}

export async function writeReport(manifestName: string, venues: VenueManifestEntry[]) {
  await ensureDir(OUTPUT_DIR);

  const lines = [
    `# breakfast.ie ingestion report: ${manifestName}`,
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
  ];

  for (const venue of venues) {
    const extraction = await loadExtraction(venue.slug);
    lines.push(`## ${venue.name}`);
    lines.push('');

    if (!extraction) {
      lines.push('_No extraction yet._', '');
      continue;
    }

    if (extraction.summary) lines.push(extraction.summary, '');
    lines.push(`Items: **${extraction.menuItems.length}**`, '');

    for (const item of extraction.menuItems) {
      const price = item.price ? ` — €${item.price.amount.toFixed(2)}` : '';
      lines.push(`- **${item.name}**${price} (${Math.round(item.confidence * 100)}%)`);
      if (item.components.length) {
        const components = item.components.map((part) => {
          const qty = part.quantity == null ? '' : `${part.quantity} × `;
          return `${qty}${part.name}`;
        });
        lines.push(`  - ${components.join(', ')}`);
      }
      if (item.includedDrinks.length) {
        lines.push(`  - Included: ${item.includedDrinks.map((drink) => drink.name).join(', ')}`);
      }
      lines.push(`  - Source: ${item.sourceUrl}`);
    }

    if (extraction.warnings.length) {
      lines.push('', '**Warnings**');
      extraction.warnings.forEach((warning) => lines.push(`- ${warning}`));
    }

    lines.push('');
  }

  const reportUrl = new URL(`${manifestName}.md`, OUTPUT_DIR);
  await writeFile(fileURLToPath(reportUrl), `${lines.join('\n')}\n`, 'utf8');
  return fileURLToPath(reportUrl);
}
