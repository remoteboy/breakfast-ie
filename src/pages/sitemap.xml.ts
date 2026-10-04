import type { APIRoute } from 'astro';
import places from '../data/places';
import { getVenueEnrichment } from '../lib/enrichment';

const SITE_URL = 'https://breakfast.ie';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = () => {
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: null },
    { loc: `${SITE_URL}/dublin/`, lastmod: null },
    ...places.map((place) => {
      const enrichmentCheckedAt = getVenueEnrichment(place)?.checkedAt;
      const placeCheckedAt = place.verification.checkedAt;
      const lastmod = enrichmentCheckedAt && (!placeCheckedAt || enrichmentCheckedAt > placeCheckedAt)
        ? enrichmentCheckedAt
        : placeCheckedAt;

      return {
        loc: `${SITE_URL}/places/${place.slug}/`,
        lastmod,
      };
    }),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      ({ loc, lastmod }) =>
        `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''}\n  </url>`,
    )
    .join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
