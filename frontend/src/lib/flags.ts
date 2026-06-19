// Maps FIFA 3-letter team codes to ISO-3166 codes used by flagcdn.com.
// (Windows can't render flag emoji, so we use real flag images instead.)
const FIFA_TO_ISO: Record<string, string> = {
  CZE: "cz", RSA: "za", SUI: "ch", BIH: "ba", CAN: "ca", QAT: "qa",
  BRA: "br", HAI: "ht", SCO: "gb-sct", MAR: "ma", USA: "us", AUS: "au",
  TUR: "tr", PAR: "py", MEX: "mx", KOR: "kr", ARG: "ar", NGA: "ng",
  ENG: "gb-eng", ECU: "ec",
  // A few extras for future fixtures:
  FRA: "fr", GER: "de", ESP: "es", POR: "pt", NED: "nl", ITA: "it",
  BEL: "be", CRO: "hr", JPN: "jp", SEN: "sn", URU: "uy", COL: "co",
  WAL: "gb-wls", IRN: "ir", KSA: "sa", GHA: "gh", CMR: "cm", SRB: "rs",
  POL: "pl", DEN: "dk", TUN: "tn", CRC: "cr",
};

const COUNTRY_TO_ISO: Record<string, string> = {
  USA: "us",
  Canada: "ca",
  Mexico: "mx",
};

/** ISO code for a FIFA team code (e.g. "BRA" → "br"). */
export function teamFlagIso(code: string): string {
  return FIFA_TO_ISO[code.toUpperCase()] ?? "";
}

/** ISO code for a host country name (e.g. "Mexico" → "mx"). */
export function countryFlagIso(country: string): string {
  return COUNTRY_TO_ISO[country] ?? "";
}
