import type { Match } from "./types";

// Phase 1: entered by hand from the official FIFA schedule.
// The home page shows "today" and "tomorrow" based on the current date.
export const MATCHES: Match[] = [
  // June 18
  { date: "2026-06-18", kickoff: "15:00", citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "finished", home: { name: "Czechia", code: "CZE", score: 1 }, away: { name: "South Africa", code: "RSA", score: 1 } },
  { date: "2026-06-18", kickoff: "18:00", citySlug: "los-angeles", stadium: "SoFi Stadium", status: "finished", home: { name: "Switzerland", code: "SUI", score: 4 }, away: { name: "Bosnia", code: "BIH", score: 1 } },
  { date: "2026-06-18", kickoff: "21:00", citySlug: "vancouver", stadium: "BC Place", status: "finished", home: { name: "Canada", code: "CAN", score: 6 }, away: { name: "Qatar", code: "QAT", score: 0 } },

  // June 19
  { date: "2026-06-19", kickoff: "13:00", citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "scheduled", home: { name: "Brazil", code: "BRA" }, away: { name: "Haiti", code: "HAI" } },
  { date: "2026-06-19", kickoff: "15:00", citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled", home: { name: "Scotland", code: "SCO" }, away: { name: "Morocco", code: "MAR" } },
  { date: "2026-06-19", kickoff: "18:00", citySlug: "seattle", stadium: "Lumen Field", status: "scheduled", home: { name: "USA", code: "USA" }, away: { name: "Australia", code: "AUS" } },
  { date: "2026-06-19", kickoff: "21:00", citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "scheduled", home: { name: "Türkiye", code: "TUR" }, away: { name: "Paraguay", code: "PAR" } },

  // June 20
  { date: "2026-06-20", kickoff: "14:00", citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled", home: { name: "Mexico", code: "MEX" }, away: { name: "South Korea", code: "KOR" } },
  { date: "2026-06-20", kickoff: "17:00", citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled", home: { name: "Argentina", code: "ARG" }, away: { name: "Nigeria", code: "NGA" } },
  { date: "2026-06-20", kickoff: "20:00", citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled", home: { name: "England", code: "ENG" }, away: { name: "Ecuador", code: "ECU" } },
];
