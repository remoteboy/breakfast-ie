import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { OUTPUT_DIR } from './config';
import {
  VenueCandidateSchema,
  type VenueCandidate,
  type VenueManifestEntry,
} from './schema';
import { ensureDir } from './utils';

export async function loadExtraction(slug: string): Promise<VenueCandidate | null> {
  try {
    const url = new URL(`${slug}.json`, OUTPUT_DIR);
    return VenueCandidateSchema.parse(JSON.parse(await readFile(fileURLToPath(url), 'utf8')));
  } catch {
    return null;
  }
}

function decisionFor(candidate: VenueCandidate, index: number) {
  return candidate.quality.items.find((item) => item.index === index)?.decision ?? 'review';
}

function decisionIcon(decision: 'accept' | 'review' | 'reject') {
  if (decision === 'accept') return '✓';
  if (decision === 'review') return '△';
  return '✗';
}

export async function writeReport(manifestName: string, venues: VenueManifestEntry[]) {
  await ensureDir(OUTPUT_DIR);

  const lines = [
    `# breakfast.ie ingestion report: ${manifestName}`,
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    'Legend: ✓ accepted · △ manual review · ✗ rejected by quality gate',
    '',
  ];

  for (const venue of venues) {
    const candidate = await loadExtraction(venue.slug);
    lines.push(`## ${venue.name}`);
    lines.push('');

    if (!candidate) {
      lines.push('_No extraction yet._', '');
      continue;
    }

    lines.push(`Quality: **${candidate.quality.status}**`);
    lines.push(
      `Accepted: **${candidate.quality.publishableItems}** · Review: **${candidate.quality.reviewItems}** · Rejected: **${candidate.quality.rejectedItems}**`,
      '',
    );

    if (candidate.quality.reasons.length) {
      lines.push('**Quality notes**');
      candidate.quality.reasons.forEach((reason) => lines.push(`- ${reason}`));
      lines.push('');
    }

    if (candidate.summary) lines.push(candidate.summary, '');
    lines.push(`Extracted items: **${candidate.menuItems.length}**`, '');

    for (const [index, item] of candidate.menuItems.entries()) {
      const decision = decisionFor(candidate, index);
      const assessment = candidate.quality.items.find((entry) => entry.index === index);
      const price = item.price ? ` — €${item.price.amount.toFixed(2)}` : '';
      lines.push(
        `- ${decisionIcon(decision)} **${item.name}**${price} (${Math.round(item.confidence * 100)}%)`,
      );
      lines.push(
        `  - Context: ${item.mealContext}${item.section ? ` · ${item.section}` : ''}${item.seasonal ? ' · seasonal' : ''}`,
      );
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
      if (item.evidence) {
        lines.push(`  - Evidence: ${item.evidence}`);
      }
      lines.push(`  - Source: ${item.sourceUrl}`);
      if (assessment?.reasons.length) {
        assessment.reasons.forEach((reason) => lines.push(`  - Gate: ${reason}`));
      }
    }

    if (candidate.warnings.length) {
      lines.push('', '**Extraction warnings**');
      candidate.warnings.forEach((warning) => lines.push(`- ${warning}`));
    }

    lines.push('');
  }

  const reportUrl = new URL(`${manifestName}.md`, OUTPUT_DIR);
  await writeFile(fileURLToPath(reportUrl), `${lines.join('\n')}\n`, 'utf8');
  return fileURLToPath(reportUrl);
}
