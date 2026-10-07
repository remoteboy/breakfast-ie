import type { Place } from '../types/place';
import {
  getPlaceDiscovery,
  hasExplicitGlutenFreeDish,
  hasExplicitVeganDish,
  type DiscoveryFilter,
} from './discovery';

export interface CityDefinition {
  slug: string;
  name: string;
  placeCity: string;
  countryName: string;
}

export interface TaxonomyDefinition {
  slug: string;
  filter: DiscoveryFilter;
  label: string;
  navLabel: string;
  minimumPlaces: number;
  heading: (city: CityDefinition) => string;
  description: (city: CityDefinition) => string;
  intro: (city: CityDefinition) => string;
  criteria: (city: CityDefinition) => string;
}

export interface PublishedTaxonomyPage {
  city: CityDefinition;
  taxonomy: TaxonomyDefinition;
  places: Place[];
  href: string;
}

export const cityDefinitions = [
  {
    slug: 'dublin',
    name: 'Dublin',
    placeCity: 'Dublin',
    countryName: 'Ireland',
  },
] as const satisfies readonly CityDefinition[];

export const taxonomyDefinitions = [
  {
    slug: 'full-irish',
    filter: 'full-irish',
    label: 'Full Irish breakfasts',
    navLabel: 'Full Irish',
    minimumPlaces: 3,
    heading: (city) => `Full Irish breakfasts in ${city.name}`,
    description: (city) =>
      `Find Full Irish breakfasts in ${city.name}, using explicit venue facts and accepted breakfast menu data.`,
    intro: (city) =>
      `Places in ${city.name} where our structured breakfast data explicitly shows a Full Irish breakfast.`,
    criteria: () =>
      'A place appears here only when the venue record or an accepted menu item explicitly identifies a Full Irish breakfast.',
  },
  {
    slug: 'breakfast-under-15',
    filter: 'under-15',
    label: 'Breakfast under €15',
    navLabel: 'Under €15',
    minimumPlaces: 3,
    heading: (city) => `Breakfast under €15 in ${city.name}`,
    description: (city) =>
      `Find breakfast in ${city.name} with at least one accepted menu item priced at €15 or less.`,
    intro: (city) =>
      `Breakfast places in ${city.name} where the verified menu data includes at least one breakfast item for €15 or less.`,
    criteria: () =>
      'Only explicit EUR menu prices count. We do not estimate prices or infer a cheap venue from reviews, snippets or old pricing.',
  },
  {
    slug: 'all-day-breakfast',
    filter: 'all-day',
    label: 'All-day breakfast',
    navLabel: 'All day',
    minimumPlaces: 3,
    heading: (city) => `All-day breakfast in ${city.name}`,
    description: (city) =>
      `Find all-day breakfast in ${city.name}, based on explicit venue information and accepted menu context.`,
    intro: (city) =>
      `Places in ${city.name} where breakfast is explicitly described as available all day in the venue data or accepted menu.`,
    criteria: () =>
      'We only mark all-day breakfast when the source says so explicitly; a late brunch service is not automatically treated as all-day breakfast.',
  },
  {
    slug: 'vegetarian-breakfast',
    filter: 'vegetarian',
    label: 'Vegetarian breakfast',
    navLabel: 'Vegetarian',
    minimumPlaces: 3,
    heading: (city) => `Vegetarian breakfast in ${city.name}`,
    description: (city) =>
      `Find vegetarian breakfast options in ${city.name}, using explicit dietary information from venue and accepted menu data.`,
    intro: (city) =>
      `Breakfast places in ${city.name} where vegetarian availability is explicitly supported by the structured venue or menu data.`,
    criteria: () =>
      'We do not infer vegetarian status from ingredients alone. The venue data, menu label or accepted dietary field must support it explicitly.',
  },
  {
    slug: 'vegan-breakfast',
    filter: 'vegan',
    label: 'Vegan breakfast',
    navLabel: 'Vegan',
    minimumPlaces: 3,
    heading: (city) => `Vegan breakfast in ${city.name}`,
    description: (city) =>
      `Find vegan breakfast in ${city.name} where an accepted breakfast menu contains an explicitly vegan dish.`,
    intro: (city) =>
      `Breakfast places in ${city.name} with at least one accepted menu item explicitly identified as vegan.`,
    criteria: () =>
      'A general “vegan option available” statement is not enough for this guide. At least one accepted breakfast item must itself be explicitly identified as vegan.',
  },
  {
    slug: 'gluten-free-breakfast',
    filter: 'gluten-free',
    label: 'Gluten-free breakfast',
    navLabel: 'GF option',
    minimumPlaces: 3,
    heading: (city) => `Gluten-free breakfast in ${city.name}`,
    description: (city) =>
      `Find gluten-free breakfast in ${city.name} where an accepted breakfast menu contains an explicitly gluten-free dish.`,
    intro: (city) =>
      `Breakfast places in ${city.name} with at least one accepted menu item explicitly identified as gluten-free.`,
    criteria: () =>
      'A general “gluten-free available” statement is not enough for this guide. At least one accepted breakfast item must itself be explicitly gluten-free. This does not imply an allergen-safe kitchen or protection from cross-contamination.',
  },
] as const satisfies readonly TaxonomyDefinition[];

export function getCityPlaces(
  allPlaces: readonly Place[],
  city: CityDefinition,
): Place[] {
  return allPlaces.filter((place) => place.location.city === city.placeCity);
}

export function placeMatchesTaxonomy(
  place: Place,
  taxonomy: TaxonomyDefinition,
): boolean {
  if (taxonomy.slug === 'vegan-breakfast') {
    return hasExplicitVeganDish(place);
  }

  if (taxonomy.slug === 'gluten-free-breakfast') {
    return hasExplicitGlutenFreeDish(place);
  }

  return getPlaceDiscovery(place).filters.includes(taxonomy.filter);
}

export function getTaxonomyPlaces(
  allPlaces: readonly Place[],
  city: CityDefinition,
  taxonomy: TaxonomyDefinition,
): Place[] {
  return getCityPlaces(allPlaces, city).filter((place) => placeMatchesTaxonomy(place, taxonomy));
}

export function getTaxonomyHref(
  city: CityDefinition,
  taxonomy: TaxonomyDefinition,
): string {
  return `/${city.slug}/${taxonomy.slug}/`;
}

export function getPublishedTaxonomyPages(
  allPlaces: readonly Place[],
): PublishedTaxonomyPage[] {
  return cityDefinitions.flatMap((city) =>
    taxonomyDefinitions.flatMap((taxonomy) => {
      const matchingPlaces = getTaxonomyPlaces(allPlaces, city, taxonomy);
      if (matchingPlaces.length < taxonomy.minimumPlaces) return [];

      return [{
        city,
        taxonomy,
        places: matchingPlaces,
        href: getTaxonomyHref(city, taxonomy),
      }];
    }),
  );
}

export function getPublishedTaxonomiesForPlace(
  place: Place,
  allPlaces: readonly Place[],
): PublishedTaxonomyPage[] {
  const city = cityDefinitions.find((candidate) => candidate.placeCity === place.location.city);
  if (!city) return [];

  return getPublishedTaxonomyPages(allPlaces).filter(
    (page) =>
      page.city.slug === city.slug &&
      page.places.some((candidate) => candidate.slug === place.slug),
  );
}
