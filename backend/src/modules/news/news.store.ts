import { randomUUID } from "node:crypto";
import { getDb } from "../../shared/db/mongo";
import { JsonCollection, type WithId } from "../../shared/db/json-store";
import type { News } from "./news.repo";

/** Storage contract for news — same shape whether backed by MongoDB or a file. */
export interface NewsStore {
  list(): Promise<WithId<News>[]>;
  create(doc: News): Promise<WithId<News>>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
  replaceAll(docs: News[]): Promise<WithId<News>[]>;
}

function stamp(doc: News, offsetMs = 0): WithId<News> {
  return { ...doc, id: randomUUID(), createdAt: new Date(Date.now() - offsetMs).toISOString() };
}

class JsonNewsStore implements NewsStore {
  private col = new JsonCollection<News>("news");
  async list() {
    return this.col.all();
  }
  async create(doc: News) {
    return this.col.insert(doc);
  }
  async remove(id: string) {
    return this.col.deleteById(id);
  }
  async count() {
    return this.col.count();
  }
  async replaceAll(docs: News[]) {
    return this.col.replaceAll(docs);
  }
}

class MongoNewsStore implements NewsStore {
  // Our own `id`/`createdAt` fields are the source of truth; Mongo's _id is hidden.
  constructor(private readonly db: Awaited<ReturnType<typeof getDb>>) {}

  private get col() {
    return this.db!.collection<WithId<News>>("news");
  }

  async list() {
    return (await this.col
      .find({}, { projection: { _id: 0 } })
      .sort({ date: -1, createdAt: -1 })
      .toArray()) as WithId<News>[];
  }
  async create(doc: News) {
    const row = stamp(doc);
    await this.col.insertOne({ ...row });
    return row;
  }
  async remove(id: string) {
    const res = await this.col.deleteOne({ id });
    return res.deletedCount === 1;
  }
  async count() {
    return this.col.countDocuments();
  }
  async replaceAll(docs: News[]) {
    await this.col.deleteMany({});
    const rows = docs.map((d, i) => stamp(d, i * 1000));
    if (rows.length) await this.col.insertMany(rows.map((r) => ({ ...r })));
    return rows;
  }
}

let cached: NewsStore | null = null;

/** Pick the store once: MongoDB if reachable, else the JSON file (with a warning). */
export async function getNewsStore(): Promise<NewsStore> {
  if (cached) return cached;
  try {
    const db = await getDb();
    cached = db ? new MongoNewsStore(db) : new JsonNewsStore();
  } catch (err) {
    console.warn("[news] MongoDB unavailable, falling back to JSON file store:", (err as Error).message);
    cached = new JsonNewsStore();
  }
  return cached;
}
