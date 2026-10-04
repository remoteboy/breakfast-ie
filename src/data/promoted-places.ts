import type { Place } from '../types/place';

const checkedAt = '2026-10-04';

/**
 * Venue records for promoted breakfast menus that do not yet have a richer,
 * hand-curated entry in places.ts.
 *
 * Keep uncertain facts as null. The main places dataset wins on slug if a
 * venue is later promoted to a fully curated record with imagery/editorial data.
 */
const promotedPlaces = [
  {
    name: 'Metro Cafe',
    slug: 'metro-cafe',
    location: {
      area: 'South William Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '43 South William Street, Dublin 2',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '08:30',
      servedUntil: '17:00',
      allDay: true,
      fullIrish: null,
      vegetarian: true,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'South William Street café and bistro serving all-day breakfast, pancakes, egg dishes and breakfast baps into the afternoon.',
    },
    images: [],
    links: {
      website: 'https://www.metrocafe.ie/',
      menu: 'https://www.metrocafe.ie/menu/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.metrocafe.ie/menu/',
          label: 'Metro Cafe menu',
          checkedAt,
        },
        {
          url: 'https://www.metrocafe.ie/contact-us/',
          label: 'Metro Cafe contact and address',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Beanhive Baggot Street',
    slug: 'beanhive-baggot',
    location: {
      area: 'Baggot Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '112 Lower Baggot Street, Dublin 2',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: true,
      fullIrish: true,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Lower Baggot Street café with all-day Irish, vegetarian and vegan breakfasts plus eggs, pancakes and granola.',
    },
    images: [],
    links: {
      website: 'https://www.beanhive.ie/',
      menu: 'https://www.beanhive.ie/menu?location=Baggot+Street+Lower&menu=menu---baggot---dine-in',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.beanhive.ie/menu?location=Baggot+Street+Lower&menu=menu---baggot---dine-in',
          label: 'Beanhive Baggot Street dine-in menu',
          checkedAt,
        },
        {
          url: 'https://www.beanhive.ie/contact-8',
          label: 'Beanhive locations and hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Urbanity',
    slug: 'urbanity-smithfield',
    location: {
      area: 'Smithfield',
      locality: 'Dublin 7',
      city: 'Dublin',
      county: 'Dublin',
      address: 'The Glass House, 11 Coke Lane, Smithfield, Dublin 7',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: true,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Smithfield neighbourhood café and coffee roastery with weekday breakfast and a separate all-day breakfast menu.',
    },
    images: [],
    links: {
      website: 'https://urbanity.ie/',
      menu: 'https://urbanity.ie/menu/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://urbanity.ie/menu/',
          label: 'Urbanity menu',
          checkedAt,
        },
        {
          url: 'https://urbanity.ie/contact-us/',
          label: 'Urbanity location and hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'House Dublin',
    slug: 'house-dublin',
    location: {
      area: 'Leeson Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '27 Lower Leeson Street, Dublin 2, D02 V306',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: '11:00',
      allDay: false,
      fullIrish: true,
      vegetarian: true,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Leeson Street townhouse restaurant serving weekday and Saturday breakfast, from Full Irish plates to eggs, granola and sweeter dishes.',
    },
    images: [],
    links: {
      website: 'https://www.housedublin.ie/',
      menu: 'https://www.housedublin.ie/menus/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.housedublin.ie/menus/',
          label: 'House Dublin menus',
          checkedAt,
        },
        {
          url: 'https://www.housedublin.ie/',
          label: 'House Dublin venue and breakfast hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Balfes',
    slug: 'balfes',
    location: {
      area: 'Balfe Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '2 Balfe Street, Dublin 2, D02 CH66',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: false,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Balfe Street brasserie beside Grafton Street serving weekday breakfast and weekend brunch.',
    },
    images: [],
    links: {
      website: 'https://balfes.ie/',
      menu: 'https://balfes.ie/qr-brunch-menu/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://balfes.ie/qr-brunch-menu/',
          label: 'Balfes brunch menu',
          checkedAt,
        },
        {
          url: 'https://balfes.ie/contact-us/',
          label: 'Balfes address and service hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Farmer Browns Rathmines',
    slug: 'farmer-browns-rathmines',
    location: {
      area: 'Rathmines',
      locality: 'Dublin 6',
      city: 'Dublin',
      county: 'Dublin',
      address: '170 Rathmines Road Lower, Dublin 6, D06 X5N9',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: true,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Rathmines neighbourhood restaurant with an all-day brunch menu of fry-ups, eggs, waffles, avocado toast and burritos.',
    },
    images: [],
    links: {
      website: 'https://www.farmerbrowns.ie/rathmines',
      menu: 'https://www.farmerbrowns.ie/_files/ugd/c11a1c_921e4dae57264f04b9d134c65d2d6812.pdf',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.farmerbrowns.ie/_files/ugd/c11a1c_921e4dae57264f04b9d134c65d2d6812.pdf',
          label: 'Farmer Browns Rathmines midweek brunch menu',
          checkedAt,
        },
        {
          url: 'https://www.farmerbrowns.ie/',
          label: 'Farmer Browns locations',
          checkedAt,
        },
      ],
    },
  },
  {
    name: "Jay Kay's Cafe",
    slug: 'jay-kays-cafe',
    location: {
      area: 'Millennium Walkway',
      locality: 'Dublin 1',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Millennium Walkway, Middle Abbey Street, Dublin 1',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '06:00',
      servedUntil: '17:00',
      allDay: true,
      fullIrish: true,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Millennium Walkway café serving all-day breakfast and brunch from early morning, including Full Irish plates, rolls, burritos and crêpes.',
    },
    images: [],
    links: {
      website: 'https://www.jaykays.ie/',
      menu: 'https://www.jaykays.ie/jay-kays-cafe-menu-all-day-breakfast-brunch-lunch-and-more-dublin/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.jaykays.ie/jay-kays-cafe-menu-all-day-breakfast-brunch-lunch-and-more-dublin/',
          label: "Jay Kay's all-day menu",
          checkedAt,
        },
        {
          url: 'https://www.jaykays.ie/',
          label: "Jay Kay's venue and opening hours",
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Third Space Smithfield',
    slug: 'third-space-smithfield',
    location: {
      area: 'Smithfield',
      locality: 'Dublin 7',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Unit 14 Block C, Smithfield Markets, Smithfield, Dublin 7, D07 P440',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: '14:00',
      allDay: false,
      fullIrish: true,
      vegetarian: true,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Smithfield social-enterprise café serving breakfast until 2pm, from Full Irish and veggie fry-ups to rolls, porridge and eggs.',
    },
    images: [],
    links: {
      website: 'https://thirdspace.ie/',
      menu: 'https://thirdspace.ie/breakfast/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://thirdspace.ie/breakfast/',
          label: 'Third Space breakfast menu',
          checkedAt,
        },
        {
          url: 'https://thirdspace.ie/',
          label: 'Third Space location and hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: "Layla's",
    slug: 'laylas-ranelagh',
    location: {
      area: 'Ranelagh',
      locality: 'Dublin 6',
      city: 'Dublin',
      county: 'Dublin',
      address: 'The Devlin Hotel Rooftop, 117–119 Ranelagh, Dublin 6',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: false,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Ranelagh rooftop restaurant at The Devlin with breakfast and weekend brunch overlooking the village.',
    },
    images: [],
    links: {
      website: 'https://laylas.ie/',
      menu: 'https://laylas.ie/menus/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://laylas.ie/wp-content/uploads/2026/07/Laylas-Brunch-July-2026.pdf',
          label: "Layla's brunch menu (July 2026)",
          checkedAt,
        },
        {
          url: 'https://laylas.ie/',
          label: "Layla's location and breakfast hours",
          checkedAt,
        },
      ],
    },
  },
] satisfies Place[];

export default promotedPlaces;
