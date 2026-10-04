import type { Place } from '../types/place';
import promotedPlaces from './promoted-places';

const checkedAt = '2026-10-02';

const curatedPlaces = [
  {
    name: 'Brother Hubbard North',
    slug: 'brother-hubbard-north',

    location: {
      area: 'Capel Street',
      locality: 'Dublin 1',
      city: 'Dublin',
      county: 'Dublin',
      address: '153 Capel Street, Dublin 1',
      latitude: 53.34713,
      longitude: -6.26844,
    },

    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: null,
      fullIrish: true,
      vegetarian: true,
      vegan: true,
    },

    priceLevel: null,

    editorial: {
      summary:
        'Capel Street flagship for from-scratch breakfasts with a strong Middle Eastern influence and plenty of vegetarian options.',
    },

    images: [
      {
        src: 'https://live.staticflickr.com/4519/26891165929_d188df1a02.jpg',
        alt: 'Exterior of Brother Hubbard North on Capel Street in Dublin.',
        kind: 'venue',
        source: 'flickr',
        credit: 'William Murphy',
        creditUrl: 'https://www.flickr.com/photos/infomatique/26891165929',
        license: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
        originalUrl: 'https://www.flickr.com/photos/infomatique/26891165929',
      },
    ],

    links: {
      website: 'https://brotherhubbard.ie/',
      menu: 'https://brotherhubbard.ie/menus/',
    },

    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://brotherhubbard.ie/locations/',
          label: 'Brother Hubbard locations',
          checkedAt,
        },
        {
          url: 'https://brotherhubbard.ie/menus/',
          label: 'Brother Hubbard menus',
          checkedAt,
        },
      ],
    },
  },

  {
    name: "Keogh's Cafe",
    slug: 'keoghs-cafe',

    location: {
      area: 'Trinity Street',
      locality: 'Dublin 2',
      city: 'Dublin',
      county: 'Dublin',
      address: '1–2 Trinity Street, Dublin 2, D02 A440',
      latitude: 53.34404,
      longitude: -6.26215,
    },

    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: null,
      fullIrish: true,
      vegetarian: true,
      vegan: true,
    },

    priceLevel: null,

    editorial: {
      summary:
        'Long-running Dublin cafe and bakery near Trinity, with hearty Irish breakfasts, fresh baking and straightforward comfort food.',
    },

    images: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/10-12_Trinity_Street%2C_Dublin_2.jpg',
        alt: 'Trinity Street in Dublin, close to Keogh\'s Cafe.',
        kind: 'neighbourhood',
        source: 'wikimedia',
        credit: 'Conoronmaps',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:10-12_Trinity_Street,_Dublin_2.jpg',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        originalUrl: 'https://commons.wikimedia.org/wiki/File:10-12_Trinity_Street,_Dublin_2.jpg',
      },
    ],

    links: {
      website: 'https://www.keoghscafe.ie/',
      menu: 'https://www.keoghscafe.ie/menus?menu=cafe-menu',
    },

    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.keoghscafe.ie/menus?menu=cafe-menu',
          label: "Keogh's cafe menu",
          checkedAt,
        },
        {
          url: 'https://www.keoghscafe.ie/contact',
          label: "Keogh's contact and opening hours",
          checkedAt,
        },
        {
          url: 'https://www.keoghscafe.ie/story',
          label: "Keogh's story",
          checkedAt,
        },
      ],
    },
  },

  {
    name: 'Lemon Jelly Cafe',
    slug: 'lemon-jelly-cafe',

    location: {
      area: 'Millennium Walkway',
      locality: 'Dublin 1',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Millennium Walkway, Dublin 1, D01 Y027',
      latitude: 53.34717,
      longitude: -6.26551,
    },

    breakfast: {
      servedFrom: '06:30',
      servedUntil: null,
      allDay: true,
      fullIrish: true,
      vegetarian: null,
      vegan: null,
    },

    priceLevel: null,

    editorial: {
      summary:
        'City-centre all-day breakfast spot for Full Irish breakfasts, crepes, omelettes and coffee from early morning.',
    },

    images: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Millennium_Bridge_and_Buildings_along_Ormond_Quay_Lower_-_geograph.org.uk_-_3688601.jpg?width=1600',
        alt: 'The Millennium Bridge and Ormond Quay Lower, a short walk from Lemon Jelly Cafe.',
        kind: 'neighbourhood',
        source: 'wikimedia',
        credit: 'Joseph Mischyshyn',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Millennium_Bridge_and_Buildings_along_Ormond_Quay_Lower_-_geograph.org.uk_-_3688601.jpg',
        license: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
        originalUrl: 'https://commons.wikimedia.org/wiki/File:Millennium_Bridge_and_Buildings_along_Ormond_Quay_Lower_-_geograph.org.uk_-_3688601.jpg',
      },
    ],

    links: {
      website: 'https://www.lemonjelly.ie/',
      menu: 'https://www.lemonjelly.ie/',
    },

    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.lemonjelly.ie/',
          label: 'Lemon Jelly Cafe website and menus',
          checkedAt,
        },
      ],
    },
  },

  {
    name: 'Mad Yolks',
    slug: 'mad-yolks-smithfield',

    location: {
      area: 'Smithfield',
      locality: 'Dublin 7',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Unit 4 Block C, Smithfield, Dublin 7, D07 DE0E',
      latitude: 53.34869,
      longitude: -6.27767,
    },

    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: true,
      fullIrish: null,
      vegetarian: true,
      vegan: true,
    },

    priceLevel: null,

    editorial: {
      summary:
        'All-day breakfast built around eggs, indulgent sandwiches and unapologetically messy comfort food.',
    },

    images: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Smithfield_Square_(2012).jpg?width=1600',
        alt: 'Smithfield Square in Dublin, where Mad Yolks has its Smithfield shop.',
        kind: 'neighbourhood',
        source: 'wikimedia',
        credit: 'William Murphy',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Smithfield_Square_(2012).jpg',
        license: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
        originalUrl: 'https://commons.wikimedia.org/wiki/File:Smithfield_Square_(2012).jpg',
      },
    ],

    links: {
      website: 'https://www.madyolks.ie/',
      menu: 'https://www.madyolks.ie/menu/',
    },

    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://www.madyolks.ie/',
          label: 'Mad Yolks website',
          checkedAt,
        },
        {
          url: 'https://www.madyolks.ie/menu/',
          label: 'Mad Yolks menu',
          checkedAt,
        },
      ],
    },
  },

  {
    name: 'The Fumbally',
    slug: 'the-fumbally',

    location: {
      area: 'Fumbally Lane',
      locality: 'Dublin 8',
      city: 'Dublin',
      county: 'Dublin',
      address: 'Fumbally Lane, The Liberties, Dublin 8, D08 HFF2',
      latitude: 53.33707,
      longitude: -6.27303,
    },

    breakfast: {
      servedFrom: null,
      servedUntil: '15:00',
      allDay: null,
      fullIrish: null,
      vegetarian: null,
      vegan: null,
    },

    priceLevel: null,

    editorial: {
      summary:
        'Dublin 8 neighbourhood cafe with house-baked bread, serious coffee and seasonal food influenced by cooking from around the world.',
    },

    images: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Fumbally_Lane_1.jpg?width=1600',
        alt: 'Fumbally Lane in Dublin 8, home of The Fumbally.',
        kind: 'neighbourhood',
        source: 'wikimedia',
        credit: 'Mx. Granger',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Fumbally_Lane_1.jpg',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        originalUrl: 'https://commons.wikimedia.org/wiki/File:Fumbally_Lane_1.jpg',
      },
    ],

    links: {
      website: 'https://thefumbally.ie/',
      menu: 'https://thefumbally.ie/cafe/',
    },

    verification: {
      checkedAt,
      sources: [
        {
          url: 'https://thefumbally.ie/cafe/',
          label: 'The Fumbally cafe',
          checkedAt,
        },
      ],
    },
  },
] satisfies Place[];

const curatedSlugs = new Set(curatedPlaces.map((place) => place.slug));

const places: Place[] = [
  ...curatedPlaces,
  ...promotedPlaces.filter((place) => !curatedSlugs.has(place.slug)),
];

export default places;
