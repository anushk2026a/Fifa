"use client";

import { apiUrl } from "./api";

/**
 * Perform an authenticated request to the Express backend.
 * The browser automatically attaches the HttpOnly accessToken cookie —
 * no manual token handling needed, and no token ever touches JS memory.
 */
export function authFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      // Only set Content-Type for JSON bodies; don't override FormData etc.
      ...(init?.body && typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...init?.headers,
    },
  });
}

/**
 * Sign out: ask the server to revoke the refresh token and clear cookies.
 * Fire-and-forget — the redirect happens regardless of network success.
 */
export async function logout(): Promise<void> {
  try {
    await authFetch("/auth/logout", { method: "POST" });
  } catch {
    // Best-effort; the redirect that follows is what actually locks out the UI.
  }
}
