import { randomUUID } from "node:crypto";
import { getDb } from "../../shared/db/mongo";
import { JsonCollection, type WithId } from "../../shared/db/json-store";
import { logger } from "../../shared/logger";
import type { Admin } from "./admin.repo";

export interface AdminStore {
  findByEmail(email: string): Promise<WithId<Admin> | undefined>;
  findById(id: string): Promise<WithId<Admin> | undefined>;
  upsert(email: string, data: Admin): Promise<WithId<Admin>>;
  count(): Promise<number>;
}

class JsonAdminStore implements AdminStore {
  private col = new JsonCollection<Admin>("admins");

  async findByEmail(email: string) {
    return this.col.findOne((a) => a.email === email);
  }

  async findById(id: string) {
    return this.col.findById(id);
  }

  async upsert(email: string, data: Admin) {
    const existing = await this.findByEmail(email);
    if (existing) this.col.deleteById(existing.id);
    return this.col.insert(data);
  }

  async count() {
    return this.col.count();
  }
}

class MongoAdminStore implements AdminStore {
  constructor(private readonly db: Awaited<ReturnType<typeof getDb>>) {}

  private get col() {
    return this.db!.collection<WithId<Admin>>("admins");
  }

  async findByEmail(email: string) {
    const doc = await this.col.findOne({ email }, { projection: { _id: 0 } });
    return doc ?? undefined;
  }

  async findById(id: string) {
    const doc = await this.col.findOne({ id }, { projection: { _id: 0 } });
    return doc ?? undefined;
  }

  async upsert(email: string, data: Admin) {
    const existing = await this.findByEmail(email);
    const row: WithId<Admin> = {
      ...data,
      id: existing?.id ?? randomUUID(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    await this.col.replaceOne({ email }, { ...row }, { upsert: true });
    return row;
  }

  async count() {
    return this.col.countDocuments();
  }
}

let cached: AdminStore | null = null;

export async function getAdminStore(): Promise<AdminStore> {
  if (cached) return cached;
  try {
    const db = await getDb();
    cached = db ? new MongoAdminStore(db) : new JsonAdminStore();
  } catch (err) {
    logger.warn("[auth] MongoDB unavailable, falling back to JSON store", {
      reason: (err as Error).message,
    });
    cached = new JsonAdminStore();
  }
  return cached;
}
