import { MATCHES } from "@/data/matches";
import type { Match } from "@/data/types";
import { apiUrl } from "@/lib/api";
import { authHeaders } from "@/lib/admin-auth";

/** Retrieve all matches from backend API (falling back to static MATCHES on network error) */
export async function fetchMatchesApi(): Promise<(Match & { id?: string })[]> {
  try {
    const res = await fetch(apiUrl("/matches"), { cache: "no-store" });
    if (!res.ok) return MATCHES;
    const data = await res.json();
    if (data.ok && Array.isArray(data.matches) && data.matches.length > 0) {
      return data.matches;
    }
    return MATCHES;
  } catch {
    return MATCHES;
  }
}

/** Create a new match via backend API */
export async function createMatchApi(match: Match): Promise<(Match & { id?: string }) | null> {
  try {
    const res = await fetch(apiUrl("/matches"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(match),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      window.dispatchEvent(new Event("matches_updated"));
      return data.match;
    }
    return null;
  } catch {
    return null;
  }
}

/** Update an existing match via backend API */
export async function updateMatchApi(id: string, match: Partial<Match>): Promise<(Match & { id?: string }) | null> {
  try {
    const res = await fetch(apiUrl(`/matches/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(match),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      window.dispatchEvent(new Event("matches_updated"));
      return data.match;
    }
    return null;
  } catch {
    return null;
  }
}

/** Delete a match via backend API */
export async function deleteMatchApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/matches/${id}`), {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      window.dispatchEvent(new Event("matches_updated"));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
