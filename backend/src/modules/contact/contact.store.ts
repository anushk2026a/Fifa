import { randomUUID } from "node:crypto";
import { getDb } from "../../shared/db/mongo";
import { JsonCollection, type WithId } from "../../shared/db/json-store";
import type { ContactSubmission } from "./contact.repo";

/** Storage contract for contact submissions. */
export interface ContactStore {
  list(): Promise<WithId<ContactSubmission>[]>;
  listApproved(): Promise<WithId<ContactSubmission>[]>;
  create(doc: ContactSubmission): Promise<WithId<ContactSubmission>>;
  update(id: string, updates: Partial<ContactSubmission>): Promise<WithId<ContactSubmission> | null>;
  remove(id: string): Promise<boolean>;
  approve(id: string, approved: boolean): Promise<WithId<ContactSubmission> | null>;
  count(): Promise<number>;
}

function stamp(doc: ContactSubmission, offsetMs = 0): WithId<ContactSubmission> {
  return { ...doc, id: randomUUID(), createdAt: new Date(Date.now() - offsetMs).toISOString() };
}

class JsonContactStore implements ContactStore {
  private col = new JsonCollection<ContactSubmission>("contacts");
  async list() { return this.col.all(); }
  async listApproved() { return this.col.all().filter((r) => r.approved === true); }
  async create(doc: ContactSubmission) { return this.col.insert(doc); }
  async update(id: string, updates: Partial<ContactSubmission>) {
    const result = this.col.updateById(id, updates);
    return result ?? null;
  }
  async remove(id: string) { return this.col.deleteById(id); }
  async approve(id: string, approved: boolean) {
    const result = this.col.updateById(id, { approved } as Partial<ContactSubmission>);
    return result ?? null;
  }
  async count() { return this.col.count(); }
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
  async listApproved() {
    return (await this.col
      .find({ approved: true }, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray()) as WithId<ContactSubmission>[];
  }
  async create(doc: ContactSubmission) {
    const row = stamp(doc);
    await this.col.insertOne({ ...row });
    return row;
  }
  async update(id: string, updates: Partial<ContactSubmission>) {
    const res = await this.col.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: "after", projection: { _id: 0 } },
    );
    return (res as WithId<ContactSubmission> | null);
  }
  async remove(id: string) {
    const res = await this.col.deleteOne({ id });
    return res.deletedCount === 1;
  }
  async approve(id: string, approved: boolean) {
    const res = await this.col.findOneAndUpdate(
      { id },
      { $set: { approved } },
      { returnDocument: "after", projection: { _id: 0 } },
    );
    return (res as WithId<ContactSubmission> | null);
  }
  async count() { return this.col.countDocuments(); }
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
