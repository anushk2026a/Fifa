import { randomUUID } from "node:crypto";
import { getDb } from "../../shared/db/mongo";
import { JsonCollection, type WithId } from "../../shared/db/json-store";
import type { ContactSubmission } from "./contact.repo";

/** Storage contract for contact submissions. */
export interface ContactStore {
  list(): Promise<WithId<ContactSubmission>[]>;
  create(doc: ContactSubmission): Promise<WithId<ContactSubmission>>;
  remove(id: string): Promise<boolean>;
  count(): Promise<number>;
}

function stamp(doc: ContactSubmission, offsetMs = 0): WithId<ContactSubmission> {
  return { ...doc, id: randomUUID(), createdAt: new Date(Date.now() - offsetMs).toISOString() };
}

class JsonContactStore implements ContactStore {
  private col = new JsonCollection<ContactSubmission>("contacts");
  async list() {
    return this.col.all();
  }
  async create(doc: ContactSubmission) {
    return this.col.insert(doc);
  }
  async remove(id: string) {
    return this.col.deleteById(id);
  }
  async count() {
    return this.col.count();
  }
}

class MongoContactStore implements ContactStore {
  constructor(private readonly db: Awaited<ReturnType<typeof getDb>>) {}

  private get col() {
    return this.db!.collection<WithId<ContactSubmission>>("contacts");
  }

  async list() {
    return (await this.col
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray()) as WithId<ContactSubmission>[];
  }
  async create(doc: ContactSubmission) {
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
}

let cached: ContactStore | null = null;

export async function getContactStore(): Promise<ContactStore> {
  if (cached) return cached;
  try {
    const db = await getDb();
    cached = db ? new MongoContactStore(db) : new JsonContactStore();
  } catch (err) {
    console.warn("[contact] MongoDB unavailable, falling back to JSON file store:", (err as Error).message);
    cached = new JsonContactStore();
  }
  return cached;
}
