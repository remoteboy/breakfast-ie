import places from '../src/data/places';
import {
  getBreakfastMenu,
  getBreakfastMenuSlugs,
  getPlaceDiscovery,
  type DiscoveryFilter,
} from '../src/lib/discovery';

const placeBySlug = new Map(places.map((place) => [place.slug, place]));
const menuSlugs = getBreakfastMenuSlugs();
const missingPlaceRoutes = menuSlugs.filter((slug) => !placeBySlug.has(slug));
const emptyMenus = menuSlugs.filter((slug) => (getBreakfastMenu(slug)?.items.length ?? 0) === 0);

const dublinPlaces = places.filter((place) => place.location.city === 'Dublin');
const discovery = dublinPlaces.map((place) => getPlaceDiscovery(place));
const menuPlaces = discovery.filter((facts) => facts.menuAvailable);
const itemCount = menuPlaces.reduce((total, facts) => total + facts.menuItemCount, 0);

const countFilter = (filter: DiscoveryFilter) =>
  discovery.filter((facts) => facts.filters.includes(filter)).length;

console.log(`Dublin places: ${dublinPlaces.length}`);
console.log(`Verified breakfast menus: ${menuPlaces.length}`);
console.log(`Accepted breakfast items: ${itemCount}`);
console.log(`Full Irish: ${countFilter('full-irish')}`);
console.log(`Under €15: ${countFilter('under-15')}`);
console.log(`Vegetarian: ${countFilter('vegetarian')}`);
console.log(`Vegan: ${countFilter('vegan')}`);
console.log(`GF option: ${countFilter('gluten-free')}`);
console.log(`Drink included: ${countFilter('drink-included')}`);

if (missingPlaceRoutes.length > 0) {
  console.error(`\nPromoted menus missing place routes: ${missingPlaceRoutes.join(', ')}`);
}

if (emptyMenus.length > 0) {
  console.error(`\nGenerated menus with no accepted items: ${emptyMenus.join(', ')}`);
}

if (missingPlaceRoutes.length > 0 || emptyMenus.length > 0) {
  process.exitCode = 1;
} else {
  console.log('\nDiscovery data checks passed.');
}
