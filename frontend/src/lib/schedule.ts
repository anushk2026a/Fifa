import { MATCHES } from "@/data/matches";
import type { Match } from "@/data/types";

/** Local date as YYYY-MM-DD (used to match the venue-local match dates). */
export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function matchesOn(date: string): Match[] {
  return MATCHES.filter((m) => m.date === date).sort((a, b) =>
    a.kickoff.localeCompare(b.kickoff),
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
