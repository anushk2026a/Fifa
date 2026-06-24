import { apiUrl } from "./api";
import { NEWS as STATIC_NEWS } from "@/data/news";
import type { NewsItem } from "@/data/types";

/** Fetch dynamic news from the backend and merge with static stories.
 *  Static stories are always shown; admin-added news appears first. */
export async function getNews(): Promise<NewsItem[]> {
  let dynamic: NewsItem[] = [];
  try {
    const res = await fetch(apiUrl("/news"), { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { ok: boolean; news?: NewsItem[] };
      if (data.ok && Array.isArray(data.news)) {
        dynamic = data.news;
      }
    }
  } catch { /* API unreachable — show static only */ }

  // Merge: dynamic first, then static items not already present by URL.
  const dynamicUrls = new Set(dynamic.map((n) => n.url));
  const staticOnly = STATIC_NEWS.filter((n) => !dynamicUrls.has(n.url));
  return [...dynamic, ...staticOnly];
}
