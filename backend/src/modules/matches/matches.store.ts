import { randomUUID } from "node:crypto";
import { getDb } from "../../shared/db/mongo";
import { JsonCollection, type WithId } from "../../shared/db/json-store";
import type { Match } from "./matches.repo";
import { SEED_MATCHES } from "./seed-data";

export interface MatchesStore {
  list(): Promise<WithId<Match>[]>;
  create(doc: Match): Promise<WithId<Match>>;
  update(id: string, doc: Partial<Match>): Promise<WithId<Match> | null>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
}

function stamp(doc: Match): WithId<Match> {
  return { ...doc, id: randomUUID(), createdAt: new Date().toISOString() };
}

// ─── JSON file-backed store (no MongoDB) ────────────────────────────────────

class JsonMatchesStore implements MatchesStore {
  private col = new JsonCollection<Match>("matches");

  private ensureSeed() {
    if (this.col.count() === 0) {
      this.col.replaceAll(SEED_MATCHES);
    }
  }

  async list() {
    this.ensureSeed();
    return this.col.all().sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
  }

  async create(doc: Match) {
    this.ensureSeed();
    return this.col.insert(doc);
  }

  async update(id: string, doc: Partial<Match>) {
    this.ensureSeed();
    const result = this.col.updateById(id, doc);
    return result ?? null;
  }

  async remove(id: string) {
    this.ensureSeed();
    return this.col.deleteById(id);
  }

  async count() {
    this.ensureSeed();
    return this.col.count();
  }
}

// ─── MongoDB-backed store ────────────────────────────────────────────────────

class MongoMatchesStore implements MatchesStore {
  constructor(private readonly db: Awaited<ReturnType<typeof getDb>>) {}

  private get col() {
    return this.db!.collection<WithId<Match>>("matches");
  }

  private async ensureSeed() {
    const count = await this.col.countDocuments();
    if (count === 0) {
      const rows = SEED_MATCHES.map(stamp);
      await this.col.insertMany(rows.map((r) => ({ ...r })));
    }
  }

  async list() {
    await this.ensureSeed();
    return (await this.col
      .find({}, { projection: { _id: 0 } })
      .sort({ kickoffUtc: 1 })
      .toArray()) as WithId<Match>[];
  }

  async create(doc: Match) {
    await this.ensureSeed();
    const row = stamp(doc);
    await this.col.insertOne({ ...row });
    return row;
  }

  async update(id: string, doc: Partial<Match>) {
    await this.ensureSeed();
    const res = await this.col.findOneAndUpdate(
      { id },
      { $set: doc },
      { returnDocument: "after", projection: { _id: 0 } }
    );
    return res as WithId<Match> | null;
  }

  async remove(id: string) {
    await this.ensureSeed();
    const res = await this.col.deleteOne({ id });
    return res.deletedCount === 1;
  }

  async count() {
    await this.ensureSeed();
    return this.col.countDocuments();
  }
}

// ─── Factory (singleton) ─────────────────────────────────────────────────────

let cached: MatchesStore | null = null;

export async function getMatchesStore(): Promise<MatchesStore> {
  if (cached) return cached;
  try {
    const db = await getDb();
    cached = db ? new MongoMatchesStore(db) : new JsonMatchesStore();
  } catch (err) {
    console.warn("[matches] MongoDB unavailable, falling back to JSON store:", (err as Error).message);
    cached = new JsonMatchesStore();
  }
  return cached;
}
