import type { Match } from "./types";

// kickoffUtc is stored in UTC (ISO 8601).
// The UI converts it to the visitor's browser timezone automatically,
// so Indian users see IST, US users see ET/CT/PT, etc. — just like FIFA's fixtures page.
export const MATCHES: Match[] = [

  // ── GROUP STAGE · MATCHDAY 1 & 2 ─────────────────────────────────────────

  // Jun 18 US → Jun 19 IST
  {
    kickoffUtc: "2026-06-18T19:00:00Z", // Atlanta 15:00 EDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "finished",
    home: { name: "Czechia", code: "CZE", score: 1 },
    away: { name: "South Africa", code: "RSA", score: 1 },
  },
  {
    kickoffUtc: "2026-06-19T01:00:00Z", // Los Angeles 18:00 PDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "finished",
    home: { name: "Switzerland", code: "SUI", score: 4 },
    away: { name: "Bosnia", code: "BIH", score: 1 },
  },
  {
    kickoffUtc: "2026-06-19T04:00:00Z", // Vancouver 21:00 PDT
    citySlug: "vancouver", stadium: "BC Place", status: "finished",
    home: { name: "Canada", code: "CAN", score: 6 },
    away: { name: "Qatar", code: "QAT", score: 0 },
  },
  // Jun 19 US
  {
    kickoffUtc: "2026-06-19T17:00:00Z", // Philadelphia 13:00 EDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "finished",
    home: { name: "Brazil", code: "BRA" },
    away: { name: "Haiti", code: "HAI" },
  },
  {
    kickoffUtc: "2026-06-19T19:00:00Z", // Boston 15:00 EDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "finished",
    home: { name: "Scotland", code: "SCO" },
    away: { name: "Morocco", code: "MAR" },
  },
  {
    kickoffUtc: "2026-06-20T01:00:00Z", // Seattle 18:00 PDT
    citySlug: "seattle", stadium: "Lumen Field", status: "finished",
    home: { name: "USA", code: "USA" },
    away: { name: "Australia", code: "AUS" },
  },
  {
    kickoffUtc: "2026-06-20T04:00:00Z", // San Francisco Bay Area 21:00 PDT
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "finished",
    home: { name: "Türkiye", code: "TUR" },
    away: { name: "Paraguay", code: "PAR" },
  },
  // Jun 20 US
  {
    kickoffUtc: "2026-06-20T19:00:00Z", // Dallas 14:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "finished",
    home: { name: "Mexico", code: "MEX" },
    away: { name: "South Korea", code: "KOR" },
  },
  {
    kickoffUtc: "2026-06-20T20:00:00Z", // Toronto 16:00 EDT
    citySlug: "toronto", stadium: "BMO Field", status: "finished",
    home: { name: "Germany", code: "GER" },
    away: { name: "Côte d'Ivoire", code: "CIV" },
  },
  {
    kickoffUtc: "2026-06-20T21:00:00Z", // Miami 17:00 EDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "finished",
    home: { name: "Argentina", code: "ARG" },
    away: { name: "Nigeria", code: "NGA" },
  },
  {
    kickoffUtc: "2026-06-21T00:00:00Z", // New York/NJ 20:00 EDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "finished",
    home: { name: "England", code: "ENG" },
    away: { name: "Ecuador", code: "ECU" },
  },
  {
    kickoffUtc: "2026-06-21T00:00:00Z", // Kansas City 19:00 CDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "finished",
    home: { name: "Ecuador", code: "ECU" },
    away: { name: "Curaçao", code: "CUW" },
  },
  {
    kickoffUtc: "2026-06-21T04:00:00Z", // Monterrey 23:00 CDT
    citySlug: "monterrey", stadium: "Estadio BBVA", status: "finished",
    home: { name: "Tunisia", code: "TUN" },
    away: { name: "Japan", code: "JPN" },
  },
  {
    kickoffUtc: "2026-06-21T16:00:00Z", // Atlanta 12:00 EDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "finished",
    home: { name: "Spain", code: "ESP" },
    away: { name: "Saudi Arabia", code: "KSA" },
  },
  // Jun 21 US
  {
    kickoffUtc: "2026-06-21T19:00:00Z", // Los Angeles 12:00 PDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "finished",
    home: { name: "Belgium", code: "BEL" },
    away: { name: "IR Iran", code: "IRN" },
  },
  {
    kickoffUtc: "2026-06-21T22:00:00Z", // Miami 18:00 EDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "finished",
    home: { name: "Uruguay", code: "URU" },
    away: { name: "Cabo Verde", code: "CPV" },
  },
  {
    kickoffUtc: "2026-06-22T01:00:00Z", // Vancouver 18:00 PDT
    citySlug: "vancouver", stadium: "BC Place", status: "finished",
    home: { name: "New Zealand", code: "NZL" },
    away: { name: "Egypt", code: "EGY" },
  },
  {
    kickoffUtc: "2026-06-22T17:00:00Z", // Dallas 12:00 CDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "finished",
    home: { name: "Argentina", code: "ARG" },
    away: { name: "Austria", code: "AUT" },
  },
  // Jun 22 US
  {
    kickoffUtc: "2026-06-22T21:00:00Z", // Philadelphia 17:00 EDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "finished",
    home: { name: "France", code: "FRA" },
    away: { name: "Iraq", code: "IRQ" },
  },
  {
    kickoffUtc: "2026-06-23T00:00:00Z", // New York/NJ 20:00 EDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "finished",
    home: { name: "Norway", code: "NOR" },
    away: { name: "Senegal", code: "SEN" },
  },
  {
    kickoffUtc: "2026-06-23T03:00:00Z", // San Francisco Bay Area 20:00 PDT
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "finished",
    home: { name: "Jordan", code: "JOR" },
    away: { name: "Algeria", code: "ALG" },
  },
  {
    kickoffUtc: "2026-06-23T17:00:00Z", // Houston 12:00 CDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "Portugal", code: "POR" },
    away: { name: "Uzbekistan", code: "UZB" },
  },

  // ── GROUP STAGE · MATCHDAY 3 ──────────────────────────────────────────────

  // Jun 24
  {
    kickoffUtc: "2026-06-24T19:00:00Z", // 15:00 EDT
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "Switzerland", code: "SUI" },
    away: { name: "Canada", code: "CAN" },
  },
  {
    kickoffUtc: "2026-06-24T19:00:00Z", // 15:00 EDT
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "Bosnia", code: "BIH" },
    away: { name: "Qatar", code: "QAT" },
  },
  {
    kickoffUtc: "2026-06-24T22:00:00Z", // 18:00 EDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "Scotland", code: "SCO" },
    away: { name: "Brazil", code: "BRA" },
  },
  {
    kickoffUtc: "2026-06-24T22:00:00Z", // 18:00 EDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "Morocco", code: "MAR" },
    away: { name: "Haiti", code: "HAI" },
  },
  {
    kickoffUtc: "2026-06-25T01:00:00Z", // 21:00 EDT Jun 24
    citySlug: "mexico-city", stadium: "Estadio Azteca", status: "scheduled",
    home: { name: "Czechia", code: "CZE" },
    away: { name: "Mexico", code: "MEX" },
  },
  {
    kickoffUtc: "2026-06-25T01:00:00Z", // 21:00 EDT Jun 24
    citySlug: "monterrey", stadium: "Estadio BBVA", status: "scheduled",
    home: { name: "South Africa", code: "RSA" },
    away: { name: "South Korea", code: "KOR" },
  },
  // Jun 25
  {
    kickoffUtc: "2026-06-25T20:00:00Z", // 16:00 EDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "scheduled",
    home: { name: "Curaçao", code: "CUW" },
    away: { name: "Côte d'Ivoire", code: "CIV" },
  },
  {
    kickoffUtc: "2026-06-25T20:00:00Z", // 16:00 EDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "Ecuador", code: "ECU" },
    away: { name: "Germany", code: "GER" },
  },
  {
    kickoffUtc: "2026-06-25T23:00:00Z", // 19:00 EDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "Japan", code: "JPN" },
    away: { name: "Sweden", code: "SWE" },
  },
  {
    kickoffUtc: "2026-06-25T23:00:00Z", // 19:00 EDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "Tunisia", code: "TUN" },
    away: { name: "Netherlands", code: "NED" },
  },
  {
    kickoffUtc: "2026-06-26T02:00:00Z", // 22:00 EDT Jun 25
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "Türkiye", code: "TUR" },
    away: { name: "USA", code: "USA" },
  },
  {
    kickoffUtc: "2026-06-26T02:00:00Z", // 22:00 EDT Jun 25
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "scheduled",
    home: { name: "Paraguay", code: "PAR" },
    away: { name: "Australia", code: "AUS" },
  },
  // Jun 26
  {
    kickoffUtc: "2026-06-26T19:00:00Z", // 15:00 EDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled",
    home: { name: "Norway", code: "NOR" },
    away: { name: "France", code: "FRA" },
  },
  {
    kickoffUtc: "2026-06-26T19:00:00Z", // 15:00 EDT
    citySlug: "toronto", stadium: "BMO Field", status: "scheduled",
    home: { name: "Senegal", code: "SEN" },
    away: { name: "Iraq", code: "IRQ" },
  },
  {
    kickoffUtc: "2026-06-27T00:00:00Z", // 20:00 EDT Jun 26
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "Cabo Verde", code: "CPV" },
    away: { name: "Saudi Arabia", code: "KSA" },
  },
  {
    kickoffUtc: "2026-06-27T00:00:00Z", // 20:00 EDT Jun 26
    citySlug: "guadalajara", stadium: "Estadio Akron", status: "scheduled",
    home: { name: "Uruguay", code: "URU" },
    away: { name: "Spain", code: "ESP" },
  },
  {
    kickoffUtc: "2026-06-27T03:00:00Z", // 23:00 EDT Jun 26
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "Egypt", code: "EGY" },
    away: { name: "IR Iran", code: "IRN" },
  },
  {
    kickoffUtc: "2026-06-27T03:00:00Z", // 23:00 EDT Jun 26
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "New Zealand", code: "NZL" },
    away: { name: "Belgium", code: "BEL" },
  },
  // Jun 27
  {
    kickoffUtc: "2026-06-27T21:00:00Z", // 17:00 EDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "Panama", code: "PAN" },
    away: { name: "England", code: "ENG" },
  },
  {
    kickoffUtc: "2026-06-27T21:00:00Z", // 17:00 EDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "scheduled",
    home: { name: "Croatia", code: "CRO" },
    away: { name: "Ghana", code: "GHA" },
  },
  {
    kickoffUtc: "2026-06-27T23:30:00Z", // 19:30 EDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "Colombia", code: "COL" },
    away: { name: "Portugal", code: "POR" },
  },
  {
    kickoffUtc: "2026-06-27T23:30:00Z", // 19:30 EDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "DR Congo", code: "COD" },
    away: { name: "Uzbekistan", code: "UZB" },
  },
  {
    kickoffUtc: "2026-06-28T02:00:00Z", // 22:00 EDT Jun 27
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "Algeria", code: "ALG" },
    away: { name: "Austria", code: "AUT" },
  },
  {
    kickoffUtc: "2026-06-28T02:00:00Z", // 22:00 EDT Jun 27
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "Jordan", code: "JOR" },
    away: { name: "Argentina", code: "ARG" },
  },

  // ── ROUND OF 32 ───────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-06-28T19:00:00Z", // Sun 15:00 EDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-29T17:00:00Z", // Mon 13:00 EDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-29T20:30:00Z", // Mon 16:30 EDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled",
    home: { name: "Germany", code: "GER" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-30T01:00:00Z", // Mon 21:00 EDT
    citySlug: "monterrey", stadium: "Estadio BBVA", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-30T17:00:00Z", // Tue 13:00 EDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-06-30T21:00:00Z", // Tue 17:00 EDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-01T01:00:00Z", // Tue 21:00 EDT
    citySlug: "mexico-city", stadium: "Estadio Azteca", status: "scheduled",
    home: { name: "Mexico", code: "MEX" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-01T16:00:00Z", // Wed 12:00 EDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-01T20:00:00Z", // Wed 16:00 EDT
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-02T00:00:00Z", // Wed 20:00 EDT
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "scheduled",
    home: { name: "USA", code: "USA" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-02T19:00:00Z", // Thu 15:00 EDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-02T23:00:00Z", // Thu 19:00 EDT
    citySlug: "toronto", stadium: "BMO Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-03T03:00:00Z", // Thu 23:00 EDT
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-03T18:00:00Z", // Fri 14:00 EDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-03T22:00:00Z", // Fri 18:00 EDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-04T01:30:00Z", // Fri 21:30 EDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── ROUND OF 16 ───────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-04T17:00:00Z", // Sat 13:00 EDT
    citySlug: "houston", stadium: "NRG Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-04T21:00:00Z", // Sat 17:00 EDT
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-05T20:00:00Z", // Sun 16:00 EDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-06T00:00:00Z", // Sun 20:00 EDT
    citySlug: "mexico-city", stadium: "Estadio Azteca", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-06T19:00:00Z", // Mon 15:00 EDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-07T00:00:00Z", // Mon 20:00 EDT
    citySlug: "seattle", stadium: "Lumen Field", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-07T16:00:00Z", // Tue 12:00 EDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-07T20:00:00Z", // Tue 16:00 EDT
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── QUARTERFINALS ─────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-09T20:00:00Z", // Thu 16:00 EDT
    citySlug: "boston", stadium: "Gillette Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-10T19:00:00Z", // Fri 15:00 EDT
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-11T21:00:00Z", // Sat 17:00 EDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-12T01:00:00Z", // Sat 21:00 EDT
    citySlug: "kansas-city", stadium: "Arrowhead Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── SEMIFINALS ────────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-14T19:00:00Z", // Tue 15:00 EDT
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },
  {
    kickoffUtc: "2026-07-15T19:00:00Z", // Wed 15:00 EDT
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── THIRD-PLACE MATCH ─────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-18T21:00:00Z", // Sat 17:00 EDT
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

  // ── FINAL ─────────────────────────────────────────────────────────────────

  {
    kickoffUtc: "2026-07-19T19:00:00Z", // Sun 15:00 EDT
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "scheduled",
    home: { name: "TBA", code: "" }, away: { name: "TBA", code: "" },
  },

];
