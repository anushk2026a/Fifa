/** Base URL of the Express backend (auth + dynamic news).
 *  Set NEXT_PUBLIC_API_URL in the frontend env; falls back to local dev. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000" ||
  "https://fifaonepoint.com";

export function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
