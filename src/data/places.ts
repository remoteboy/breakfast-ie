import type { Place } from "../types/place";

const places = [
  {
    name: "Brother Hubbard",
    slug: "brother-hubbard",

    location: {
      area: "Capel Street",
      locality: "Dublin 1",
      city: "Dublin",
      county: "Dublin",
      address: "153 Capel Street, Dublin 1",
      latitude: null,
      longitude: null,
    },

    breakfast: {
      servedFrom: "08:00",
      servedUntil: "15:00",
      allDay: false,

      fullIrish: null,
      fullIrishPrice: null,

      blackPudding: null,
      whitePudding: null,
      vegetarian: true,
      vegan: true,
    },

    priceLevel: "€€",

    links: {
      website: "https://brotherhubbard.ie/",
      menu: null,
    },

    verification: {
      checkedAt: null,
      sources: [],
    },
  },

  {
    name: "Del Rio's",
    slug: "del-rios",

    location: {
      area: "Marlborough Street",
      locality: "Dublin 1",
      city: "Dublin",
      county: "Dublin",
      address: "Marlborough Street, Dublin 1",
      latitude: null,
      longitude: null,
    },

    breakfast: {
      servedFrom: null,
      servedUntil: null,
      allDay: null,

      fullIrish: true,
      fullIrishPrice: 14.5,

      blackPudding: true,
      whitePudding: true,
      vegetarian: null,
      vegan: null,
    },

    priceLevel: "€",

    links: {
      website: null,
      menu: null,
    },

    verification: {
      checkedAt: null,
      sources: [],
    },
  },

  {
    name: "Two Pups",
    slug: "two-pups",

    location: {
      area: "Francis Street",
      locality: "Dublin 8",
      city: "Dublin",
      county: "Dublin",
      address: "Francis Street, Dublin 8",
      latitude: null,
      longitude: null,
    },

    breakfast: {
      servedFrom: null,
      servedUntil: "14:30",
      allDay: false,

      fullIrish: null,
      fullIrishPrice: null,

      blackPudding: null,
      whitePudding: null,
      vegetarian: true,
      vegan: null,
    },

    priceLevel: "€€",

    links: {
      website: null,
      menu: null,
    },

    verification: {
      checkedAt: null,
      sources: [],
    },
  },
] satisfies Place[];

export default places;
