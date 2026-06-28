import { MATCHES } from "@/data/matches";
import type { Match } from "@/data/types";

export const TIMEZONE = "America/New_York"; // US Eastern Time — used for public display
export const ADMIN_TZ = "Asia/Kolkata";     // IST — used for admin input/edit fields

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

/** Format a UTC date into IST datetime-local string (YYYY-MM-DDTHH:MM) for admin input fields */
export function utcToEtDatetimeLocal(isoStr: string): string {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ADMIN_TZ,   // IST
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(d);
    const year   = parts.find((p) => p.type === "year")?.value;
    const month  = parts.find((p) => p.type === "month")?.value;
    const day    = parts.find((p) => p.type === "day")?.value;
    const hour   = parts.find((p) => p.type === "hour")?.value;
    const minute = parts.find((p) => p.type === "minute")?.value;

    return `${year}-${month}-${day}T${hour}:${minute}`;
  } catch {
    return "";
  }
}

/**
 * Parse an IST datetime-local string (YYYY-MM-DDTHH:MM) from the admin field
 * and convert it to a UTC ISO string.
 * IST is always UTC+5:30 (no DST), so offset is fixed: -330 minutes from UTC.
 */
export function parseEtToUtc(istStr: string): string {
  if (!istStr) return new Date().toISOString();
  try {
    const [datePart, timePart] = istStr.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const [h, min] = timePart.split(":").map(Number);
    // IST = UTC + 5:30  →  UTC = IST - 5:30  →  subtract 330 minutes
    const utcMs = Date.UTC(y, m - 1, d, h, min) - 330 * 60 * 1000;
    return new Date(utcMs).toISOString();
  } catch {
    return new Date().toISOString();
  }
}
