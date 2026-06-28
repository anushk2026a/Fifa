// Maps FIFA 3-letter team codes to ISO-3166 codes used by flagcdn.com.
// (Windows can't render flag emoji, so we use real flag images instead.)
const FIFA_TO_ISO: Record<string, string> = {
  // Group stage teams
  CZE: "cz", RSA: "za", SUI: "ch", BIH: "ba", CAN: "ca", QAT: "qa",
  BRA: "br", HAI: "ht", SCO: "gb-sct", MAR: "ma", USA: "us", AUS: "au",
  TUR: "tr", PAR: "py", MEX: "mx", KOR: "kr", ARG: "ar", NGA: "ng",
  ENG: "gb-eng", ECU: "ec", GER: "de", CIV: "ci", CUW: "cw", TUN: "tn",
  JPN: "jp", ESP: "es", KSA: "sa", BEL: "be", IRN: "ir", URU: "uy",
  CPV: "cv", NZL: "nz", EGY: "eg", AUT: "at", FRA: "fr", IRQ: "iq",
  NOR: "no", SEN: "sn", JOR: "jo", ALG: "dz", POR: "pt", UZB: "uz",
  SWE: "se", NED: "nl", PAN: "pa", CRO: "hr", GHA: "gh", COL: "co",
  COD: "cd",
  // Extras
  ITA: "it", WAL: "gb-wls", CMR: "cm", SRB: "rs", POL: "pl",
  DEN: "dk", CRC: "cr",
};

const COUNTRY_TO_ISO: Record<string, string> = {
  USA: "us",
  Canada: "ca",
  Mexico: "mx",
};

// Maps team names to their FIFA 3-letter codes for auto-detection
const NAME_TO_FIFA: Record<string, string> = {
  brazil: "BRA", argentina: "ARG", france: "FRA", germany: "GER",
  spain: "ESP", england: "ENG", portugal: "POR", netherlands: "NED",
  italy: "ITA", belgium: "BEL", uruguay: "URU", croatia: "CRO",
  usa: "USA", "united states": "USA", mexico: "MEX", canada: "CAN",
  japan: "JPN", "south korea": "KOR", korea: "KOR", morocco: "MAR",
  senegal: "SEN", switzerland: "SUI", colombia: "COL", australia: "AUS",
  denmark: "DEN", sweden: "SWE", austria: "AUT", nigeria: "NGA",
  egypt: "EGY", ghana: "GHA", chile: "CHI", peru: "PER",
  ecuador: "ECU", paraguay: "PAR", saudiarabia: "KSA", "saudi arabia": "KSA",
  qatar: "QAT", turkey: "TUR", türkiye: "TUR", serbia: "SRB",
  poland: "POL", ukraine: "UKR", scotland: "SCO", wales: "WAL",
  czechia: "CZE", "czech republic": "CZE", bosnia: "BIH", haiti: "HAI",
  "south africa": "RSA", "ivory coast": "CIV", "ivori coast": "CIV", "côte d'ivoire": "CIV", "cote d'ivoire": "CIV",
  curacao: "CUW", curaçao: "CUW", tunisia: "TUN", iran: "IRN", "ir iran": "IRN",
  "cape verde": "CPV", "cabo verde": "CPV", "new zealand": "NZL", iraq: "IRQ",
  norway: "NOR", jordan: "JOR", algeria: "ALG", uzbekistan: "UZB",
  panama: "PAN", "dr congo": "COD", congo: "COD", cameroon: "CMR",
  "costa rica": "CRC",
};

/** ISO code for a FIFA team code (e.g. "BRA" → "br"). */
export function teamFlagIso(code: string): string {
  if (!code) return "";
  const upper = code.toUpperCase();
  if (FIFA_TO_ISO[upper]) return FIFA_TO_ISO[upper];
  const foundCode = NAME_TO_FIFA[code.toLowerCase()];
  if (foundCode && FIFA_TO_ISO[foundCode]) return FIFA_TO_ISO[foundCode];
  return "";
}

/** ISO code for a host country name (e.g. "Mexico" → "mx"). */
export function countryFlagIso(country: string): string {
  return COUNTRY_TO_ISO[country] ?? "";
}

/** Automatically find FIFA 3-letter team code based on team name. */
export function findTeamCode(teamName: string): string {
  if (!teamName) return "";
  const cleaned = teamName.trim().toLowerCase();
  return NAME_TO_FIFA[cleaned] ?? "";
}
