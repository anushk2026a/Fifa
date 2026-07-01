import sanitizeHtml from "sanitize-html";

/** Strip all HTML/script tags — reduces stored text to plain text, blocking stored XSS. */
export function stripTags(value: string): string {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
}
