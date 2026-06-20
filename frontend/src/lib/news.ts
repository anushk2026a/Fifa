import { apiUrl } from "./api";
import { NEWS as FALLBACK_NEWS } from "@/data/news";
import type { NewsItem } from "@/data/types";

/** Fetch news from the backend. Falls back to the bundled static list if the
 *  API is unreachable or unconfigured, so the page never goes blank. */
export async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(apiUrl("/news"), { cache: "no-store" });
    if (!res.ok) throw new Error(`news API ${res.status}`);
    const data = (await res.json()) as { ok: boolean; news?: NewsItem[] };
    if (!data.ok || !Array.isArray(data.news) || data.news.length === 0) {
      throw new Error("empty news payload");
    }
    return data.news;
  } catch {
    return FALLBACK_NEWS;
  }
}
