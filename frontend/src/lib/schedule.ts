import { MATCHES } from "@/data/matches";
import type { Match } from "@/data/types";

const TIMEZONE = "America/Chicago";

/** Local date as YYYY-MM-DD in Texas (Central Time). */
export function ymd(d: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

/** All matches on a given local date (visitor's timezone), sorted by kickoff. */
export function matchesOn(date: string, list: Match[] = MATCHES): Match[] {
  return list.filter((m) => ymd(new Date(m.kickoffUtc)) === date).sort((a, b) =>
    a.kickoffUtc.localeCompare(b.kickoffUtc),
  );
}

/** Human label like "Friday, June 19". */
export function prettyDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Kickoff time in Texas (Central Time), e.g. "22:30 CDT". */
export function localTime(kickoffUtc: string): string {
  return new Date(kickoffUtc).toLocaleTimeString("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
}
