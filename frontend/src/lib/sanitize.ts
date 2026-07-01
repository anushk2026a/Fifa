"use client";

import DOMPurify from "dompurify";

/**
 * Sanitize an HTML string for safe rendering via dangerouslySetInnerHTML.
 * Only needed when explicitly rendering HTML — React escapes plain text
 * automatically, so {value} in JSX does NOT need this.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") return "";
  return DOMPurify.sanitize(dirty);
}

/**
 * Strip all HTML tags and return plain text.
 * Useful as a client-side XSS guard before sending user input to the server.
 */
export function stripHtml(dirty: string): string {
  if (typeof window === "undefined") return dirty;
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
