import { venueEnrichment, type ServiceWindow, type VenueEnrichment } from '../data/venue-enrichment';
import type { Place } from '../types/place';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function getVenueEnrichment(placeOrSlug: Place | string): VenueEnrichment | null {
  const slug = typeof placeOrSlug === 'string' ? placeOrSlug : placeOrSlug.slug;
  return venueEnrichment[slug as keyof typeof venueEnrichment] ?? null;
}

export function getEffectiveCoordinates(place: Place): Coordinates | null {
  if (place.location.latitude !== null && place.location.longitude !== null) {
    return {
      latitude: place.location.latitude,
      longitude: place.location.longitude,
    };
  }

  const geo = getVenueEnrichment(place)?.geo;
  if (!geo) return null;

  return {
    latitude: geo.latitude,
    longitude: geo.longitude,
  };
}

export function formatServiceWindow(window: ServiceWindow): string {
  const time = window.closes
    ? `${window.opens}–${window.closes}`
    : `from ${window.opens}`;

  return `${window.daysLabel} · ${time}`;
}

export function getVenueEnrichmentSources(enrichment: VenueEnrichment | null) {
  if (!enrichment) return [];

  const sources = [
    ...(enrichment.openingHours ?? []),
    ...(enrichment.breakfastHours ?? []),
  ];

  const seen = new Set<string>();
  return sources.flatMap((window) => {
    if (seen.has(window.sourceUrl)) return [];
    seen.add(window.sourceUrl);

    return [{
      url: window.sourceUrl,
      label: 'Current venue hours / service information',
      checkedAt: enrichment.checkedAt,
    }];
  });
}
