import type { BreakfastFact, Place, PlaceImage } from '../types/place';

export type PlaceFilter = 'full-irish' | 'early' | 'all-day' | 'vegetarian' | 'vegan';

export function getAreaLabel(place: Place): string {
  return [place.location.area, place.location.locality]
    .filter(Boolean)
    .join(', ');
}

export function getBreakfastSummary(place: Place): string {
  const breakfast = place.breakfast;

  if (breakfast.allDay === true) {
    return 'Breakfast all day';
  }

  if (breakfast.servedUntil) {
    return `Breakfast until ${breakfast.servedUntil}`;
  }

  if (breakfast.fullIrish === true) {
    return 'Full Irish available';
  }

  return 'Breakfast';
}

export function getBreakfastTags(place: Place): string[] {
  const tags: string[] = [];
  const breakfast = place.breakfast;

  if (breakfast.fullIrish === true) {
    tags.push('Full Irish');
  }

  if (isEarlyBreakfast(place)) {
    tags.push('Early');
  }

  if (breakfast.allDay === true) {
    tags.push('All day');
  }

  if (breakfast.vegetarian === true) {
    tags.push('Vegetarian');
  }

  if (breakfast.vegan === true) {
    tags.push('Vegan');
  }

  if (place.priceLevel) {
    tags.push(place.priceLevel);
  }

  return tags;
}

export function getFilterValues(place: Place): PlaceFilter[] {
  const values: PlaceFilter[] = [];

  if (place.breakfast.fullIrish === true) values.push('full-irish');
  if (isEarlyBreakfast(place)) values.push('early');
  if (place.breakfast.allDay === true) values.push('all-day');
  if (place.breakfast.vegetarian === true) values.push('vegetarian');
  if (place.breakfast.vegan === true) values.push('vegan');

  return values;
}

export function isEarlyBreakfast(place: Place): boolean {
  if (!place.breakfast.servedFrom) {
    return false;
  }

  const [hours, minutes] = place.breakfast.servedFrom
    .split(':')
    .map(Number);

  return hours < 8 || (hours === 8 && minutes === 0);
}

export function formatFact(value: BreakfastFact): string {
  if (value === true) {
    return 'Yes';
  }

  if (value === false) {
    return 'No';
  }

  return '—';
}

export function formatCheckedDate(value: string | null): string {
  if (!value) {
    return 'Not yet verified';
  }

  const date = new Date(`${value}T00:00:00Z`);

  return new Intl.DateTimeFormat('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function getPrimaryImage(place: Place): PlaceImage | undefined {
  return place.images.find((image) => image.kind === 'venue') ?? place.images[0];
}

export function getListingImage(place: Place): PlaceImage | undefined {
  return place.images.find((image) => image.kind === 'venue');
}
