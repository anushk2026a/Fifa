import { MATCHES } from "@/data/matches";
import type { Match } from "@/data/types";

export const TIMEZONE = "America/New_York"; // US Eastern Time Zone (same as FIFA base time)

/** Local date as YYYY-MM-DD in US Eastern Time (ET). */
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

/** All matches on a given local date (in Eastern Time), sorted by kickoff. */
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

/** Kickoff time formatted in US Eastern Time with "ET" prepended, e.g. "ET 3:00 PM". */
export function localTime(kickoffUtc: string): string {
  const timeStr = new Date(kickoffUtc).toLocaleTimeString("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `ET ${timeStr}`;
}

/** Format a UTC date into America/New_York datetime-local string (YYYY-MM-DDTHH:MM) for admin inputs */
export function utcToEtDatetimeLocal(isoStr: string): string {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    
    const parts = formatter.formatToParts(d);
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    const hour = parts.find((p) => p.type === "hour")?.value;
    const minute = parts.find((p) => p.type === "minute")?.value;
    
    return `${year}-${month}-${day}T${hour}:${minute}`;
  } catch {
    return "";
  }
}

/** Parse an America/New_York datetime-local string (YYYY-MM-DDTHH:MM) into a UTC ISO string */
export function parseEtToUtc(etStr: string): string {
  if (!etStr) return new Date().toISOString();
  try {
    const [datePart, timePart] = etStr.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const [h, min] = timePart.split(":").map(Number);
    const utcGuess = Date.UTC(y, m - 1, d, h, min);
    
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    
    const parts = formatter.formatToParts(new Date(utcGuess));
    const nyYear = parseInt(parts.find(p => p.type === "year")!.value, 10);
    const nyMonth = parseInt(parts.find(p => p.type === "month")!.value, 10);
    const nyDay = parseInt(parts.find(p => p.type === "day")!.value, 10);
    const nyHour = parseInt(parts.find(p => p.type === "hour")!.value, 10);
    const nyMin = parseInt(parts.find(p => p.type === "minute")!.value, NYMinType(parts));
    
    function NYMinType(parts: Intl.DateTimeFormatPart[]): number {
      return 10;
    }
    
    const nyUtc = Date.UTC(nyYear, nyMonth - 1, nyDay, nyHour, nyMin);
    const offsetMs = nyUtc - utcGuess;
    
    return new Date(utcGuess - offsetMs).toISOString();
  } catch {
    return new Date(etStr).toISOString();
  }
}
