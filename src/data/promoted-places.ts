import type { Place } from '../types/place';

const checkedAt = '2026-10-04';
const expansionCheckedAt = '2026-10-06';

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

  {
    name: 'Beanhive Dawson Street',
    slug: 'beanhive-dawson',
    location: {
      area: 'Dawson Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '26 Dawson Street, Dublin 2, D02 FY28',
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
        'Dawson Street café with an explicit all-day breakfast menu covering Irish, vegetarian and vegan breakfasts, eggs and hot drinks.',
    },
    images: [],
    links: {
      website: 'https://www.beanhive.ie/',
      menu: 'https://www.beanhive.ie/menu?location=Dawson+Street&menu=menu---dawson---dine-in',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.beanhive.ie/menu?location=Dawson+Street&menu=menu---dawson---dine-in',
          label: 'Beanhive Dawson Street dine-in menu',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Alma',
    slug: 'alma-portobello',
    location: {
      area: 'Portobello',
      locality: 'Dublin 8',
      city: 'Dublin',
      county: 'Dublin',
      address: '19A Curzon Street, Portobello, Dublin 8, D08 ND82',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '08:00',
      servedUntil: null,
      allDay: null,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Portobello café with an Argentinian influence, serving breakfast from 8am and a brunch menu of pancakes, eggs and sourdough dishes.',
    },
    images: [],
    links: {
      website: 'https://www.alma.ie/',
      menu: 'https://www.alma.ie/menu',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.alma.ie/menu',
          label: 'Alma current breakfast and brunch menu',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Eathos',
    slug: 'eathos-baggot-street',
    location: {
      area: 'Baggot Street',
      locality: 'Dublin 4',
      city: 'Dublin',
      county: 'Dublin',
      address: '15 Baggot Street Upper, Dublin 4, D04 E5V6',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '07:30',
      servedUntil: '14:30',
      allDay: null,
      fullIrish: true,
      vegetarian: true,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Upper Baggot Street café with a polished brunch menu spanning porridge, eggs, shakshuka and a full Irish, with last brunch orders at 2:30pm.',
    },
    images: [],
    links: {
      website: 'https://eathosdublin.com/',
      menu: 'https://eathosdublin.com/menu/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://eathosdublin.com/menu/',
          label: 'Eathos current brunch menu',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'The Ivy Dawson Street',
    slug: 'ivy-dawson-street',
    location: {
      area: 'Dawson Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '13–17 Dawson Street, Dublin 2, D02 TF98',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: '11:30',
      allDay: false,
      fullIrish: true,
      vegetarian: true,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Dawson Street brasserie serving a morning brunch menu with a Full Irish, Benedicts, pancakes and lighter egg and avocado dishes.',
    },
    images: [],
    links: {
      website: 'https://ivycollection.com/restaurants-near-me/the-ivy-ireland/the-ivy-dawson-street-dublin/',
      menu: 'https://ivycollection.com/restaurants-near-me/the-ivy-ireland/the-ivy-dawson-street-dublin/breakfast-menu/',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://ivycollection.com/restaurants-near-me/the-ivy-ireland/the-ivy-dawson-street-dublin/breakfast-menu/',
          label: 'The Ivy Dawson Street current breakfast and brunch menu',
          checkedAt,
        },
        {
          url: 'https://ivycollection.com/restaurants-near-me/the-ivy-ireland/the-ivy-dawson-street-dublin/',
          label: 'The Ivy Dawson Street address and opening hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'The Woollen Mills',
    slug: 'woollen-mills',
    location: {
      area: 'Ormond Quay',
      locality: 'Dublin 1',
      city: 'Dublin',
      county: 'Dublin',
      address: '42 Ormond Quay Lower, Dublin 1, D01 H304',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '11:00',
      servedUntil: '15:30',
      allDay: false,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Liffey-side Dublin restaurant serving a short late-morning breakfast and a broader weekend brunch menu.',
    },
    images: [],
    links: {
      website: 'https://www.thewoollenmills.com/',
      menu: 'https://www.thewoollenmills.com/menus.htm',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.thewoollenmills.com/menus.htm',
          label: 'The Woollen Mills current breakfast and brunch menus',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Social Fabric Cafe',
    slug: 'social-fabric',
    location: {
      area: 'Stoneybatter',
      locality: 'Dublin 7',
      city: 'Dublin',
      county: 'Dublin',
      address: '34 Stoneybatter, Dublin 7, D07 HP99',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: '16:00',
      allDay: true,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Stoneybatter café with an all-day menu of eggs, pancakes, granola, breakfast burritos and a substantial fry.',
    },
    images: [],
    links: {
      website: 'https://www.social-fabric.ie/',
      menu: 'https://www.social-fabric.ie/menu',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.social-fabric.ie/menu',
          label: 'Social Fabric current menu hub',
          checkedAt,
        },
        {
          url: 'https://www.social-fabric.ie/uploads/WLAFtkbH/A4weekmenu.pdf',
          label: 'Social Fabric weekday menu linked from current menu hub',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'One Society',
    slug: 'one-society',
    location: {
      area: 'Lower Gardiner Street',
      locality: 'Dublin 1',
      city: 'Dublin',
      county: 'Dublin',
      address: '1 Lower Gardiner Street, Dublin 1, D01 P9Y1',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: '15:00',
      allDay: true,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Lower Gardiner Street café serving breakfast and brunch through the afternoon, from pancakes and granola to an Irish breakfast and egg dishes.',
    },
    images: [],
    links: {
      website: 'https://www.onesociety.ie/one-society',
      menu: 'https://www.onesociety.ie/_files/ugd/ea11bf_7e22e09d2713447381ad4cafedd08183.pdf',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.onesociety.ie/one-society',
          label: 'One Society current venue page and menu link',
          checkedAt,
        },
        {
          url: 'https://www.onesociety.ie/_files/ugd/ea11bf_7e22e09d2713447381ad4cafedd08183.pdf',
          label: 'One Society breakfast, brunch and lunch menu linked by current venue page',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Tang Abbey Street',
    slug: 'tang-abbey-street',
    location: {
      area: 'Abbey Street',
      locality: 'Dublin 1',
      city: 'Dublin',
      county: 'Dublin',
      address: '9a Abbey Street Lower, Dublin 1, D01 A0W2',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '08:00',
      servedUntil: null,
      allDay: false,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Abbey Street café serving weekday breakfast and Saturday all-day brunch with Middle Eastern-inspired eggs, hummus and pancakes.',
    },
    images: [],
    links: {
      website: 'https://www.tang.ie/',
      menu: 'https://www.tang.ie/s/Tang_Mid-Week-Breakfast-Menu_Abbey-Cumberland.pdf',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.tang.ie/s/Tang_Mid-Week-Breakfast-Menu_Abbey-Cumberland.pdf',
          label: 'Tang official breakfast menu',
          checkedAt,
        },
        {
          url: 'https://www.tang.ie/contact',
          label: 'Tang current Abbey Street service hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: 'Tang Cumberland Place',
    slug: 'tang-cumberland-place',
    location: {
      area: 'Cumberland Place',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '2 Cumberland Place, Dublin 2, D02 H0V5',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '08:00',
      servedUntil: null,
      allDay: false,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Cumberland Place café serving weekday breakfast and Saturday all-day brunch with hummus, eggs, pancakes and vegetarian-friendly options.',
    },
    images: [],
    links: {
      website: 'https://www.tang.ie/',
      menu: 'https://www.tang.ie/s/Tang_Mid-Week-Breakfast-Menu_Abbey-Cumberland.pdf',
    },
    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.tang.ie/s/Tang_Mid-Week-Breakfast-Menu_Abbey-Cumberland.pdf',
          label: 'Tang official breakfast menu',
          checkedAt,
        },
        {
          url: 'https://www.tang.ie/contact',
          label: 'Tang current Cumberland Place service hours',
          checkedAt,
        },
      ],
    },
  },
  {
    name: "Sophie's Dublin",
    slug: 'sophies-dublin',
    location: {
      area: 'Harcourt Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: 'The Dean Dublin Centre, 33 Harcourt Street, Dublin 2',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '07:00',
      servedUntil: '11:00',
      allDay: false,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Rooftop restaurant at The Dean serving weekday and weekend breakfast, with weekend brunch from midday.',
    },
    images: [],
    links: {
      website: 'https://sophies.ie/locations/dublin',
      menu: 'https://sophies.ie/menus',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://sophies.ie/menus',
          label: "Sophie's live menu hub",
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://sophies.ie/locations/dublin',
          label: "Sophie's Dublin current breakfast and brunch hours",
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
  {
    name: "Mackenzie's",
    slug: 'mackenzies',
    location: {
      area: 'Grand Canal Dock',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Ground Floor Unit, Opus Building, 6 Hanover Quay, Grand Canal Dock, Dublin 2',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '10:00',
      servedUntil: null,
      allDay: false,
      fullIrish: true,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        "Docklands weekend brunch with a Full Irish-style breakfast, vegan breakfast, eggs, pancakes, French toast and chicken and waffles.",
    },
    images: [],
    links: {
      website: 'https://mackenziesdublin.ie/',
      menu: 'https://mackenziesdublin.ie/wp-content/uploads/2026/05/MACKENZIES_BrunchA4_May26.pdf',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://mackenziesdublin.ie/wp-content/uploads/2026/05/MACKENZIES_BrunchA4_May26.pdf',
          label: "Mackenzie's current weekend brunch menu",
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://mackenziesdublin.ie/',
          label: "Mackenzie's current weekend brunch hours",
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
  {
    name: "Angelina's Deli",
    slug: 'angelinas-deli',
    location: {
      area: 'Percy Place',
      locality: 'Dublin 4',
      city: 'Dublin',
      county: 'Dublin',
      address: '55 Percy Place, Dublin 4, D04 CX38',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '07:30',
      servedUntil: null,
      allDay: null,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        "Weekday Grand Canal deli serving breakfast from 7:30, with overnight oats, bacon baps, smoked salmon bagels and scrambled-egg wraps.",
    },
    images: [],
    links: {
      website: 'https://www.angelinas.ie/deli',
      menu: 'https://cdn.prod.website-files.com/6a046b844f1308012183430f/6a207724ee94dd8993b72c61_8a152b5dfe52623f4ebd3aa50b25bae9_Angelinas_Deli_Menu.pdf',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://www.angelinas.ie/deli',
          label: "Angelina's Deli current breakfast page and hours",
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://cdn.prod.website-files.com/6a046b844f1308012183430f/6a207724ee94dd8993b72c61_8a152b5dfe52623f4ebd3aa50b25bae9_Angelinas_Deli_Menu.pdf',
          label: "Angelina's Deli current menu",
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
  {
    name: 'Avoca Suffolk Street Cafe',
    slug: 'avoca-suffolk-street',
    location: {
      area: 'Suffolk Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '11–13 Suffolk Street, Dublin 2, D02 C653',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '09:00',
      servedUntil: '17:00',
      allDay: true,
      fullIrish: true,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        "Top-floor Suffolk Street café serving an all-day brunch menu seven days a week, including The Full Mill, Turkish eggs, porridge and granola.",
    },
    images: [],
    links: {
      website: 'https://avoca.com/pages/suffolk-street',
      menu: 'https://cdn.shopify.com/s/files/1/0984/1062/7407/files/Suffolk_St_Aug_2025_1.pdf?v=1771929230',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://avoca.com/pages/suffolk-street',
          label: 'Avoca Suffolk Street current cafe page and service hours',
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://cdn.shopify.com/s/files/1/0984/1062/7407/files/Suffolk_St_Aug_2025_1.pdf?v=1771929230',
          label: 'Avoca Suffolk Street current all-day brunch menu',
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
  {
    name: 'Farmer Browns Clonskeagh',
    slug: 'farmer-browns-clonskeagh',
    location: {
      area: 'Clonskeagh',
      locality: 'Dublin 6',
      city: 'Dublin',
      county: 'Dublin',
      address: '68 Clonskeagh Road, Dublin 6, D06 EH93',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: null,
      fullIrish: null,
      vegetarian: true,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        "Clonskeagh gastropub with a weekend brunch menu spanning avocado toast, Eggs Benedict, a sausage-and-pudding breakfast and French toast.",
    },
    images: [],
    links: {
      website: 'https://www.farmerbrowns.ie/clonskeagh-pub',
      menu: 'https://www.farmerbrowns.ie/_files/ugd/c11a1c_4c3e56b7337e4510aeec1a7ccb9c3156.pdf',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://www.farmerbrowns.ie/clonskeagh-pub',
          label: 'Farmer Browns Clonskeagh current venue page',
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://www.farmerbrowns.ie/_files/ugd/c11a1c_4c3e56b7337e4510aeec1a7ccb9c3156.pdf',
          label: 'Farmer Browns Clonskeagh current weekend brunch menu',
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
  {
    name: 'As One',
    slug: 'as-one',
    location: {
      area: 'City Quay',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Unit 3, 13–18 City Quay, Dublin 2',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: null,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },
    priceLevel: null,
    editorial: {
      summary:
        'City Quay café focused on seasonal food, speciality coffee and brunch, with separate weekday and weekend menus.',
    },
    images: [],
    links: {
      website: 'https://www.asone.ie/',
      menu: 'https://www.asone.ie/menu',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://www.asone.ie/menu',
          label: 'As One current menu hub',
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://drive.google.com/file/d/13xJPjOBKxCoMamcYIpA8QmLpWMQ9Bf5Y/view?usp=sharing',
          label: 'As One weekday menu linked from the official menu hub',
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://drive.google.com/file/d/1IWvQulKplYcv6OKdbBhJhyaExmypkKKF/view?usp=sharing',
          label: 'As One weekend menu linked from the official menu hub',
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
  {
    name: 'Cornucopia',
    slug: 'cornucopia',
    location: {
      area: 'Wicklow Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '19/20 Wicklow Street, Dublin 2',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '08:00',
      servedUntil: '12:00',
      allDay: false,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Long-running Wicklow Street vegan restaurant with a dedicated morning menu of tofu scramble, baked beans, breakfast tortilla, granola, overnight oats and açaí bowls.',
    },
    images: [],
    links: {
      website: 'https://cornucopia.ie/',
      menu: 'https://cornucopia.ie/menu/',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://cornucopia.ie/menu/',
          label: 'Cornucopia current morning menu',
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://cornucopia.ie/',
          label: 'Cornucopia current opening hours and vegan menu information',
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
  {
    name: 'Gourmet Food Parlour Dún Laoghaire',
    slug: 'gourmet-food-parlour-dun-laoghaire',
    location: {
      area: 'Dún Laoghaire',
      locality: 'Dún Laoghaire',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Unit 3 Harbour Square, Crofton Road, Dún Laoghaire, Co. Dublin, A96 E9P7',
      latitude: null,
      longitude: null,
    },
    breakfast: {
      servedFrom: '09:00',
      servedUntil: '16:45',
      allDay: false,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },
    priceLevel: null,
    editorial: {
      summary:
        'Harbour-side Dún Laoghaire restaurant serving brunch every day, with breakfast plates, Benedicts, pancakes, French toast and an explicitly vegan avocado toast.',
    },
    images: [],
    links: {
      website: 'https://www.gourmetfoodparlour.com/restaurants/dun-laoghaire',
      menu: 'https://www.gourmetfoodparlour.com/assets/files/2026/jan/u26-dl-brunch-menu.pdf',
    },
    verification: {
      checkedAt: expansionCheckedAt,
      sources: [
        {
          url: 'https://www.gourmetfoodparlour.com/assets/files/2026/jan/u26-dl-brunch-menu.pdf',
          label: 'Gourmet Food Parlour Dún Laoghaire 2026 brunch menu',
          checkedAt: expansionCheckedAt,
        },
        {
          url: 'https://www.gourmetfoodparlour.com/restaurants/dun-laoghaire',
          label: 'Gourmet Food Parlour Dún Laoghaire current venue page and brunch hours',
          checkedAt: expansionCheckedAt,
        },
      ],
    },
  },
] satisfies Place[];

export default promotedPlaces;
