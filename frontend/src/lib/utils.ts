/** Minimal className joiner — no external deps. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Google Maps search link for an address/place (no API key needed). */
export function mapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Convert any YouTube URL (watch, youtu.be, shorts, embed) into an embed URL. */
export function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    let id = "";
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/embed/")[1];
    else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/shorts/")[1];
    else id = u.searchParams.get("v") ?? "";
    id = id.split(/[/?&]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
