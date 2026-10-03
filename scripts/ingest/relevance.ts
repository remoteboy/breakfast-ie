import { MAX_MODEL_CHARACTERS } from './config';

const KEYWORDS = [
  'breakfast',
  'brunch',
  'full irish',
  'irish breakfast',
  'sausage',
  'rasher',
  'bacon',
  'egg',
  'pudding',
  'beans',
  'toast',
  'potato',
  'hash brown',
  'tea',
  'coffee',
  'porridge',
  'granola',
  'pancake',
  'omelette',
  '€',
  'eur',
];

export function prepareRelevantText(text: string): string {
  if (text.length <= MAX_MODEL_CHARACTERS) return text;

  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const selected = new Set<number>();

  for (let i = 0; i < lines.length; i += 1) {
    const lower = lines[i].toLowerCase();
    if (KEYWORDS.some((keyword) => lower.includes(keyword))) {
      for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 3); j += 1) {
        selected.add(j);
      }
    }
  }

  const focused = [...selected]
    .sort((a, b) => a - b)
    .map((index) => lines[index])
    .join('\n');

  // If keyword extraction produced too little context, include the top of the page too.
  const prefix = text.slice(0, 8_000);
  return `${prefix}\n\n--- BREAKFAST-RELEVANT EXCERPTS ---\n${focused}`
    .slice(0, MAX_MODEL_CHARACTERS);
}
