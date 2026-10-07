import type { APIRoute } from 'astro';
import places from '../data/places';
import { getVenueEnrichment } from '../lib/enrichment';
import { getPublishedTaxonomyPages } from '../lib/taxonomy';
import type { Place } from '../types/place';

const SITE_URL = 'https://breakfast.ie';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const getPlaceLastmod = (place: Place): string | null => {
  const enrichmentCheckedAt = getVenueEnrichment(place)?.checkedAt;
  const placeCheckedAt = place.verification.checkedAt;

  return enrichmentCheckedAt && (!placeCheckedAt || enrichmentCheckedAt > placeCheckedAt)
    ? enrichmentCheckedAt
    : placeCheckedAt;
};

const latestLastmod = (collection: readonly Place[]): string | null => {
  const dates = collection
    .map(getPlaceLastmod)
    .filter((value): value is string => value !== null)
    .sort();

  return dates.at(-1) ?? null;
};

export const GET: APIRoute = () => {
  const dublinPlaces = places.filter((place) => place.location.city === 'Dublin');
  const taxonomyPages = getPublishedTaxonomyPages(places);
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: null },
    { loc: `${SITE_URL}/dublin/`, lastmod: latestLastmod(dublinPlaces) },
    ...taxonomyPages.map((page) => ({
      loc: `${SITE_URL}${page.href}`,
      lastmod: latestLastmod(page.places),
    })),
    ...places.map((place) => ({
      loc: `${SITE_URL}/places/${place.slug}/`,
      lastmod: getPlaceLastmod(place),
    })),
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
