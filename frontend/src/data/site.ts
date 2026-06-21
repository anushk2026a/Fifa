export const SITE = {
  name: "FIFA-One Point",
  domain: "FIFA-One Point.com",
  tagline: "Your single point of reference for FIFA 2026.",
  description:
    "FIFA World Cup 2026 in one place — host cities, today's & tomorrow's matches, and the restaurants, hotels, transport, tickets and fan zones near every stadium.",
  fifaScheduleUrl:
    "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures?country=&wtw-filter=ALL",
};

// Primary navigation. "Sports" is the client's name for the Home page.
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Sports", href: "/" },
  { label: "Locations", href: "/locations" },
  { label: "News", href: "/news" },
  { label: "Stories", href: "/stories" },
  { label: "Share Experiences", href: "/contact" },
];
