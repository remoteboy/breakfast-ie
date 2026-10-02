export type BreakfastFact = boolean | null;

export type PriceLevel = "€" | "€€" | "€€€";

export interface VerificationSource {
  url: string;
  label: string;
  checkedAt: string;
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
    fullIrishPrice: number | null;

    blackPudding: BreakfastFact;
    whitePudding: BreakfastFact;
    vegetarian: BreakfastFact;
    vegan: BreakfastFact;
  };

  priceLevel: PriceLevel | null;

  links: {
    website: string | null;
    menu: string | null;
  };

  verification: {
    checkedAt: string | null;
    sources: VerificationSource[];
  };
}
