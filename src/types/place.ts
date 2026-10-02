export type BreakfastFact = boolean | null;

export type PriceLevel = '€' | '€€' | '€€€';

export interface VerificationSource {
  url: string;
  label: string;
  checkedAt: string;
}

export interface PlaceImage {
  src: string;
  alt: string;
  kind: 'venue' | 'neighbourhood';
  source: 'owner' | 'wikimedia' | 'flickr' | 'mapillary' | 'breakfast.ie';
  credit: string | null;
  creditUrl: string | null;
  license: string | null;
  licenseUrl: string | null;
  originalUrl: string | null;
}

export interface Place {
  name: string;
  slug: string;

  location: {
    area: string;
    locality: string;
    city: string;
    county: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
  };

  breakfast: {
    servedFrom: string | null;
    servedUntil: string | null;
    allDay: BreakfastFact;
    fullIrish: BreakfastFact;
    vegetarian: BreakfastFact;
    vegan: BreakfastFact;
  };

  priceLevel: PriceLevel | null;

  editorial: {
    summary: string;
  };

  images: PlaceImage[];

  links: {
    website: string | null;
    menu: string | null;
  };

  verification: {
    checkedAt: string | null;
    sources: VerificationSource[];
  };
}
