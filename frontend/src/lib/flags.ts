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

/** ISO code for a FIFA team code (e.g. "BRA" → "br"). */
export function teamFlagIso(code: string): string {
  return FIFA_TO_ISO[code.toUpperCase()] ?? "";
}

/** ISO code for a host country name (e.g. "Mexico" → "mx"). */
export function countryFlagIso(country: string): string {
  return COUNTRY_TO_ISO[country] ?? "";
}
