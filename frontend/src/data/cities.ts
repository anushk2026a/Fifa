import type { City } from "./types";
import { mapsSearch } from "@/lib/utils";

export const FIFA_TICKETS_URL =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/tickets";

const officialTickets = (cityName: string) => ({
  label: `Official FIFA tickets — ${cityName}`,
  url: FIFA_TICKETS_URL,
  official: true,
});

// Phase 1: content is curated by hand. Dallas is the fully-populated
// reference city; the others carry core data + structure and get their
// restaurant/hotel listings filled in over time (empty bands render a
// graceful "coming soon" state — see docs/03-user-flows.md).

export const CITIES: City[] = [
  {
    slug: "dallas",
    name: "Dallas",
    country: "USA",
    region: "Central",
    stadium: {
      name: "AT&T Stadium",
      address: "1 AT&T Way, Arlington, TX 76011",
      mapUrl: mapsSearch("AT&T Stadium, Arlington, TX"),
      capacity: 80000,
    },
    gettingThere: "Take DART rail toward Arlington plus a match-day shuttle, or pre-book parking near the stadium.",
    bannerImage: "/images/cities/dallas.jpg",
    restaurants: {
      "1mi": [
        {
          name: "Texas Live!",
          phone: "(817) 852-6688",
          address: "1650 E Randol Mill Rd, Arlington, TX 76011",
          mapUrl: mapsSearch("Texas Live!, Arlington, TX"),
          website: "https://texas-live.com",
          distanceMiles: 0.3,
          note: "Sports dining & entertainment district next to the stadium",
        },
        {
          name: "Cuates Kitchen",
          phone: "(817) 459-2900",
          address: "Arlington, TX",
          mapUrl: mapsSearch("Cuates Kitchen, Arlington, TX"),
          distanceMiles: 0.8,
          note: "Tex-Mex · $$",
        },
      ],
      "2mi": [
        {
          name: "Prince Lebanese Grill",
          phone: "(817) 469-1811",
          address: "502 W Randol Mill Rd, Arlington, TX 76011",
          mapUrl: mapsSearch("Prince Lebanese Grill, Arlington, TX"),
          distanceMiles: 1.6,
          note: "Mediterranean · $$",
        },
      ],
      "5mi": [
        {
          name: "Mercury Chophouse",
          address: "Arlington, TX",
          mapUrl: mapsSearch("Mercury Chophouse, Arlington, TX"),
          distanceMiles: 3.4,
          note: "Steakhouse · $$$",
        },
      ],
      "10mi": [
        {
          name: "Lonesome Dove (Fort Worth)",
          address: "2406 N Main St, Fort Worth, TX 76164",
          mapUrl: mapsSearch("Lonesome Dove Western Bistro, Fort Worth, TX"),
          distanceMiles: 9.2,
          note: "Western fine dining · $$$",
        },
      ],
    },
    hotels: {
      "5mi": [
        {
          name: "Live! by Loews — Arlington",
          phone: "(682) 313-2500",
          address: "1600 E Randol Mill Rd, Arlington, TX 76011",
          mapUrl: mapsSearch("Live! by Loews Arlington, TX"),
          website: "https://www.loewshotels.com/live-arlington",
          distanceMiles: 0.4,
          note: "Walking distance to the stadium",
        },
        {
          name: "Loews Arlington Hotel",
          address: "888 Nolan Ryan Expy, Arlington, TX 76011",
          mapUrl: mapsSearch("Loews Arlington Hotel, TX"),
          distanceMiles: 0.6,
        },
      ],
      "10mi": [
        {
          name: "Sheraton Arlington Hotel",
          address: "1500 Convention Center Dr, Arlington, TX 76011",
          mapUrl: mapsSearch("Sheraton Arlington Hotel, TX"),
          distanceMiles: 1.1,
        },
      ],
    },
    transportation: [
      {
        category: "shared_ride",
        title: "Uber & Lyft designated pickup zones",
        url: mapsSearch("AT&T Stadium rideshare pickup, Arlington, TX"),
        note: "Use the stadium's marked rideshare lots on match days.",
      },
      {
        category: "metro",
        title: "DART rail + Arlington shuttle",
        url: "https://www.dart.org/",
        note: "DART to a connecting shuttle; no direct rail to the stadium.",
      },
      {
        category: "parking",
        title: "Pre-book stadium parking (JustPark)",
        url: "https://www.justpark.com/",
        note: "Reserve a spot ahead of match day to skip the queues.",
      },
      {
        category: "getting_there",
        title: "Getting there | AT&T Stadium | FIFA World Cup 2026",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
        note: "We tested the train & shuttle route to the stadium for World Cup matches.",
      },
    ],
    tickets: [officialTickets("Dallas")],
    screeningZones: [
      {
        name: "Dallas FIFA Fan Festival",
        type: "fan_festival",
        address: "Downtown Dallas (venue TBA)",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
        note: "Free live screenings, food, and music during the tournament.",
      },
    ],
    seo: {
      title: "Dallas — FIFA World Cup 2026 Guide | SportsOnePoint",
      description:
        "Restaurants, hotels, transportation, tickets and fan zones near AT&T Stadium for FIFA World Cup 2026 in Dallas.",
    },
  },

  stub("atlanta", "Atlanta", "USA", "East", "Mercedes-Benz Stadium", "1 AMB Dr NW, Atlanta, GA 30313", "MARTA rail runs from the airport to downtown, a short walk from the stadium."),
  stub("boston", "Boston", "USA", "East", "Gillette Stadium", "1 Patriot Pl, Foxborough, MA 02035", "Match-day express trains and buses run to Foxborough from Boston."),
  stub("houston", "Houston", "USA", "Central", "NRG Stadium", "1 NRG Pkwy, Houston, TX 77054", "METRORail's Red Line stops right at NRG Stadium."),
  stub("kansas-city", "Kansas City", "USA", "Central", "Arrowhead Stadium", "1 Arrowhead Dr, Kansas City, MO 64129", "Game-day bus passes connect the airport, downtown and the stadium."),
  stub("los-angeles", "Los Angeles", "USA", "West", "SoFi Stadium", "1001 Stadium Dr, Inglewood, CA 90301", "Metro rail plus stadium shuttles; reserve parking or use LAX connections."),
  stub("miami", "Miami", "USA", "East", "Hard Rock Stadium", "347 Don Shula Dr, Miami Gardens, FL 33056", "Rideshare and pre-booked parking are the simplest routes to Miami Gardens."),
  stub("new-york-new-jersey", "New York / New Jersey", "USA", "East", "MetLife Stadium", "1 MetLife Stadium Dr, East Rutherford, NJ 07073", "NJ Transit runs match-day trains to the Meadowlands from NY Penn Station."),
  stub("philadelphia", "Philadelphia", "USA", "East", "Lincoln Financial Field", "1 Lincoln Financial Field Way, Philadelphia, PA 19148", "SEPTA's Broad Street Line drops you steps from the stadium."),
  stub("san-francisco-bay-area", "San Francisco Bay Area", "USA", "West", "Levi's Stadium", "4900 Marie P DeBartolo Way, Santa Clara, CA 95054", "VTA light rail and Caltrain connect to Santa Clara on match days."),
  stub("seattle", "Seattle", "USA", "West", "Lumen Field", "800 Occidental Ave S, Seattle, WA 98134", "Link light rail and Sounder trains stop next to the stadium downtown."),
  stub("toronto", "Toronto", "Canada", "East", "BMO Field", "170 Princes' Blvd, Toronto, ON M6K 3C3", "Streetcars and GO Transit serve Exhibition Place beside the stadium."),
  stub("vancouver", "Vancouver", "Canada", "West", "BC Place", "777 Pacific Blvd, Vancouver, BC V6B 4Y8", "SkyTrain's Stadium–Chinatown station is right at BC Place."),
  stub("mexico-city", "Mexico City", "Mexico", "Central", "Estadio Azteca", "Calz. de Tlalpan 3465, Coyoacán, CDMX", "The Tren Ligero light rail connects the metro network to the stadium."),
  stub("guadalajara", "Guadalajara", "Mexico", "Central", "Estadio Akron", "Anillo Perif. Sur, Zapopan, Jalisco", "Use rideshare or pre-booked parking to reach Zapopan on match days."),
  stub("monterrey", "Monterrey", "Mexico", "Central", "Estadio BBVA", "Av. Pablo Livas 2011, Guadalupe, Nuevo León", "Rideshare and shuttle services are the easiest way to Estadio BBVA."),
];

function stub(
  slug: string,
  name: string,
  country: City["country"],
  region: City["region"],
  stadiumName: string,
  stadiumAddress: string,
  gettingThere: string,
): City {
  return {
    slug,
    name,
    country,
    region,
    stadium: {
      name: stadiumName,
      address: stadiumAddress,
      mapUrl: mapsSearch(`${stadiumName}, ${name}`),
    },
    gettingThere,
    bannerImage: `/images/cities/${slug}.jpg`,
    restaurants: {},
    hotels: {},
    transportation: [
      {
        category: "getting_there",
        title: `Getting there | ${stadiumName} | FIFA World Cup 2026`,
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
      },
    ],
    tickets: [officialTickets(name)],
    screeningZones: [
      {
        name: `${name} FIFA Fan Festival`,
        type: "fan_festival",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
        note: "Official fan festival details to be confirmed closer to the tournament.",
      },
    ],
    seo: {
      title: `${name} — FIFA World Cup 2026 Guide | SportsOnePoint`,
      description: `Restaurants, hotels, transportation, tickets and fan zones near ${stadiumName} for FIFA World Cup 2026 in ${name}.`,
    },
  };
}

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export const COUNTRY_ORDER: City["country"][] = ["USA", "Canada", "Mexico"];

export function citiesByCountry(): Record<City["country"], City[]> {
  return {
    USA: CITIES.filter((c) => c.country === "USA"),
    Canada: CITIES.filter((c) => c.country === "Canada"),
    Mexico: CITIES.filter((c) => c.country === "Mexico"),
  };
}
