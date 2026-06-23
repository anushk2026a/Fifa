import type { Match } from "./types";

// kickoffUtc is stored in UTC (ISO 8601).
// The UI converts it to the visitor's browser timezone automatically,
// so Indian users see IST, US users see ET/CT/PT, etc. — just like FIFA's fixtures page.
export const MATCHES: Match[] = [

  // ── GROUP STAGE · MATCHDAY 1 & 2 ─────────────────────────────────────────

  // Jun 18 US → Jun 19 IST
  {
    kickoffUtc: "2026-06-18T14:00:00-05:00", // 14:00 CDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "finished",
    home: { name: "Czechia", code: "CZE", score: 1 },
    away: { name: "South Africa", code: "RSA", score: 1 },
  },
  {
    kickoffUtc: "2026-06-18T20:00:00-05:00", // 20:00 CDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "finished",
    home: { name: "Switzerland", code: "SUI", score: 4 },
    away: { name: "Bosnia", code: "BIH", score: 1 },
  },
  {
    kickoffUtc: "2026-06-18T23:00:00-05:00", // 23:00 CDT
    citySlug: "vancouver", stadium: "BC Place", status: "finished",
    home: { name: "Canada", code: "CAN", score: 6 },
    away: { name: "Qatar", code: "QAT", score: 0 },
  },
  // Jun 19 US
  {
    kickoffUtc: "2026-06-19T12:00:00-05:00", // 12:00 CDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "finished",
    home: { name: "Brazil", code: "BRA" },
    away: { name: "Haiti", code: "HAI" },
  },
  {
    kickoffUtc: "2026-06-19T14:00:00-05:00", // 14:00 CDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "finished",
    home: { name: "Scotland", code: "SCO" },
    away: { name: "Morocco", code: "MAR" },
  },
  {
    kickoffUtc: "2026-06-19T20:00:00-05:00", // 20:00 CDT
    citySlug: "seattle", stadium: "Lumen Field", status: "finished",
    home: { name: "USA", code: "USA" },
    away: { name: "Australia", code: "AUS" },
  },
  {
    kickoffUtc: "2026-06-19T23:00:00-05:00", // 23:00 CDT
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "finished",
    home: { name: "Türkiye", code: "TUR" },
    away: { name: "Paraguay", code: "PAR" },
  },
  // Jun 20 US
  {
    kickoffUtc: "2026-06-20T14:00:00-05:00", // 14:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "finished",
    home: { name: "Mexico", code: "MEX" },
    away: { name: "South Korea", code: "KOR" },
  },
  {
    kickoffUtc: "2026-06-20T15:00:00-05:00", // 15:00 CDT
    citySlug: "toronto", stadium: "BMO Field", status: "finished",
    home: { name: "Germany", code: "GER" },
    away: { name: "Côte d'Ivoire", code: "CIV" },
  },
  {
    kickoffUtc: "2026-06-20T16:00:00-05:00", // 16:00 CDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "finished",
    home: { name: "Argentina", code: "ARG" },
    away: { name: "Algeria", code: "ALG" },
  },
  {
    kickoffUtc: "2026-06-20T19:00:00-05:00", // 19:00 CDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "finished",
    home: { name: "England", code: "ENG" },
    away: { name: "Croatia", code: "CRO" },
  },
  {
    kickoffUtc: "2026-06-20T19:00:00-05:00", // 19:00 CDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "finished",
    home: { name: "Ecuador", code: "ECU" },
    away: { name: "Curaçao", code: "CUW" },
  },
  {
    kickoffUtc: "2026-06-20T23:00:00-05:00", // 23:00 CDT
    citySlug: "monterrey", stadium: "Estadio BBVA", status: "finished",
    home: { name: "Tunisia", code: "TUN" },
    away: { name: "Japan", code: "JPN" },
  },
  {
    kickoffUtc: "2026-06-21T11:00:00-05:00", // 11:00 CDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "finished",
    home: { name: "Spain", code: "ESP" },
    away: { name: "Saudi Arabia", code: "KSA" },
  },
  // Jun 21 US
  {
    kickoffUtc: "2026-06-21T14:00:00-05:00", // 14:00 CDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "finished",
    home: { name: "Belgium", code: "BEL" },
    away: { name: "IR Iran", code: "IRN" },
  },
  {
    kickoffUtc: "2026-06-21T17:00:00-05:00", // 17:00 CDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "finished",
    home: { name: "Uruguay", code: "URU" },
    away: { name: "Cabo Verde", code: "CPV" },
  },
  {
    kickoffUtc: "2026-06-21T20:00:00-05:00", // 20:00 CDT
    citySlug: "vancouver", stadium: "BC Place", status: "finished",
    home: { name: "New Zealand", code: "NZL" },
    away: { name: "Egypt", code: "EGY" },
  },
  {
    kickoffUtc: "2026-06-22T12:00:00-05:00", // 12:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "finished",
    home: { name: "Argentina", code: "ARG" },
    away: { name: "Austria", code: "AUT" },
  },
  // Jun 22 US
  {
    kickoffUtc: "2026-06-22T16:00:00-05:00", // 16:00 CDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "finished",
    home: { name: "France", code: "FRA" },
    away: { name: "Iraq", code: "IRQ" },
  },
  {
    kickoffUtc: "2026-06-22T19:00:00-05:00", // 19:00 CDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "finished",
    home: { name: "Norway", code: "NOR" },
    away: { name: "Senegal", code: "SEN" },
  },
  {
    kickoffUtc: "2026-06-22T22:00:00-05:00", // 22:00 CDT
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "finished",
    home: { name: "Jordan", code: "JOR" },
    away: { name: "Algeria", code: "ALG" },
  },
  {
    kickoffUtc: "2026-06-23T12:00:00-05:00", // 12:00 CDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "Portugal", code: "POR" },
    away: { name: "Uzbekistan", code: "UZB" },
  },

  // ── GROUP STAGE · MATCHDAY 3 ──────────────────────────────────────────────

  // Jun 24
  {
    kickoffUtc: "2026-06-24T14:00:00-05:00", // 14:00 CDT
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "Switzerland", code: "SUI" },
    away: { name: "Canada", code: "CAN" },
  },
  {
    kickoffUtc: "2026-06-24T14:00:00-05:00", // 14:00 CDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "Bosnia", code: "BIH" },
    away: { name: "Qatar", code: "QAT" },
  },
  {
    kickoffUtc: "2026-06-24T17:00:00-05:00", // 17:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "Scotland", code: "SCO" },
    away: { name: "Brazil", code: "BRA" },
  },
  {
    kickoffUtc: "2026-06-24T17:00:00-05:00", // 17:00 CDT
    citySlug: "monterrey", stadium: "Estadio BBVA", status: "scheduled",
    home: { name: "Morocco", code: "MAR" },
    away: { name: "Haiti", code: "HAI" },
  },
  {
    kickoffUtc: "2026-06-24T20:00:00-05:00", // 20:00 CDT
    citySlug: "mexico-city", stadium: "Estadio Azteca", status: "scheduled",
    home: { name: "Czechia", code: "CZE" },
    away: { name: "Mexico", code: "MEX" },
  },
  {
    kickoffUtc: "2026-06-24T20:00:00-05:00", // 20:00 CDT
    citySlug: "guadalajara", stadium: "Estadio Akron", status: "scheduled",
    home: { name: "South Africa", code: "RSA" },
    away: { name: "South Korea", code: "KOR" },
  },
  // Jun 25
  {
    kickoffUtc: "2026-06-25T15:00:00-05:00", // 15:00 CDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "Curaçao", code: "CUW" },
    away: { name: "Côte d'Ivoire", code: "CIV" },
  },
  {
    kickoffUtc: "2026-06-25T15:00:00-05:00", // 15:00 CDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "Ecuador", code: "ECU" },
    away: { name: "Germany", code: "GER" },
  },
  {
    kickoffUtc: "2026-06-25T18:00:00-05:00", // 18:00 CDT
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "Japan", code: "JPN" },
    away: { name: "Sweden", code: "SWE" },
  },
  {
    kickoffUtc: "2026-06-25T18:00:00-05:00", // 18:00 CDT
    citySlug: "monterrey", stadium: "Estadio BBVA", status: "scheduled",
    home: { name: "Tunisia", code: "TUN" },
    away: { name: "Netherlands", code: "NED" },
  },
  {
    kickoffUtc: "2026-06-25T21:00:00-05:00", // 21:00 CDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "Türkiye", code: "TUR" },
    away: { name: "USA", code: "USA" },
  },
  {
    kickoffUtc: "2026-06-25T21:00:00-05:00", // 21:00 CDT
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "scheduled",
    home: { name: "Paraguay", code: "PAR" },
    away: { name: "Australia", code: "AUS" },
  },
  // Jun 26
  {
    kickoffUtc: "2026-06-26T14:00:00-05:00", // 14:00 CDT
    citySlug: "toronto", stadium: "BMO Field", status: "scheduled",
    home: { name: "Norway", code: "NOR" },
    away: { name: "France", code: "FRA" },
  },
  {
    kickoffUtc: "2026-06-26T14:00:00-05:00", // 14:00 CDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled",
    home: { name: "Senegal", code: "SEN" },
    away: { name: "Iraq", code: "IRQ" },
  },
  {
    kickoffUtc: "2026-06-26T19:00:00-05:00", // 19:00 CDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "Cabo Verde", code: "CPV" },
    away: { name: "Saudi Arabia", code: "KSA" },
  },
  {
    kickoffUtc: "2026-06-26T19:00:00-05:00", // 19:00 CDT
    citySlug: "guadalajara", stadium: "Estadio Akron", status: "scheduled",
    home: { name: "Uruguay", code: "URU" },
    away: { name: "Spain", code: "ESP" },
  },
  {
    kickoffUtc: "2026-06-26T22:00:00-05:00", // 22:00 CDT
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "Egypt", code: "EGY" },
    away: { name: "IR Iran", code: "IRN" },
  },
  {
    kickoffUtc: "2026-06-26T22:00:00-05:00", // 22:00 CDT
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "New Zealand", code: "NZL" },
    away: { name: "Belgium", code: "BEL" },
  },
  // Jun 27
  {
    kickoffUtc: "2026-06-23T15:00:00-05:00", // 15:00 CDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled",
    home: { name: "England", code: "ENG" },
    away: { name: "Ghana", code: "GHA" },
  },
  {
    kickoffUtc: "2026-06-23T18:00:00-05:00", // 18:00 CDT
    citySlug: "toronto", stadium: "BMO Field", status: "scheduled",
    home: { name: "Panama", code: "PAN" },
    away: { name: "Croatia", code: "CRO" },
  },
  {
    kickoffUtc: "2026-06-23T21:00:00-05:00", // 21:00 CDT
    citySlug: "guadalajara", stadium: "Estadio Akron", status: "scheduled",
    home: { name: "Colombia", code: "COL" },
    away: { name: "DR Congo", code: "COD" },
  },
  {
    kickoffUtc: "2026-06-27T21:00:00-05:00", // 21:00 CDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "Algeria", code: "ALG" },
    away: { name: "Austria", code: "AUT" },
  },
  {
    kickoffUtc: "2026-06-27T21:00:00-05:00", // 21:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "Jordan", code: "JOR" },
    away: { name: "Argentina", code: "ARG" },
  },

  // ── ROUND OF 32 ───────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-06-28T14:00:00-05:00", // 14:00 CDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-29T12:00:00-05:00", // 12:00 CDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-29T15:30:00-05:00", // 15:30 CDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled",
    home: { name: "Germany", code: "GER" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-29T20:00:00-05:00", // 20:00 CDT
    citySlug: "monterrey", stadium: "Estadio BBVA", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-30T12:00:00-05:00", // 12:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-30T16:00:00-05:00", // 16:00 CDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-30T20:00:00-05:00", // 20:00 CDT
    citySlug: "mexico-city", stadium: "Estadio Azteca", status: "scheduled",
    home: { name: "Mexico", code: "MEX" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-01T11:00:00-05:00", // 11:00 CDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-01T15:00:00-05:00", // 15:00 CDT
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-01T19:00:00-05:00", // 19:00 CDT
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "scheduled",
    home: { name: "USA", code: "USA" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-02T14:00:00-05:00", // 14:00 CDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-02T18:00:00-05:00", // 18:00 CDT
    citySlug: "toronto", stadium: "BMO Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-02T22:00:00-05:00", // 22:00 CDT
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-03T13:00:00-05:00", // 13:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-03T17:00:00-05:00", // 17:00 CDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-03T20:30:00-05:00", // 20:30 CDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── ROUND OF 16 ───────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-04T12:00:00-05:00", // 12:00 CDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-04T16:00:00-05:00", // 16:00 CDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-05T15:00:00-05:00", // 15:00 CDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-05T19:00:00-05:00", // 19:00 CDT
    citySlug: "mexico-city", stadium: "Estadio Azteca", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-06T14:00:00-05:00", // 14:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-06T19:00:00-05:00", // 19:00 CDT
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-07T11:00:00-05:00", // 11:00 CDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-07T15:00:00-05:00", // 15:00 CDT
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── QUARTERFINALS ─────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-09T15:00:00-05:00", // 15:00 CDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-10T14:00:00-05:00", // 14:00 CDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-11T16:00:00-05:00", // 16:00 CDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-11T20:00:00-05:00", // 20:00 CDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── SEMIFINALS ────────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-14T14:00:00-05:00", // 14:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-15T14:00:00-05:00", // 14:00 CDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── THIRD-PLACE MATCH ─────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-18T16:00:00-05:00", // 16:00 CDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── FINAL ─────────────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-19T14:00:00-05:00", // 14:00 CDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

];
