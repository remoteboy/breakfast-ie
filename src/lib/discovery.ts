import { breakfastMenus } from '../data/generated/breakfast-menus';
import type { Place } from '../types/place';
import { getBreakfastTags, getFilterValues } from './place';

type MenuComponent = {
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
};

type IncludedDrink = {
  name: string;
  choice: string | null;
  notes: string | null;
};

export type MenuItem = {
  name: string;
  category: string | null;
  mealContext: string | null;
  description: string | null;
  price: {
    amount: number;
    currency: string;
  } | null;
  components: readonly MenuComponent[];
  includedDrinks: readonly IncludedDrink[];
  dietary: {
    vegetarian: boolean | null;
    vegan: boolean | null;
    glutenFree: boolean | null;
    glutenFreeAvailable: boolean | null;
  };
  availabilityNotes: string | null;
};

export type BreakfastMenu = {
  venueName: string;
  sourceStatus: string;
  items: readonly MenuItem[];
};

const menus = breakfastMenus as unknown as Record<string, BreakfastMenu>;

export type DiscoveryFilter =
  | 'full-irish'
  | 'early'
  | 'all-day'
  | 'under-15'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'drink-included'
  | 'menu';

export interface PlaceDiscovery {
  menuAvailable: boolean;
  menuItemCount: number;
  pricedItemCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  filters: DiscoveryFilter[];
  tags: string[];
  menuItemNames: string[];
}

const explicitVegetarian = (item: MenuItem) =>
  item.dietary.vegetarian !== false &&
  (item.dietary.vegetarian === true || /\bvegetarian\b/i.test(item.name));

const explicitVegan = (item: MenuItem) =>
  item.dietary.vegan !== false &&
  (item.dietary.vegan === true || /\bvegan\b/i.test(item.name));

const explicitGlutenFreeDish = (item: MenuItem) =>
  item.dietary.glutenFree === true || /\bgluten[-\s]?free\b/i.test(item.name);

const explicitFullIrish = (item: MenuItem) =>
  item.category === 'full-irish' || /\bfull\s+irish\b/i.test(item.name);

const explicitGlutenFree = (item: MenuItem) =>
  item.dietary.glutenFree === true || item.dietary.glutenFreeAvailable === true;

const explicitIncludedDrink = (item: MenuItem) =>
  item.includedDrinks.some((drink) => drink.name.trim().length > 0);

const validEuroPrice = (item: MenuItem): number | null => {
  if (!item.price || item.price.currency !== 'EUR') return null;
  if (!Number.isFinite(item.price.amount) || item.price.amount <= 0) return null;
  return item.price.amount;
};

export function formatDiscoveryPrice(amount: number): string {
  const hasFraction = Math.abs(amount % 1) > Number.EPSILON;

  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getBreakfastMenu(placeOrSlug: Place | string): BreakfastMenu | null {
  const slug = typeof placeOrSlug === 'string' ? placeOrSlug : placeOrSlug.slug;
  return menus[slug] ?? null;
}

export function getBreakfastMenuSlugs(): string[] {
  return Object.keys(menus);
}

export function hasExplicitVeganDish(place: Place): boolean {
  return (getBreakfastMenu(place)?.items ?? []).some(explicitVegan);
}

export function hasExplicitGlutenFreeDish(place: Place): boolean {
  return (getBreakfastMenu(place)?.items ?? []).some(explicitGlutenFreeDish);
}

export function getPlaceDiscovery(place: Place): PlaceDiscovery {
  const menu = getBreakfastMenu(place);
  const items = menu?.items ?? [];
  const prices = items
    .map(validEuroPrice)
    .filter((price): price is number => price !== null)
    .sort((a, b) => a - b);

  const filterSet = new Set<DiscoveryFilter>(getFilterValues(place));

  if (items.length > 0) filterSet.add('menu');
  if (place.breakfast.fullIrish !== false && items.some(explicitFullIrish)) {
    filterSet.add('full-irish');
  }
  if (place.breakfast.vegetarian !== false && items.some(explicitVegetarian)) {
    filterSet.add('vegetarian');
  }
  if (place.breakfast.vegan !== false && items.some(explicitVegan)) {
    filterSet.add('vegan');
  }
  if (items.some(explicitGlutenFree)) filterSet.add('gluten-free');
  if (items.some(explicitIncludedDrink)) filterSet.add('drink-included');
  if (
    place.breakfast.allDay !== false &&
    items.some((item) => item.mealContext === 'all-day-breakfast')
  ) {
    filterSet.add('all-day');
  }
  if (prices.some((price) => price <= 15)) filterSet.add('under-15');

  const tags = getBreakfastTags(place).map((tag) =>
    tag === 'Vegan' ? 'Vegan option' : tag,
  );
  const addTag = (filter: DiscoveryFilter, label: string) => {
    if (filterSet.has(filter) && !tags.includes(label)) tags.push(label);
  };

  addTag('full-irish', 'Full Irish');
  addTag('early', 'Early');
  addTag('all-day', 'All day');
  addTag('vegetarian', 'Vegetarian');
  addTag('vegan', 'Vegan option');
  addTag('gluten-free', 'GF option');
  addTag('drink-included', 'Drink included');

  const menuItemNames = items.map((item) => item.name);
  return {
    menuAvailable: items.length > 0,
    menuItemCount: items.length,
    pricedItemCount: prices.length,
    minPrice: prices[0] ?? null,
    maxPrice: prices.at(-1) ?? null,
    filters: [...filterSet],
    tags,
    menuItemNames,
  };
}

export function getDiscoverySummary(discovery: PlaceDiscovery): string | null {
  if (!discovery.menuAvailable) return null;

  const parts = [
    `${discovery.menuItemCount} ${discovery.menuItemCount === 1 ? 'breakfast item' : 'breakfast items'}`,
  ];

  if (discovery.minPrice !== null) {
    parts.push(`from ${formatDiscoveryPrice(discovery.minPrice)}`);
  }

  return parts.join(' · ');
}
