import type { BreakfastFact, Place } from "../types/place";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function getAreaLabel(place: Place): string {
  return [place.location.area, place.location.locality]
    .filter(Boolean)
    .join(", ");
}

export function getBreakfastSummary(place: Place): string {
  const breakfast = place.breakfast;

  if (breakfast.allDay === true) {
    return "Breakfast all day";
  }

  if (breakfast.servedUntil) {
    return `Breakfast until ${breakfast.servedUntil}`;
  }

  if (breakfast.fullIrish === true && breakfast.fullIrishPrice !== null) {
    return `Full Irish · ${euro.format(breakfast.fullIrishPrice)}`;
  }

  if (breakfast.fullIrish === true) {
    return "Full Irish";
  }

  return "Breakfast";
}

export function getBreakfastTags(place: Place): string[] {
  const tags: string[] = [];
  const breakfast = place.breakfast;

  if (breakfast.fullIrish === true) {
    tags.push("Full Irish");
  }

  if (breakfast.blackPudding === true) {
    tags.push("Black pudding");
  }

  if (breakfast.whitePudding === true) {
    tags.push("White pudding");
  }

  if (breakfast.vegetarian === true) {
    tags.push("Vegetarian");
  }

  if (breakfast.vegan === true) {
    tags.push("Vegan");
  }

  if (place.priceLevel) {
    tags.push(place.priceLevel);
  }

  return tags;
}

export function formatFact(value: BreakfastFact): string {
  if (value === true) {
    return "Yes";
  }

  if (value === false) {
    return "No";
  }

  return "Unknown";
}

export function formatCheckedDate(value: string | null): string {
  if (!value) {
    return "Not yet verified";
  }

  const date = new Date(`${value}T00:00:00Z`);

  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
