import type { Place } from '../types/place';
import { getBreakfastMenu, getPlaceDiscovery, type MenuItem } from './discovery';
import { getEffectiveCoordinates, getVenueEnrichment } from './enrichment';
import { getPrimaryImage } from './place';

const SITE_URL = 'https://breakfast.ie';

const absolutePlaceUrl = (place: Place) => `${SITE_URL}/places/${place.slug}/`;

const absoluteAssetUrl = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://')
    ? value
    : new URL(value, SITE_URL).toString();

const schemaTime = (value: string) => `${value}:00`;

export function serializeStructuredData(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

const componentDescription = (item: MenuItem) => {
  if (item.description) return item.description;
  if (item.components.length === 0) return undefined;

  return item.components
    .map((component) => {
      const quantity = component.quantity === null
        ? ''
        : component.unit
          ? `${component.quantity} ${component.unit} `
          : `${component.quantity} × `;
      const notes = component.notes ? ` (${component.notes})` : '';
      return `${quantity}${component.name}${notes}`;
    })
    .join(', ');
};

const suitableForDiet = (item: MenuItem) => {
  const diets: string[] = [];
  if (item.dietary.vegan === true) {
    diets.push('https://schema.org/VeganDiet');
  } else if (item.dietary.vegetarian === true) {
    diets.push('https://schema.org/VegetarianDiet');
  }

  if (item.dietary.glutenFree === true) {
    diets.push('https://schema.org/GlutenFreeDiet');
  }

  return diets.length > 0 ? diets : undefined;
};

const menuItemToSchema = (item: MenuItem) => ({
  '@type': 'MenuItem',
  name: item.name,
  ...(componentDescription(item) ? { description: componentDescription(item) } : {}),
  ...(item.price?.currency === 'EUR'
    ? {
        offers: {
          '@type': 'Offer',
          price: item.price.amount.toFixed(2),
          priceCurrency: 'EUR',
        },
      }
    : {}),
  ...(suitableForDiet(item) ? { suitableForDiet: suitableForDiet(item) } : {}),
});

export function buildPlaceStructuredData(place: Place) {
  const url = absolutePlaceUrl(place);
  const image = getPrimaryImage(place);
  const coordinates = getEffectiveCoordinates(place);
  const enrichment = getVenueEnrichment(place);
  const menu = getBreakfastMenu(place);
  const discovery = getPlaceDiscovery(place);

  const openingHoursSpecification = (enrichment?.openingHours ?? []).flatMap((window) =>
    window.closes === null
      ? []
      : [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: window.days.map((day) => `https://schema.org/${day}`),
          opens: schemaTime(window.opens),
          closes: schemaTime(window.closes),
        }],
  );

  const restaurant = {
    '@type': 'Restaurant',
    '@id': `${url}#venue`,
    name: place.name,
    url,
    description: place.editorial.summary,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.location.address,
      addressLocality: place.location.city,
      addressRegion: place.location.county,
      addressCountry: 'IE',
    },
    ...(coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        }
      : {}),
    ...(image ? { image: absoluteAssetUrl(image.src) } : {}),
    ...(place.links.website ? { sameAs: [place.links.website] } : {}),
    ...(menu ? { menu: `${url}#breakfast-menu` } : {}),
    ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
    ...(discovery.minPrice !== null && discovery.maxPrice !== null
      ? {
          priceRange: discovery.minPrice === discovery.maxPrice
            ? `€${discovery.minPrice}`
            : `€${discovery.minPrice}–€${discovery.maxPrice}`,
        }
      : {}),
    mainEntityOfPage: url,
  };

  const graph: unknown[] = [restaurant];

  if (menu) {
    graph.push({
      '@type': 'Menu',
      '@id': `${url}#breakfast-menu`,
      name: `${place.name} breakfast menu`,
      url,
      inLanguage: 'en-IE',
      hasMenuSection: {
        '@type': 'MenuSection',
        name: 'Breakfast',
        hasMenuItem: menu.items.map(menuItemToSchema),
      },
    });
  }

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumbs`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'breakfast.ie',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Breakfast in Dublin',
        item: `${SITE_URL}/dublin/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: place.name,
        item: url,
      },
    ],
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function buildDublinStructuredData(places: readonly Place[]) {
  const url = `${SITE_URL}/dublin/`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: 'Breakfast in Dublin',
        description: 'Breakfast places in Dublin with structured menu, service and dietary information.',
        mainEntity: {
          '@type': 'ItemList',
          itemListOrder: 'https://schema.org/ItemListUnordered',
          numberOfItems: places.length,
          itemListElement: places.map((place, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: place.name,
            url: absolutePlaceUrl(place),
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'breakfast.ie',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Breakfast in Dublin',
            item: url,
          },
        ],
      },
    ],
  };
}
