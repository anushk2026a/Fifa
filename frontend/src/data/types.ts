// Content contract for the whole Phase 1 site.
// These shapes intentionally mirror the future MongoDB documents
// (docs/07-database.md) so Phase 2 is a data-source swap, not a rewrite.

export type Country = "USA" | "Canada" | "Mexico";
export type Region = "West" | "Central" | "East";

export type Place = {
  name: string;
  phone?: string;
  address: string;
  mapUrl: string; // Google Maps link — powers the [Map] button
  website?: string;
  distanceMiles: number; // curated distance from the stadium
  note?: string; // cuisine / price / extra info
  image?: string; // photo URL (from Google Maps) shown beside the listing
};

export type RestaurantBand = "2mi" | "5mi" | "10mi" | "20mi";
export type HotelBand = "2mi" | "5mi" | "10mi" | "20mi";

export type TransportOption = {
  category: "shared_ride" | "metro" | "parking" | "getting_there";
  title: string;
  url: string;
  note?: string;
  image?: string;
  video?: string; // optional YouTube travel-guide link
};

export type TicketLink = {
  label: string;
  url: string;
  image?: string;
  official: boolean;
};

export type ScreeningZone = {
  name: string;
  type: "fan_festival" | "public_viewing" | "local_event";
  address?: string;
  url: string;
  note?: string;
  image?: string;
};

export type City = {
  slug: string;
  name: string;
  country: Country;
  region: Region;
  stadium: {
    name: string;
    address: string;
    mapUrl: string;
    capacity?: number;
  };
  gettingThere: string; // one-line summary
  bannerImage?: string; // /images/cities/{slug}.jpg
  restaurants: Partial<Record<RestaurantBand, Place[]>>;
  hotels: Partial<Record<HotelBand, Place[]>>;
  transportation: TransportOption[];
  tickets: TicketLink[];
  screeningZones: ScreeningZone[];
  seo: { title: string; description: string };
};

export type Match = {
  date: string; // YYYY-MM-DD, venue-local
  kickoff: string; // HH:mm, venue-local
  citySlug: string;
  stadium: string;
  home: { name: string; code: string; score?: number };
  away: { name: string; code: string; score?: number };
  status: "scheduled" | "live" | "finished";
};

export type NewsItem = {
  id?: string; // present for items served by the backend
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  url: string;
  source?: string;
  image?: string;
};

export type FaqItem = { q: string; a: string };
