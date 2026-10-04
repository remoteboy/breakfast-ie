export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface ServiceWindow {
  label: string;
  days: readonly DayOfWeek[];
  daysLabel: string;
  opens: string;
  closes: string | null;
  sourceUrl: string;
  note?: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  sourceUrl: string;
  sourceLabel: string;
}

export interface VenueEnrichment {
  checkedAt: string;
  geo?: GeoPoint;
  openingHours?: readonly ServiceWindow[];
  breakfastHours?: readonly ServiceWindow[];
}

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const weekend = ['Saturday', 'Sunday'] as const;
const everyDay = [...weekdays, ...weekend] as const;
const monThu = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const;
const wedFri = ['Wednesday', 'Thursday', 'Friday'] as const;
const friSun = ['Friday', 'Saturday', 'Sunday'] as const;

/**
 * Manually verified venue metadata that does not belong in the menu extraction
 * pipeline. Service hours are deliberately separate from the coarse
 * `place.breakfast.servedFrom/servedUntil` fields because many venues have
 * different weekday/weekend breakfast and brunch windows.
 *
 * Geo points are sourced from OpenStreetMap-backed listings or other public
 * map directories and are only used when the curated Place record has no
 * coordinates. Official venue sources remain the authority for service hours.
 */
export const venueEnrichment = {
  'keoghs-cafe': {
    checkedAt: '2026-10-04',
    openingHours: [
      {
        label: 'Open',
        days: ['Monday', 'Tuesday', 'Wednesday'],
        daysLabel: 'Mon–Wed',
        opens: '06:30',
        closes: '18:00',
        sourceUrl: 'https://www.keoghscafe.ie/contact',
      },
      {
        label: 'Open',
        days: ['Thursday', 'Friday', 'Saturday'],
        daysLabel: 'Thu–Sat',
        opens: '06:30',
        closes: '19:00',
        sourceUrl: 'https://www.keoghscafe.ie/contact',
      },
      {
        label: 'Open',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '08:30',
        closes: '18:00',
        sourceUrl: 'https://www.keoghscafe.ie/contact',
      },
    ],
  },

  'metro-cafe': {
    checkedAt: '2026-10-04',
    openingHours: [
      {
        label: 'Open',
        days: monThu,
        daysLabel: 'Mon–Thu',
        opens: '08:30',
        closes: '20:30',
        sourceUrl: 'https://www.metrocafe.ie/contact-us/',
      },
      {
        label: 'Open',
        days: ['Friday', 'Saturday'],
        daysLabel: 'Fri–Sat',
        opens: '08:30',
        closes: '22:00',
        sourceUrl: 'https://www.metrocafe.ie/contact-us/',
      },
      {
        label: 'Open',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '09:00',
        closes: '20:30',
        sourceUrl: 'https://www.metrocafe.ie/contact-us/',
      },
    ],
    breakfastHours: [
      {
        label: 'All-day brunch',
        days: monThu,
        daysLabel: 'Mon–Thu',
        opens: '08:30',
        closes: '20:30',
        sourceUrl: 'https://www.metrocafe.ie/menu/',
      },
      {
        label: 'All-day brunch',
        days: ['Friday', 'Saturday'],
        daysLabel: 'Fri–Sat',
        opens: '08:30',
        closes: '22:00',
        sourceUrl: 'https://www.metrocafe.ie/menu/',
      },
      {
        label: 'All-day brunch',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '09:00',
        closes: '20:30',
        sourceUrl: 'https://www.metrocafe.ie/menu/',
      },
    ],
  },

  'beanhive-baggot': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.336459,
      longitude: -6.24881,
      sourceUrl: 'https://www.myguidedublin.com/restaurants/beanhive-coffee-baggot-st',
      sourceLabel: 'Public map listing',
    },
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:15',
        closes: '17:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'Open',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '08:15',
        closes: '17:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'Open',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '08:45',
        closes: '16:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
    ],
    breakfastHours: [
      {
        label: 'All-day breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:15',
        closes: '17:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'All-day breakfast',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '08:15',
        closes: '17:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'All-day breakfast',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '08:45',
        closes: '16:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
    ],
  },

  'urbanity-smithfield': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.34684,
      longitude: -6.27904,
      sourceUrl: 'https://mapcarta.com/N4615183918',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '16:00',
        sourceUrl: 'https://urbanity.ie/contact-us/',
      },
      {
        label: 'Open',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '09:00',
        closes: '16:00',
        sourceUrl: 'https://urbanity.ie/contact-us/',
      },
    ],
    breakfastHours: [
      {
        label: 'All-day breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '16:00',
        sourceUrl: 'https://urbanity.ie/menu/',
      },
      {
        label: 'All-day breakfast',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '09:00',
        closes: '16:00',
        sourceUrl: 'https://urbanity.ie/menu/',
      },
    ],
  },

  'house-dublin': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.334,
      longitude: -6.25516,
      sourceUrl: 'https://mapcarta.com/N4249403390',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    breakfastHours: [
      {
        label: 'Breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '11:00',
        sourceUrl: 'https://www.housedublin.ie/',
      },
      {
        label: 'Breakfast',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '09:00',
        closes: '11:00',
        sourceUrl: 'https://www.housedublin.ie/',
      },
      {
        label: 'Brunch',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '11:00',
        closes: '15:30',
        sourceUrl: 'https://www.housedublin.ie/',
      },
    ],
  },

  'balfes': {
    checkedAt: '2026-10-04',
    breakfastHours: [
      {
        label: 'Breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '10:45',
        sourceUrl: 'https://balfes.ie/contact-us/',
      },
      {
        label: 'Brunch',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '09:00',
        closes: '15:45',
        sourceUrl: 'https://balfes.ie/contact-us/',
      },
    ],
  },

  'farmer-browns-rathmines': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.3248,
      longitude: -6.26495,
      sourceUrl: 'https://mapcarta.com/N2983637884',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    breakfastHours: [
      {
        label: 'Brunch / lunch',
        days: everyDay,
        daysLabel: 'Mon–Sun',
        opens: '10:00',
        closes: null,
        sourceUrl: 'https://www.farmerbrowns.ie/rathmines',
        note: 'The venue publishes a 10am start but no brunch finish time.',
      },
    ],
  },

  'jay-kays-cafe': {
    checkedAt: '2026-10-04',
    openingHours: [
      {
        label: 'Open',
        days: everyDay,
        daysLabel: 'Mon–Sun',
        opens: '06:00',
        closes: '17:00',
        sourceUrl: 'https://www.jaykays.ie/',
      },
    ],
    breakfastHours: [
      {
        label: 'All-day breakfast / brunch',
        days: everyDay,
        daysLabel: 'Mon–Sun',
        opens: '06:00',
        closes: '17:00',
        sourceUrl: 'https://www.jaykays.ie/',
      },
    ],
  },

  'third-space-smithfield': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.34779,
      longitude: -6.27874,
      sourceUrl: 'https://mapcarta.com/N2102972616',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:00',
        closes: '17:30',
        sourceUrl: 'https://thirdspace.ie/breakfast/',
      },
      {
        label: 'Open',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '08:00',
        closes: '17:30',
        sourceUrl: 'https://thirdspace.ie/breakfast/',
      },
    ],
    breakfastHours: [
      {
        label: 'Breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:00',
        closes: '14:00',
        sourceUrl: 'https://thirdspace.ie/breakfast/',
      },
      {
        label: 'Breakfast',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '08:00',
        closes: '14:00',
        sourceUrl: 'https://thirdspace.ie/breakfast/',
      },
    ],
  },

  'laylas-ranelagh': {
    checkedAt: '2026-10-04',
    breakfastHours: [
      {
        label: 'Breakfast',
        days: wedFri,
        daysLabel: 'Wed–Fri',
        opens: '07:30',
        closes: '11:00',
        sourceUrl: 'https://laylas.ie/location-contact/',
      },
      {
        label: 'Breakfast',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '08:00',
        closes: '11:00',
        sourceUrl: 'https://laylas.ie/location-contact/',
      },
      {
        label: 'Brunch',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '11:00',
        closes: '15:30',
        sourceUrl: 'https://laylas.ie/location-contact/',
      },
    ],
  },

  'beanhive-dawson': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.33983,
      longitude: -6.25887,
      sourceUrl: 'https://mapcarta.com/W268843108',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:15',
        closes: '18:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'Open',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '08:30',
        closes: '18:30',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'Open',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '09:00',
        closes: '18:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
    ],
    breakfastHours: [
      {
        label: 'All-day breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:15',
        closes: '18:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'All-day breakfast',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '08:30',
        closes: '18:30',
        sourceUrl: 'https://www.beanhive.ie/',
      },
      {
        label: 'All-day breakfast',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '09:00',
        closes: '18:00',
        sourceUrl: 'https://www.beanhive.ie/',
      },
    ],
  },

  'alma-portobello': {
    checkedAt: '2026-10-04',
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '16:00',
        sourceUrl: 'https://www.alma.ie/',
        note: 'Food is served until 15:30.',
      },
      {
        label: 'Open',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '08:00',
        closes: '17:00',
        sourceUrl: 'https://www.alma.ie/',
        note: 'Food is served until 16:00.',
      },
    ],
    breakfastHours: [
      {
        label: 'Brunch',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '15:30',
        sourceUrl: 'https://www.alma.ie/menu',
      },
      {
        label: 'Brunch',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '08:00',
        closes: '16:00',
        sourceUrl: 'https://www.alma.ie/menu',
      },
    ],
  },

  'eathos-baggot-street': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.33357,
      longitude: -6.2447,
      sourceUrl: 'https://mapcarta.com/N10315658686',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:30',
        closes: '15:00',
        sourceUrl: 'https://eathosdublin.com/locations/',
      },
    ],
    breakfastHours: [
      {
        label: 'All-day brunch',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '07:30',
        closes: '15:00',
        sourceUrl: 'https://eathosdublin.com/locations/',
      },
    ],
  },

  'ivy-dawson-street': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.341568,
      longitude: -6.2581224,
      sourceUrl: 'https://www.goldenpages.ie/the-ivy-dublin-dublin-D02/36/',
      sourceLabel: 'Public map listing',
    },
    breakfastHours: [
      {
        label: 'Breakfast / brunch',
        days: monThu,
        daysLabel: 'Mon–Thu',
        opens: '09:30',
        closes: '11:30',
        sourceUrl:
          'https://ivycollection.com/restaurants-near-me/the-ivy-ireland/the-ivy-dawson-street-dublin/breakfast-menu/',
      },
      {
        label: 'Breakfast / brunch',
        days: friSun,
        daysLabel: 'Fri–Sun',
        opens: '09:00',
        closes: '11:30',
        sourceUrl:
          'https://ivycollection.com/restaurants-near-me/the-ivy-ireland/the-ivy-dawson-street-dublin/breakfast-menu/',
      },
    ],
  },

  'woollen-mills': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.34665,
      longitude: -6.26349,
      sourceUrl: 'https://mapcarta.com/N4665638190',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    breakfastHours: [
      {
        label: 'Weekend brunch',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '11:00',
        closes: '15:30',
        sourceUrl: 'https://www.thewoollenmills.com/menus.htm',
      },
    ],
  },

  'social-fabric': {
    checkedAt: '2026-10-04',
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '16:00',
        sourceUrl: 'https://www.social-fabric.ie/contact-us',
      },
      {
        label: 'Open',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '09:00',
        closes: '16:00',
        sourceUrl: 'https://www.social-fabric.ie/contact-us',
      },
    ],
    breakfastHours: [
      {
        label: 'All-day breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '16:00',
        sourceUrl: 'https://www.social-fabric.ie/',
      },
      {
        label: 'All-day breakfast',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '09:00',
        closes: '16:00',
        sourceUrl: 'https://www.social-fabric.ie/',
      },
    ],
  },

  'one-society': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.3541,
      longitude: -6.25651,
      sourceUrl: 'https://mapcarta.com/N6300255203',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    openingHours: [
      {
        label: 'Open',
        days: ['Wednesday', 'Thursday'],
        daysLabel: 'Wed–Thu',
        opens: '09:30',
        closes: '21:00',
        sourceUrl: 'https://www.onesociety.ie/contact',
      },
      {
        label: 'Open',
        days: ['Friday'],
        daysLabel: 'Fri',
        opens: '09:30',
        closes: '21:30',
        sourceUrl: 'https://www.onesociety.ie/contact',
      },
      {
        label: 'Open',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '09:00',
        closes: '21:30',
        sourceUrl: 'https://www.onesociety.ie/contact',
      },
      {
        label: 'Open',
        days: ['Sunday'],
        daysLabel: 'Sun',
        opens: '09:00',
        closes: '21:00',
        sourceUrl: 'https://www.onesociety.ie/contact',
      },
    ],
    breakfastHours: [
      {
        label: 'Lunch & brunch',
        days: ['Wednesday', 'Thursday', 'Friday'],
        daysLabel: 'Wed–Fri',
        opens: '09:30',
        closes: '15:00',
        sourceUrl: 'https://www.onesociety.ie/menu?location=Gardiner+Street+Lower&menu=lunch-n-brunch',
      },
      {
        label: 'Lunch & brunch',
        days: weekend,
        daysLabel: 'Sat–Sun',
        opens: '09:00',
        closes: '15:00',
        sourceUrl: 'https://www.onesociety.ie/menu?location=Gardiner+Street+Lower&menu=lunch-n-brunch',
      },
    ],
  },

  'tang-abbey-street': {
    checkedAt: '2026-10-04',
    geo: {
      latitude: 53.34872,
      longitude: -6.2584,
      sourceUrl: 'https://mapcarta.com/N6157780523',
      sourceLabel: 'OpenStreetMap-backed map listing',
    },
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '15:30',
        sourceUrl: 'https://www.tang.ie/contact',
      },
      {
        label: 'Open',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '10:00',
        closes: '15:30',
        sourceUrl: 'https://www.tang.ie/contact',
      },
    ],
    breakfastHours: [
      {
        label: 'Breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '11:15',
        sourceUrl: 'https://www.tang.ie/contact',
      },
      {
        label: 'All-day brunch',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '10:00',
        closes: '15:30',
        sourceUrl: 'https://www.tang.ie/contact',
      },
    ],
  },

  'tang-cumberland-place': {
    checkedAt: '2026-10-04',
    openingHours: [
      {
        label: 'Open',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '15:30',
        sourceUrl: 'https://www.tang.ie/contact',
      },
      {
        label: 'Open',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '10:00',
        closes: '15:30',
        sourceUrl: 'https://www.tang.ie/contact',
      },
    ],
    breakfastHours: [
      {
        label: 'Breakfast',
        days: weekdays,
        daysLabel: 'Mon–Fri',
        opens: '08:00',
        closes: '11:15',
        sourceUrl: 'https://www.tang.ie/contact',
      },
      {
        label: 'All-day brunch',
        days: ['Saturday'],
        daysLabel: 'Sat',
        opens: '10:00',
        closes: '15:30',
        sourceUrl: 'https://www.tang.ie/contact',
      },
    ],
  },
} as const satisfies Record<string, VenueEnrichment>;

export type EnrichedVenueSlug = keyof typeof venueEnrichment;
