import type { Match } from "./matches.repo";

export const SEED_MATCHES: Match[] = [
  {
    kickoffUtc: "2026-06-18T14:00:00-05:00",
    citySlug: "atlanta", stadium: "Mercedes-Benz Stadium", status: "finished",
    home: { name: "Czechia", code: "CZE", score: 1 },
    away: { name: "South Africa", code: "RSA", score: 1 },
  },
  {
    kickoffUtc: "2026-06-18T20:00:00-05:00",
    citySlug: "los-angeles", stadium: "SoFi Stadium", status: "finished",
    home: { name: "Switzerland", code: "SUI", score: 4 },
    away: { name: "Bosnia", code: "BIH", score: 1 },
  },
  {
    kickoffUtc: "2026-06-18T23:00:00-05:00",
    citySlug: "vancouver", stadium: "BC Place", status: "finished",
    home: { name: "Canada", code: "CAN", score: 6 },
    away: { name: "Qatar", code: "QAT", score: 0 },
  },
  {
    kickoffUtc: "2026-06-19T12:00:00-05:00",
    citySlug: "philadelphia", stadium: "Lincoln Financial Field", status: "finished",
    home: { name: "Brazil", code: "BRA" },
    away: { name: "Haiti", code: "HAI" },
  },
  {
    kickoffUtc: "2026-06-19T14:00:00-05:00",
    citySlug: "boston", stadium: "Gillette Stadium", status: "finished",
    home: { name: "Scotland", code: "SCO" },
    away: { name: "Morocco", code: "MAR" },
  },
  {
    kickoffUtc: "2026-06-19T20:00:00-05:00",
    citySlug: "seattle", stadium: "Lumen Field", status: "finished",
    home: { name: "USA", code: "USA" },
    away: { name: "Australia", code: "AUS" },
  },
  {
    kickoffUtc: "2026-06-19T23:00:00-05:00",
    citySlug: "san-francisco-bay-area", stadium: "Levi's Stadium", status: "finished",
    home: { name: "Türkiye", code: "TUR" },
    away: { name: "Paraguay", code: "PAR" },
  },
  {
    kickoffUtc: "2026-06-20T14:00:00-05:00",
    citySlug: "dallas", stadium: "AT&T Stadium", status: "finished",
    home: { name: "Mexico", code: "MEX" },
    away: { name: "South Korea", code: "KOR" },
  },
  {
    kickoffUtc: "2026-06-20T15:00:00-05:00",
    citySlug: "toronto", stadium: "BMO Field", status: "finished",
    home: { name: "Germany", code: "GER" },
    away: { name: "Côte d'Ivoire", code: "CIV" },
  },
  {
    kickoffUtc: "2026-06-20T16:00:00-05:00",
    citySlug: "miami", stadium: "Hard Rock Stadium", status: "finished",
    home: { name: "Argentina", code: "ARG" },
    away: { name: "Algeria", code: "ALG" },
  },
  {
    kickoffUtc: "2026-06-20T19:00:00-05:00",
    citySlug: "new-york-new-jersey", stadium: "MetLife Stadium", status: "finished",
    home: { name: "England", code: "ENG" },
    away: { name: "Croatia", code: "CRO" },
  },
  {
    kickoffUtc: "2026-06-24T14:00:00-05:00",
    citySlug: "vancouver", stadium: "BC Place", status: "scheduled",
    home: { name: "Switzerland", code: "SUI" },
    away: { name: "Canada", code: "CAN" },
  },
  {
    kickoffUtc: "2026-06-24T17:00:00-05:00",
    citySlug: "dallas", stadium: "AT&T Stadium", status: "scheduled",
    home: { name: "Scotland", code: "SCO" },
    away: { name: "Brazil", code: "BRA" },
  },
];
