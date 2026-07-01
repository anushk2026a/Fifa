import crypto from "node:crypto";
import { randomUUID } from "node:crypto";
import { getDb } from "../../shared/db/mongo";
import { JsonCollection, type WithId } from "../../shared/db/json-store";

export type RefreshToken = {
  tokenHash: string; // SHA-256 of the raw token — never store raw
  adminId: string;
  userAgent: string;
  expiresAt: string; // ISO string
  revokedAt?: string;
};

export interface RefreshTokenStore {
  create(adminId: string, userAgent: string, ttlMs: number): Promise<{ raw: string; record: WithId<RefreshToken> }>;
  findValid(raw: string): Promise<WithId<RefreshToken> | undefined>;
  revoke(id: string): Promise<void>;
  revokeAllFor(adminId: string): Promise<void>;
  purgeExpired(): Promise<void>;
}

function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

class JsonRefreshTokenStore implements RefreshTokenStore {
  private col = new JsonCollection<RefreshToken>("refresh_tokens");

  async create(adminId: string, userAgent: string, ttlMs: number) {
    const raw = crypto.randomBytes(64).toString("hex");
    const record = this.col.insert({
      tokenHash: hashToken(raw),
      adminId,
      userAgent,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    });
    return { raw, record };
  }

  async findValid(raw: string) {
    const hash = hashToken(raw);
    const now = new Date().toISOString();
    return this.col.findOne(
      (r) => r.tokenHash === hash && !r.revokedAt && r.expiresAt > now,
    );
  }

  async revoke(id: string) {
    this.col.updateById(id, { revokedAt: new Date().toISOString() } as Partial<RefreshToken>);
  }

  async revokeAllFor(adminId: string) {
    for (const r of this.col.all()) {
      if (r.adminId === adminId && !r.revokedAt) {
        this.col.updateById(r.id, { revokedAt: new Date().toISOString() } as Partial<RefreshToken>);
      }
    }
  }

  async purgeExpired() {
    const now = new Date().toISOString();
    for (const r of this.col.all()) {
      if (r.expiresAt < now) this.col.deleteById(r.id);
    }
  }
}

class MongoRefreshTokenStore implements RefreshTokenStore {
  constructor(private readonly db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {}

  private get col() {
    return this.db.collection<WithId<RefreshToken>>("refresh_tokens");
  }

  async create(adminId: string, userAgent: string, ttlMs: number) {
    const raw = crypto.randomBytes(64).toString("hex");
    const record: WithId<RefreshToken> = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      tokenHash: hashToken(raw),
      adminId,
      userAgent,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    };
    await this.col.insertOne({ ...record });
    return { raw, record };
  }

  async findValid(raw: string) {
    const hash = hashToken(raw);
    const now = new Date().toISOString();
    const doc = await this.col.findOne(
      { tokenHash: hash, revokedAt: { $exists: false }, expiresAt: { $gt: now } },
      { projection: { _id: 0 } },
    );
    return doc ?? undefined;
  }

  async revoke(id: string) {
    await this.col.updateOne({ id }, { $set: { revokedAt: new Date().toISOString() } });
  }

  async revokeAllFor(adminId: string) {
    await this.col.updateMany(
      { adminId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date().toISOString() } },
    );
  }

  async purgeExpired() {
    const now = new Date().toISOString();
    await this.col.deleteMany({ expiresAt: { $lt: now } });
  }
}

let cached: RefreshTokenStore | null = null;

export async function getRefreshTokenStore(): Promise<RefreshTokenStore> {
  if (cached) return cached;
  try {
    const db = await getDb();
    cached = db ? new MongoRefreshTokenStore(db) : new JsonRefreshTokenStore();
  } catch {
    cached = new JsonRefreshTokenStore();
  }
  return cached;
}
