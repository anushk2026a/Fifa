import { MATCHES } from "@/data/matches";
import type { Match } from "@/data/types";

/** Local date as YYYY-MM-DD in the visitor's browser timezone. */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** All matches on a given local date (visitor's timezone), sorted by kickoff. */
export function matchesOn(date: string): Match[] {
  return MATCHES.filter((m) => ymd(new Date(m.kickoffUtc)) === date).sort((a, b) =>
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

/** Kickoff time in the visitor's browser timezone, e.g. "22:30". */
export function localTime(kickoffUtc: string): string {
  return new Date(kickoffUtc).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
