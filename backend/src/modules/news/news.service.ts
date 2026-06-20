import type { News } from "./news.repo";
import type { WithId } from "../../shared/db/json-store";
import { getNewsStore } from "./news.store";
import type { CreateNewsInput } from "./news.validation";

/** Newest first. */
export async function listNews(): Promise<WithId<News>[]> {
  const store = await getNewsStore();
  const rows = await store.list();
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

export async function createNews(input: CreateNewsInput): Promise<WithId<News>> {
  const store = await getNewsStore();
  const doc: News = {
    title: input.title.trim(),
    date: input.date ?? new Date().toISOString().slice(0, 10),
    summary: input.summary.trim(),
    url: input.url.trim(),
    source: input.source?.trim() || undefined,
    image: input.image?.trim() || undefined,
  };
  return store.create(doc);
}

export async function deleteNews(id: string): Promise<boolean> {
  const store = await getNewsStore();
  return store.remove(id);
}
