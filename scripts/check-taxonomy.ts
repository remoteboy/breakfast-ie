import places from '../src/data/places';
import { getPlaceDiscovery } from '../src/lib/discovery';
import {
  cityDefinitions,
  getPublishedTaxonomyPages,
  getTaxonomyHref,
  getTaxonomyPlaces,
  placeMatchesTaxonomy,
  taxonomyDefinitions,
} from '../src/lib/taxonomy';

const publishedPages = getPublishedTaxonomyPages(places);
const publishedByHref = new Map(publishedPages.map((page) => [page.href, page]));
const errors: string[] = [];

if (publishedByHref.size !== publishedPages.length) {
  errors.push('Duplicate taxonomy URLs detected.');
}

for (const city of cityDefinitions) {
  const cityPlaces = places.filter((place) => place.location.city === city.placeCity);
  console.log(`\n${city.name}: ${cityPlaces.length} directory places`);

  for (const taxonomy of taxonomyDefinitions) {
    const matchingPlaces = getTaxonomyPlaces(places, city, taxonomy);
    const menuBackedCount = matchingPlaces.filter(
      (place) => getPlaceDiscovery(place).menuAvailable,
    ).length;
    const href = getTaxonomyHref(city, taxonomy);
    const published = publishedByHref.has(href);
    const shouldPublish = matchingPlaces.length >= taxonomy.minimumPlaces;

    console.log(
      `${published ? '✓' : '·'} ${href} ${matchingPlaces.length} places · ${menuBackedCount} verified menus`,
    );

    if (published !== shouldPublish) {
      errors.push(
        `${href}: publish state does not match the ${taxonomy.minimumPlaces}-place threshold.`,
      );
    }

    if (published && matchingPlaces.length === 0) {
      errors.push(`${href}: published with no matching places.`);
    }
  }
}

for (const page of publishedPages) {
  if (!page.href.startsWith('/') || !page.href.endsWith('/')) {
    errors.push(`${page.href}: taxonomy URL must start and end with '/'.`);
  }

  for (const place of page.places) {
    if (!placeMatchesTaxonomy(place, page.taxonomy)) {
      errors.push(
        `${page.href}: ${place.slug} does not satisfy the taxonomy criteria.`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error('\nTaxonomy checks failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`\nTaxonomy checks passed: ${publishedPages.length} pages publishable.`);
}
