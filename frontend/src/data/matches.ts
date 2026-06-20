import type { Match } from "./types";

// Phase 1: entered by hand from the official FIFA schedule.
// The home page shows "today" and "tomorrow" based on the current date.
export const MATCHES: Match[] = [
  // June 18
  {
    date: "2026-06-18",
    kickoff: "15:00",
    citySlug: "atlanta",
    stadium: "Mercedes-Benz Stadium",
    status: "finished",
    home: { name: "Czechia", code: "CZE", score: 1 },
    away: { name: "South Africa", code: "RSA", score: 1 },
  },
  {
    date: "2026-06-18",
    kickoff: "18:00",
    citySlug: "los-angeles",
    stadium: "SoFi Stadium",
    status: "finished",
    home: { name: "Switzerland", code: "SUI", score: 4 },
    away: { name: "Bosnia", code: "BIH", score: 1 },
  },
  {
    date: "2026-06-18",
    kickoff: "21:00",
    citySlug: "vancouver",
    stadium: "BC Place",
    status: "finished",
    home: { name: "Canada", code: "CAN", score: 6 },
    away: { name: "Qatar", code: "QAT", score: 0 },
  },

  // June 19
  {
    date: "2026-06-19",
    kickoff: "13:00",
    citySlug: "philadelphia",
    stadium: "Lincoln Financial Field",
    status: "scheduled",
    home: { name: "Brazil", code: "BRA" },
    away: { name: "Haiti", code: "HAI" },
  },
  {
    date: "2026-06-19",
    kickoff: "15:00",
    citySlug: "boston",
    stadium: "Gillette Stadium",
    status: "scheduled",
    home: { name: "Scotland", code: "SCO" },
    away: { name: "Morocco", code: "MAR" },
  },
  {
    date: "2026-06-19",
    kickoff: "18:00",
    citySlug: "seattle",
    stadium: "Lumen Field",
    status: "scheduled",
    home: { name: "USA", code: "USA" },
    away: { name: "Australia", code: "AUS" },
  },
  {
    date: "2026-06-19",
    kickoff: "21:00",
    citySlug: "san-francisco-bay-area",
    stadium: "Levi's Stadium",
    status: "scheduled",
    home: { name: "Türkiye", code: "TUR" },
    away: { name: "Paraguay", code: "PAR" },
  },

  // June 20
  {
    date: "2026-06-20",
    kickoff: "14:00",
    citySlug: "dallas",
    stadium: "AT&T Stadium",
    status: "scheduled",
    home: { name: "Mexico", code: "MEX" },
    away: { name: "South Korea", code: "KOR" },
  },
  {
    date: "2026-06-20",
    kickoff: "17:00",
    citySlug: "miami",
    stadium: "Hard Rock Stadium",
    status: "scheduled",
    home: { name: "Argentina", code: "ARG" },
    away: { name: "Nigeria", code: "NGA" },
  },
  {
    date: "2026-06-20",
    kickoff: "20:00",
    citySlug: "new-york-new-jersey",
    stadium: "MetLife Stadium",
    status: "scheduled",
    home: { name: "England", code: "ENG" },
    away: { name: "Ecuador", code: "ECU" },
  },
  //June 21
  {
    date: "2026-06-20",
    kickoff: "01:30",
    citySlug: "toronto",
    stadium: "Toronto Stadium",
    status: "scheduled",
    home: { name: "Germany", code: "GER" },
    away: { name: "Côte d'Ivoire", code: "CIV" },
  },
  {
    date: "2026-06-20",
    kickoff: "05:30",
    citySlug: "kansas-city",
    stadium: "Kansas City Stadium",
    status: "scheduled",
    home: { name: "Ecuador", code: "ECU" },
    away: { name: "Curaçao", code: "CUW" },
  },
  {
    date: "2026-06-20",
    kickoff: "09:30",
    citySlug: "monterrey",
    stadium: "Monterrey Stadium",
    status: "scheduled",
    home: { name: "Tunisia", code: "TUN" },
    away: { name: "Japan", code: "JPN" },
  },
  {
    date: "2026-06-20",
    kickoff: "21:30",
    citySlug: "atlanta",
    stadium: "Atlanta Stadium",
    status: "scheduled",
    home: { name: "Spain", code: "ESP" },
    away: { name: "Saudi Arabia", code: "KSA" },
  },
  //June 22

  {

    date: "2026-06-22",
    kickoff: "00:30",
    citySlug: "los-angeles",
    stadium: "Los Angeles Stadium",
    status: "scheduled",
    home: { name: "Belgium", code: "BEL" },
    away: { name: "IR Iran", code: "IRN" },
  },
  {
    date: "2026-06-22",
    kickoff: "03:30",
    citySlug: "miami",
    stadium: "Miami Stadium",
    status: "scheduled",
    home: { name: "Uruguay", code: "URU" },
    away: { name: "Cabo Verde", code: "CPV" },
  },
  {
    date: "2026-06-22",
    kickoff: "06:30",
    citySlug: "vancouver",
    stadium: "BC Place Vancouver",
    status: "scheduled",
    home: { name: "New Zealand", code: "NZL" },
    away: { name: "Egypt", code: "EGY" },
  },
  {
    date: "2026-06-22",
    kickoff: "22:30",
    citySlug: "dallas",
    stadium: "Dallas Stadium",
    status: "scheduled",
    home: { name: "Argentina", code: "ARG" },
    away: { name: "Austria", code: "AUT" },
  },
  //June 23
  {     
    date: "2026-06-23",
    kickoff: "02:30",
    citySlug: "philadelphia",
    stadium: "Philadelphia Stadium",
    status: "scheduled",
    home: { name: "France", code: "FRA" },
    away: { name: "Iraq", code: "IRQ" }
  },
  {
    date: "2026-06-23",
    kickoff: "05:30",
    citySlug: "new-york-new-jersey",
    stadium: "New York/New Jersey Stadium",
    status: "scheduled",
    home: { name: "Norway", code: "NOR" },
    away: { name: "Senegal", code: "SEN" }
  },
  {
    date: "2026-06-23",
    kickoff: "08:30",
    citySlug: "san-francisco-bay-area",
    stadium: "San Francisco Bay Area Stadium",
    status: "scheduled",
    home: { name: "Jordan", code: "JOR" },
    away: { name: "Algeria", code: "ALG" }
  },
  {
    date: "2026-06-23",
    kickoff: "22:30",
    citySlug: "houston",
    stadium: "Houston Stadium",
    status: "scheduled",
    home: { name: "Portugal", code: "POR" },
    away: { name: "Uzbekistan", code: "UZB" }
  }

];
