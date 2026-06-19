import type { City, Place, ScreeningZone, TransportOption } from "./types";
import { mapsSearch } from "@/lib/utils";

export const FIFA_TICKETS_URL =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/tickets";
const FIFA_TOURNAMENT_URL =
  "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026";

// ── helpers ──────────────────────────────────────────────────────────────
const officialTickets = (cityName: string) => [
  { label: `Official FIFA tickets — ${cityName}`, url: FIFA_TICKETS_URL, official: true },
];

/** A curated place. Phone is intentionally omitted unless verified. */
function place(name: string, city: string, distanceMiles: number, address: string, note?: string): Place {
  return { name, address, mapUrl: mapsSearch(`${name}, ${city}`), distanceMiles, note };
}

function transport(
  stadium: string,
  city: string,
  metro: { title: string; url: string; note?: string },
): TransportOption[] {
  return [
    {
      category: "shared_ride",
      title: "Uber & Lyft pickup zones",
      url: mapsSearch(`${stadium} rideshare pickup, ${city}`),
      note: "Use the stadium's marked rideshare areas on match days.",
    },
    { category: "metro", ...metro },
    {
      category: "parking",
      title: "Pre-book stadium parking",
      url: "https://www.justpark.com/",
      note: "Reserve a spot ahead of match day to skip the queues.",
    },
    {
      category: "getting_there",
      title: `Getting there | ${stadium} | FIFA World Cup 2026`,
      url: FIFA_TOURNAMENT_URL,
    },
  ];
}

function fanFest(city: string, note?: string): ScreeningZone[] {
  return [
    {
      name: `${city} FIFA Fan Festival`,
      type: "fan_festival",
      url: FIFA_TOURNAMENT_URL,
      note: note ?? "Free live screenings, food and music during the tournament (venue confirmed closer to kick-off).",
    },
  ];
}

function seo(name: string, stadium: string) {
  return {
    title: `${name} — FIFA World Cup 2026 Guide | SportsOnePoint`,
    description: `Restaurants, hotels, transportation, tickets and fan zones near ${stadium} for FIFA World Cup 2026 in ${name}.`,
  };
}

// ── cities ───────────────────────────────────────────────────────────────
export const CITIES: City[] = [
  {
    slug: "atlanta",
    name: "Atlanta",
    country: "USA",
    region: "East",
    stadium: { name: "Mercedes-Benz Stadium", address: "1 AMB Dr NW, Atlanta, GA 30313", mapUrl: mapsSearch("Mercedes-Benz Stadium, Atlanta"), capacity: 71000 },
    gettingThere: "MARTA rail runs from the airport to downtown, a short walk from the stadium.",
    bannerImage: "/images/cities/atlanta.jpg",
    restaurants: {
      "1mi": [
        place("Der Biergarten", "Atlanta", 0.4, "300 Marietta St NW, Atlanta, GA", "German beer hall · $$"),
        place("STATS Brewpub", "Atlanta", 0.3, "300 Marietta St NW, Atlanta, GA", "Sports bar · $$"),
        place("Twin Smokers BBQ", "Atlanta", 0.5, "300 Marietta St NW, Atlanta, GA", "Barbecue · $$"),
      ],
      "2mi": [place("The Varsity", "Atlanta", 1.4, "61 North Ave NW, Atlanta, GA", "Iconic drive-in · $")],
      "5mi": [
        place("Mary Mac's Tea Room", "Atlanta", 2.4, "224 Ponce De Leon Ave NE, Atlanta, GA", "Classic Southern · $$"),
        place("Ponce City Market", "Atlanta", 3.1, "675 Ponce De Leon Ave NE, Atlanta, GA", "Food hall"),
      ],
    },
    hotels: {
      "5mi": [
        place("Omni Atlanta Hotel at Centennial Park", "Atlanta", 0.4, "100 CNN Center, Atlanta, GA"),
        place("Embassy Suites by Hilton Atlanta at Centennial Olympic Park", "Atlanta", 0.5, "267 Marietta St NW, Atlanta, GA"),
      ],
      "10mi": [place("The Georgian Terrace Hotel", "Atlanta", 2.5, "659 Peachtree St NE, Atlanta, GA", "Historic")],
    },
    transportation: transport("Mercedes-Benz Stadium", "Atlanta", {
      title: "MARTA rail — GWCC/CNN Center & Vine City stations",
      url: "https://www.itsmarta.com/",
      note: "Both stations are a short walk to the stadium; ~20 min from the airport.",
    }),
    tickets: officialTickets("Atlanta"),
    screeningZones: fanFest("Atlanta"),
    seo: seo("Atlanta", "Mercedes-Benz Stadium"),
  },

  {
    slug: "boston",
    name: "Boston",
    country: "USA",
    region: "East",
    stadium: { name: "Gillette Stadium", address: "1 Patriot Pl, Foxborough, MA 02035", mapUrl: mapsSearch("Gillette Stadium, Foxborough"), capacity: 65000 },
    gettingThere: "Match-day express commuter rail and buses run to Foxborough from Boston's South Station.",
    bannerImage: "/images/cities/boston.jpg",
    restaurants: {
      "1mi": [
        place("Davio's Northern Italian Steakhouse", "Foxborough MA", 0.2, "Patriot Place, Foxborough, MA", "Italian steakhouse · $$$"),
        place("CBS Scene Restaurant & Bar", "Foxborough MA", 0.2, "Patriot Place, Foxborough, MA", "American · $$"),
        place("Six String Grill & Stage", "Foxborough MA", 0.2, "Patriot Place, Foxborough, MA", "American · live music · $$"),
      ],
      "2mi": [place("Tavolino Ristorante", "Foxborough MA", 0.3, "Patriot Place, Foxborough, MA", "Italian · $$")],
    },
    hotels: {
      "5mi": [
        place("Renaissance Boston Patriot Place Hotel & Spa", "Foxborough MA", 0.2, "28 Patriot Pl, Foxborough, MA", "At the stadium"),
        place("Hilton Garden Inn Foxborough Patriot Place", "Foxborough MA", 0.3, "31 Patriot Pl, Foxborough, MA"),
      ],
      "10mi": [place("Residence Inn Foxborough", "Foxborough MA", 1.2, "250 Foxborough Blvd, Foxborough, MA")],
    },
    transportation: transport("Gillette Stadium", "Foxborough", {
      title: "MBTA special event commuter rail to Foxboro",
      url: "https://www.mbta.com/",
      note: "Event trains run from South Station on match days; check the MBTA event schedule.",
    }),
    tickets: officialTickets("Boston"),
    screeningZones: fanFest("Boston"),
    seo: seo("Boston", "Gillette Stadium"),
  },

  {
    slug: "dallas",
    name: "Dallas",
    country: "USA",
    region: "Central",
    stadium: { name: "AT&T Stadium", address: "1 AT&T Way, Arlington, TX 76011", mapUrl: mapsSearch("AT&T Stadium, Arlington TX"), capacity: 80000 },
    gettingThere: "Take a DART connection plus a match-day shuttle, or pre-book parking near the stadium.",
    bannerImage: "/images/cities/dallas.jpg",
    restaurants: {
      "1mi": [
        place("Texas Live!", "Arlington TX", 0.3, "1650 E Randol Mill Rd, Arlington, TX", "Dining & entertainment district"),
        place("Cuates Kitchen", "Arlington TX", 0.8, "Arlington, TX", "Tex-Mex · $$"),
      ],
      "2mi": [place("Prince Lebanese Grill", "Arlington TX", 1.6, "502 W Randol Mill Rd, Arlington, TX", "Mediterranean · $$")],
      "5mi": [place("Mercury Chophouse", "Arlington TX", 3.4, "Arlington, TX", "Steakhouse · $$$")],
      "10mi": [place("Lonesome Dove Western Bistro", "Fort Worth TX", 9.2, "2406 N Main St, Fort Worth, TX", "Western fine dining · $$$")],
    },
    hotels: {
      "5mi": [
        place("Live! by Loews — Arlington", "Arlington TX", 0.4, "1600 E Randol Mill Rd, Arlington, TX", "Walk to the stadium"),
        place("Loews Arlington Hotel", "Arlington TX", 0.6, "888 Nolan Ryan Expy, Arlington, TX"),
      ],
      "10mi": [place("Sheraton Arlington Hotel", "Arlington TX", 1.1, "1500 Convention Center Dr, Arlington, TX")],
    },
    transportation: transport("AT&T Stadium", "Arlington", {
      title: "DART rail + Arlington shuttle",
      url: "https://www.dart.org/",
      note: "DART to a connecting shuttle; there is no direct rail to the stadium.",
    }),
    tickets: officialTickets("Dallas"),
    screeningZones: [
      { name: "Dallas FIFA Fan Festival", type: "fan_festival", address: "Downtown Dallas (venue TBA)", url: FIFA_TOURNAMENT_URL, note: "Free live screenings, food and music during the tournament." },
    ],
    seo: seo("Dallas", "AT&T Stadium"),
  },

  {
    slug: "houston",
    name: "Houston",
    country: "USA",
    region: "Central",
    stadium: { name: "NRG Stadium", address: "1 NRG Pkwy, Houston, TX 77054", mapUrl: mapsSearch("NRG Stadium, Houston"), capacity: 72000 },
    gettingThere: "METRORail's Red Line stops right at NRG Stadium; extra World Cup service runs on match days.",
    bannerImage: "/images/cities/houston.jpg",
    restaurants: {
      "1mi": [
        place("Pappas Bar-B-Q", "Houston TX", 0.9, "8777 S Main St, Houston, TX", "Barbecue · $$"),
        place("Pappadeaux Seafood Kitchen", "Houston TX", 1.0, "6015 Westheimer Rd, Houston, TX", "Cajun seafood · $$"),
      ],
      "5mi": [
        place("Lucille's", "Houston TX", 3.6, "5512 La Branch St, Houston, TX", "Southern · $$$"),
        place("Lupe Tortilla", "Houston TX", 4.2, "Houston, TX", "Tex-Mex · $$"),
      ],
    },
    hotels: {
      "5mi": [
        place("Houston Marriott Medical Center / Museum District", "Houston TX", 2.6, "6580 Fannin St, Houston, TX"),
        place("The Westin Houston Medical Center", "Houston TX", 2.8, "1709 Dryden Rd, Houston, TX"),
      ],
      "10mi": [place("Hilton Houston Plaza/Medical Center", "Houston TX", 3.0, "6633 Travis St, Houston, TX")],
    },
    transportation: transport("NRG Stadium", "Houston", {
      title: "METRORail Red Line — Stadium Park/Astrodome station",
      url: "https://www.ridemetro.org/",
      note: "The Red Line drops you next to the stadium; extra trains run for World Cup matches.",
    }),
    tickets: officialTickets("Houston"),
    screeningZones: fanFest("Houston"),
    seo: seo("Houston", "NRG Stadium"),
  },

  {
    slug: "kansas-city",
    name: "Kansas City",
    country: "USA",
    region: "Central",
    stadium: { name: "Arrowhead Stadium", address: "1 Arrowhead Dr, Kansas City, MO 64129", mapUrl: mapsSearch("Arrowhead Stadium, Kansas City"), capacity: 76000 },
    gettingThere: "Game-day bus passes connect the airport, downtown and the stadium; rideshare and parking are also available.",
    bannerImage: "/images/cities/kansas-city.jpg",
    restaurants: {
      "5mi": [
        place("Gates Bar-B-Q", "Kansas City MO", 2.8, "4707 Paseo Blvd, Kansas City, MO", "KC barbecue · $$"),
        place("Arthur Bryant's Barbeque", "Kansas City MO", 3.0, "1727 Brooklyn Ave, Kansas City, MO", "Legendary barbecue · $$"),
        place("Q39", "Kansas City MO", 4.5, "1000 W 39th St, Kansas City, MO", "Modern barbecue · $$"),
      ],
    },
    hotels: {
      "5mi": [
        place("Drury Inn & Suites Kansas City Stadium", "Kansas City MO", 1.4, "7900 NE 38th St, Kansas City, MO"),
        place("Best Western Plus Seville Plaza Hotel", "Kansas City MO", 4.8, "4309 Main St, Kansas City, MO"),
      ],
      "10mi": [place("Loews Kansas City Hotel", "Kansas City MO", 7.5, "1515 Wyandotte St, Kansas City, MO", "Downtown")],
    },
    transportation: transport("Arrowhead Stadium", "Kansas City", {
      title: "RideKC buses & game-day service",
      url: "https://www.kcata.org/",
      note: "RideKC runs game-day connections; the streetcar serves downtown only.",
    }),
    tickets: officialTickets("Kansas City"),
    screeningZones: fanFest("Kansas City"),
    seo: seo("Kansas City", "Arrowhead Stadium"),
  },

  {
    slug: "los-angeles",
    name: "Los Angeles",
    country: "USA",
    region: "West",
    stadium: { name: "SoFi Stadium", address: "1001 Stadium Dr, Inglewood, CA 90301", mapUrl: mapsSearch("SoFi Stadium, Inglewood"), capacity: 70000 },
    gettingThere: "Metro rail plus stadium shuttles; reserve parking ahead or connect from LAX.",
    bannerImage: "/images/cities/los-angeles.jpg",
    restaurants: {
      "1mi": [
        place("Three Weavers Brewing Company", "Inglewood CA", 0.9, "1031 W Manchester Blvd, Inglewood, CA", "Brewery · $$"),
        place("Dulan's Soul Food Kitchen", "Inglewood CA", 1.0, "202 E Manchester Blvd, Inglewood, CA", "Soul food · $$"),
      ],
      "5mi": [
        place("Randy's Donuts", "Inglewood CA", 2.6, "805 W Manchester Blvd, Inglewood, CA", "Iconic · $"),
        place("Pann's Restaurant", "Los Angeles CA", 3.4, "6710 La Tijera Blvd, Los Angeles, CA", "Diner · $$"),
      ],
    },
    hotels: {
      "5mi": [
        place("H Hotel Los Angeles (Curio Collection by Hilton)", "Los Angeles CA", 3.4, "1717 E Imperial Hwy, El Segundo, CA"),
        place("Hilton Los Angeles Airport", "Los Angeles CA", 3.6, "5711 W Century Blvd, Los Angeles, CA"),
      ],
      "10mi": [place("Cambria Hotel LAX", "El Segundo CA", 4.2, "199 Continental Blvd, El Segundo, CA")],
    },
    transportation: transport("SoFi Stadium", "Inglewood", {
      title: "LA Metro K Line — Downtown Inglewood station",
      url: "https://www.metro.net/",
      note: "Take the K Line to Downtown Inglewood, then a stadium shuttle.",
    }),
    tickets: officialTickets("Los Angeles"),
    screeningZones: fanFest("Los Angeles"),
    seo: seo("Los Angeles", "SoFi Stadium"),
  },

  {
    slug: "miami",
    name: "Miami",
    country: "USA",
    region: "East",
    stadium: { name: "Hard Rock Stadium", address: "347 Don Shula Dr, Miami Gardens, FL 33056", mapUrl: mapsSearch("Hard Rock Stadium, Miami Gardens"), capacity: 65000 },
    gettingThere: "Rideshare and pre-booked parking are the simplest routes to Miami Gardens.",
    bannerImage: "/images/cities/miami.jpg",
    restaurants: {
      "5mi": [
        place("Texas de Brazil", "Miami Lakes FL", 3.2, "15700 NW 57th Ave, Miami Lakes, FL", "Brazilian steakhouse · $$$"),
        place("Pollo Tropical", "Miami Gardens FL", 2.0, "Miami Gardens, FL", "Caribbean · $"),
      ],
      "10mi": [place("Bourbon Steak (JW Marriott Turnberry)", "Aventura FL", 6.5, "19999 W Country Club Dr, Aventura, FL", "Steakhouse · $$$$")],
    },
    hotels: {
      "10mi": [
        place("JW Marriott Miami Turnberry Resort & Spa", "Aventura FL", 6.5, "19999 W Country Club Dr, Aventura, FL"),
        place("Residence Inn Aventura Mall", "Aventura FL", 6.8, "19900 W Country Club Dr, Aventura, FL"),
      ],
    },
    transportation: transport("Hard Rock Stadium", "Miami Gardens", {
      title: "Miami-Dade Transit & match-day shuttles",
      url: "https://www.miamidade.gov/global/transportation.page",
      note: "There's no direct rail; use rideshare, shuttles or Miami-Dade bus connections.",
    }),
    tickets: officialTickets("Miami"),
    screeningZones: fanFest("Miami"),
    seo: seo("Miami", "Hard Rock Stadium"),
  },

  {
    slug: "new-york-new-jersey",
    name: "New York / New Jersey",
    country: "USA",
    region: "East",
    stadium: { name: "MetLife Stadium", address: "1 MetLife Stadium Dr, East Rutherford, NJ 07073", mapUrl: mapsSearch("MetLife Stadium, East Rutherford"), capacity: 82000 },
    gettingThere: "NJ Transit runs match-day trains to the Meadowlands from NY Penn Station via Secaucus Junction.",
    bannerImage: "/images/cities/new-york-new-jersey.jpg",
    restaurants: {
      "2mi": [
        place("Redd's Restaurant & Bar", "Carlstadt NJ", 1.6, "317 Hackensack St, Carlstadt, NJ", "American · $$"),
        place("Il Villaggio", "Carlstadt NJ", 1.8, "651 NJ-17, Carlstadt, NJ", "Italian · $$$"),
      ],
      "5mi": [place("Houlihan's", "Secaucus NJ", 3.2, "1 Plaza Dr, Secaucus, NJ", "American · $$")],
    },
    hotels: {
      "5mi": [
        place("Hilton Meadowlands", "East Rutherford NJ", 0.8, "2 Meadowlands Plaza, East Rutherford, NJ"),
        place("Embassy Suites by Hilton Secaucus Meadowlands", "Secaucus NJ", 3.4, "455 Plaza Dr, Secaucus, NJ"),
      ],
      "10mi": [place("Hyatt Regency Jersey City on the Hudson", "Jersey City NJ", 8.0, "2 Exchange Pl, Jersey City, NJ", "NYC skyline views")],
    },
    transportation: transport("MetLife Stadium", "East Rutherford", {
      title: "NJ Transit — Meadowlands Rail Line (via Secaucus Junction)",
      url: "https://www.njtransit.com/",
      note: "Take NJ Transit to Secaucus Junction, then the Meadowlands train on match days.",
    }),
    tickets: officialTickets("New York / New Jersey"),
    screeningZones: fanFest("New York / New Jersey"),
    seo: seo("New York / New Jersey", "MetLife Stadium"),
  },

  {
    slug: "philadelphia",
    name: "Philadelphia",
    country: "USA",
    region: "East",
    stadium: { name: "Lincoln Financial Field", address: "1 Lincoln Financial Field Way, Philadelphia, PA 19148", mapUrl: mapsSearch("Lincoln Financial Field, Philadelphia"), capacity: 69000 },
    gettingThere: "SEPTA's Broad Street Line drops you steps from the South Philadelphia sports complex.",
    bannerImage: "/images/cities/philadelphia.jpg",
    restaurants: {
      "1mi": [
        place("Xfinity Live! Philadelphia", "Philadelphia PA", 0.3, "1100 Pattison Ave, Philadelphia, PA", "Dining & entertainment"),
        place("Chickie's & Pete's", "Philadelphia PA", 0.9, "1526 Packer Ave, Philadelphia, PA", "Crab fries · sports bar · $$"),
        place("Tony Luke's", "Philadelphia PA", 1.0, "39 E Oregon Ave, Philadelphia, PA", "Cheesesteaks · $"),
      ],
      "5mi": [
        place("Pat's King of Steaks", "Philadelphia PA", 2.4, "1237 E Passyunk Ave, Philadelphia, PA", "Cheesesteaks · $"),
        place("Geno's Steaks", "Philadelphia PA", 2.4, "1219 S 9th St, Philadelphia, PA", "Cheesesteaks · $"),
      ],
    },
    hotels: {
      "5mi": [
        place("Holiday Inn Philadelphia Stadium", "Philadelphia PA", 0.7, "900 Packer Ave, Philadelphia, PA"),
        place("Courtyard Philadelphia South at The Navy Yard", "Philadelphia PA", 1.6, "1001 Intrepid Ave, Philadelphia, PA"),
      ],
      "10mi": [place("Sofitel Philadelphia at Rittenhouse Square", "Philadelphia PA", 4.0, "120 S 17th St, Philadelphia, PA", "Center City")],
    },
    transportation: transport("Lincoln Financial Field", "Philadelphia", {
      title: "SEPTA Broad Street Line — NRG station",
      url: "https://www.septa.org/",
      note: "Ride the Broad Street Line straight to NRG, beside the stadium.",
    }),
    tickets: officialTickets("Philadelphia"),
    screeningZones: fanFest("Philadelphia"),
    seo: seo("Philadelphia", "Lincoln Financial Field"),
  },

  {
    slug: "san-francisco-bay-area",
    name: "San Francisco Bay Area",
    country: "USA",
    region: "West",
    stadium: { name: "Levi's Stadium", address: "4900 Marie P DeBartolo Way, Santa Clara, CA 95054", mapUrl: mapsSearch("Levi's Stadium, Santa Clara"), capacity: 68500 },
    gettingThere: "VTA light rail and Caltrain (with a shuttle) connect to Santa Clara on match days.",
    bannerImage: "/images/cities/san-francisco-bay-area.jpg",
    restaurants: {
      "5mi": [
        place("Pedro's Restaurant & Cantina", "Santa Clara CA", 1.8, "3935 Freedom Cir, Santa Clara, CA", "Mexican · $$"),
        place("Faultline Brewing Company", "Sunnyvale CA", 3.0, "1235 Oakmead Pkwy, Sunnyvale, CA", "Brewpub · $$"),
        place("Birk's Restaurant", "Santa Clara CA", 2.4, "3955 Freedom Cir, Santa Clara, CA", "Steakhouse · $$$"),
      ],
    },
    hotels: {
      "5mi": [
        place("Hilton Santa Clara", "Santa Clara CA", 0.3, "4949 Great America Pkwy, Santa Clara, CA", "Next to the stadium"),
        place("Hyatt Centric Santa Clara Silicon Valley", "Santa Clara CA", 0.4, "5101 Great America Pkwy, Santa Clara, CA"),
        place("Santa Clara Marriott", "Santa Clara CA", 1.2, "2700 Mission College Blvd, Santa Clara, CA"),
      ],
    },
    transportation: transport("Levi's Stadium", "Santa Clara", {
      title: "VTA light rail — Great America station",
      url: "https://www.vta.org/",
      note: "VTA light rail stops at the stadium; Caltrain riders connect via a shuttle.",
    }),
    tickets: officialTickets("San Francisco Bay Area"),
    screeningZones: fanFest("San Francisco Bay Area"),
    seo: seo("San Francisco Bay Area", "Levi's Stadium"),
  },

  {
    slug: "seattle",
    name: "Seattle",
    country: "USA",
    region: "West",
    stadium: { name: "Lumen Field", address: "800 Occidental Ave S, Seattle, WA 98134", mapUrl: mapsSearch("Lumen Field, Seattle"), capacity: 69000 },
    gettingThere: "Link light rail and Sounder trains stop next to the stadium in downtown Seattle.",
    bannerImage: "/images/cities/seattle.jpg",
    restaurants: {
      "1mi": [
        place("The Pyramid Alehouse", "Seattle WA", 0.2, "1201 1st Ave S, Seattle, WA", "Brewpub · $$"),
        place("Henry's Tavern", "Seattle WA", 0.3, "1518 1st Ave S, Seattle, WA", "Sports bar · $$"),
        place("Damn the Weather", "Seattle WA", 0.8, "116 1st Ave S, Seattle, WA", "Pioneer Square · $$"),
      ],
      "2mi": [place("Il Corvo Pasta", "Seattle WA", 0.9, "217 James St, Seattle, WA", "Italian · $$")],
    },
    hotels: {
      "5mi": [
        place("Silver Cloud Hotel Seattle Stadium", "Seattle WA", 0.2, "1046 1st Ave S, Seattle, WA", "Across from the stadium"),
        place("Embassy Suites by Hilton Seattle Downtown Pioneer Square", "Seattle WA", 0.7, "255 S King St, Seattle, WA"),
      ],
    },
    transportation: transport("Lumen Field", "Seattle", {
      title: "Sound Transit Link & Sounder — Stadium station",
      url: "https://www.soundtransit.org/",
      note: "Link light rail and Sounder trains stop right beside Lumen Field.",
    }),
    tickets: officialTickets("Seattle"),
    screeningZones: fanFest("Seattle"),
    seo: seo("Seattle", "Lumen Field"),
  },

  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    region: "East",
    stadium: { name: "BMO Field", address: "170 Princes' Blvd, Toronto, ON M6K 3C3", mapUrl: mapsSearch("BMO Field, Toronto"), capacity: 45000 },
    gettingThere: "TTC streetcars and GO Transit serve Exhibition Place, right beside the stadium.",
    bannerImage: "/images/cities/toronto.jpg",
    restaurants: {
      "1mi": [
        place("Williams Landing", "Toronto", 0.6, "25 Lower Simcoe St, Toronto, ON", "Canadian · $$"),
        place("Mildred's Temple Kitchen", "Toronto", 0.9, "85 Hanna Ave, Toronto, ON", "Brunch · $$$"),
        place("Local Public Eatery Liberty Village", "Toronto", 0.8, "171 East Liberty St, Toronto, ON", "Gastropub · $$"),
      ],
    },
    hotels: {
      "5mi": [
        place("Hotel X Toronto", "Toronto", 0.4, "111 Princes' Blvd, Toronto, ON", "At Exhibition Place"),
        place("Gladstone House", "Toronto", 1.6, "1214 Queen St W, Toronto, ON", "Boutique"),
      ],
      "10mi": [place("Fairmont Royal York", "Toronto", 2.5, "100 Front St W, Toronto, ON", "Downtown landmark")],
    },
    transportation: transport("BMO Field", "Toronto", {
      title: "TTC streetcars 509/511 & GO Transit Exhibition",
      url: "https://www.ttc.ca/",
      note: "Take the 509 Harbourfront or 511 Bathurst streetcar, or GO Transit to Exhibition.",
    }),
    tickets: officialTickets("Toronto"),
    screeningZones: fanFest("Toronto", "Toronto's official Fan Festival is planned at Fort York / Exhibition area — details to be confirmed."),
    seo: seo("Toronto", "BMO Field"),
  },

  {
    slug: "vancouver",
    name: "Vancouver",
    country: "Canada",
    region: "West",
    stadium: { name: "BC Place", address: "777 Pacific Blvd, Vancouver, BC V6B 4Y8", mapUrl: mapsSearch("BC Place, Vancouver"), capacity: 54000 },
    gettingThere: "SkyTrain's Stadium–Chinatown station is right at BC Place.",
    bannerImage: "/images/cities/vancouver.jpg",
    restaurants: {
      "1mi": [
        place("The Keg Steakhouse + Bar — Yaletown", "Vancouver", 0.5, "1011 Mainland St, Vancouver, BC", "Steakhouse · $$$"),
        place("Rodney's Oyster House", "Vancouver", 0.6, "1228 Hamilton St, Vancouver, BC", "Seafood · $$$"),
        place("Chambar", "Vancouver", 0.7, "568 Beatty St, Vancouver, BC", "Belgian · $$$"),
      ],
    },
    hotels: {
      "5mi": [
        place("JW Marriott Parq Vancouver", "Vancouver", 0.2, "39 Smithe St, Vancouver, BC", "Next to BC Place"),
        place("The Westin Grand Vancouver", "Vancouver", 0.6, "433 Robson St, Vancouver, BC"),
        place("Georgian Court Hotel", "Vancouver", 0.3, "773 Beatty St, Vancouver, BC"),
      ],
    },
    transportation: transport("BC Place", "Vancouver", {
      title: "SkyTrain — Stadium–Chinatown station",
      url: "https://www.translink.ca/",
      note: "The Expo Line's Stadium–Chinatown station is at the door of BC Place.",
    }),
    tickets: officialTickets("Vancouver"),
    screeningZones: fanFest("Vancouver", "Vancouver hosts a free fan festival with live matches on big screens — venue confirmed closer to kick-off."),
    seo: seo("Vancouver", "BC Place"),
  },

  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    region: "Central",
    stadium: { name: "Estadio Azteca", address: "Calz. de Tlalpan 3465, Coyoacán, CDMX", mapUrl: mapsSearch("Estadio Azteca, Mexico City"), capacity: 83000 },
    gettingThere: "The Tren Ligero light rail connects the Metro network to the Estadio Azteca stop.",
    bannerImage: "/images/cities/mexico-city.jpg",
    restaurants: {
      "5mi": [
        place("Los Danzantes Coyoacán", "Mexico City", 4.0, "Plaza Jardín Centenario 12, Coyoacán, CDMX", "Contemporary Mexican · $$$"),
        place("El Jarocho", "Mexico City", 4.2, "Av. México 25-C, Coyoacán, CDMX", "Famous coffee · $"),
      ],
      "10mi": [place("Mercado de San Ángel", "Mexico City", 6.0, "Av. Revolución, San Ángel, CDMX", "Market dining")],
    },
    hotels: {
      "10mi": [
        place("Fiesta Inn Perisur", "Mexico City", 5.5, "Periférico Sur 4949, Tlalpan, CDMX"),
        place("Hampton Inn & Suites Mexico City Centro Historico", "Mexico City", 8.0, "Av. Juárez 85, Centro, CDMX"),
      ],
    },
    transportation: transport("Estadio Azteca", "Mexico City", {
      title: "Tren Ligero — Estadio Azteca station",
      url: "https://www.metro.cdmx.gob.mx/",
      note: "Take the Metro to Tasqueña, then the Tren Ligero to Estadio Azteca.",
    }),
    tickets: officialTickets("Mexico City"),
    screeningZones: fanFest("Mexico City"),
    seo: seo("Mexico City", "Estadio Azteca"),
  },

  {
    slug: "guadalajara",
    name: "Guadalajara",
    country: "Mexico",
    region: "Central",
    stadium: { name: "Estadio Akron", address: "Anillo Perif. Sur, Zapopan, Jalisco", mapUrl: mapsSearch("Estadio Akron, Zapopan"), capacity: 49000 },
    gettingThere: "Use rideshare or pre-booked parking to reach Zapopan on match days.",
    bannerImage: "/images/cities/guadalajara.jpg",
    restaurants: {
      "5mi": [
        place("Karne Garibaldi", "Guadalajara", 4.6, "Garibaldi 1306, Guadalajara, Jal.", "Famous fast service · $$"),
        place("La Tequila", "Guadalajara", 4.8, "Av. México 2830, Guadalajara, Jal.", "Mexican · $$$"),
      ],
    },
    hotels: {
      "5mi": [place("Riu Plaza Guadalajara", "Zapopan", 2.5, "Av. de las Rosas 2933, Zapopan, Jal.", "Near Andares")],
      "10mi": [place("Fiesta Americana Guadalajara Country Club", "Guadalajara", 8.0, "Av. Mariano Otero 1313, Guadalajara, Jal.")],
    },
    transportation: transport("Estadio Akron", "Zapopan", {
      title: "Mi Macro Periférico & local transit (SITEUR)",
      url: "https://www.siteur.gob.mx/",
      note: "Transit reaches Zapopan; rideshare is the simplest door-to-door option.",
    }),
    tickets: officialTickets("Guadalajara"),
    screeningZones: fanFest("Guadalajara"),
    seo: seo("Guadalajara", "Estadio Akron"),
  },

  {
    slug: "monterrey",
    name: "Monterrey",
    country: "Mexico",
    region: "Central",
    stadium: { name: "Estadio BBVA", address: "Av. Pablo Livas 2011, Guadalupe, Nuevo León", mapUrl: mapsSearch("Estadio BBVA, Monterrey"), capacity: 53000 },
    gettingThere: "Rideshare and shuttle services are the easiest way to reach Estadio BBVA in Guadalupe.",
    bannerImage: "/images/cities/monterrey.jpg",
    restaurants: {
      "5mi": [
        place("El Gran Pastor", "Monterrey", 4.0, "Av. Gonzalitos, Monterrey, N.L.", "Cabrito · $$"),
        place("La Nacional", "Monterrey", 4.4, "Barrio Antiguo, Monterrey, N.L.", "Mexican · $$"),
      ],
    },
    hotels: {
      "5mi": [place("Holiday Inn Express Monterrey Aeropuerto", "Monterrey", 3.5, "Carr. Miguel Alemán, Apodaca, N.L.")],
      "10mi": [place("Quinta Real Monterrey", "Monterrey", 9.0, "Diego Rivera 500, San Pedro Garza García, N.L.", "Upscale")],
    },
    transportation: transport("Estadio BBVA", "Monterrey", {
      title: "Metrorrey & local transit",
      url: "https://www.nl.gob.mx/metrorrey",
      note: "Metrorrey serves the city; use rideshare for the final stretch to the stadium.",
    }),
    tickets: officialTickets("Monterrey"),
    screeningZones: fanFest("Monterrey"),
    seo: seo("Monterrey", "Estadio BBVA"),
  },
];

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
