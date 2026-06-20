import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "../../config/env";

/**
 * Minimal file-backed collection store — interim persistence so the admin /
 * news features work with zero external setup. The repository shape mirrors a
 * document store, so Phase 2 can swap this for MongoDB without touching callers.
 *
 * Note: a single JSON file per collection; fine for low write volume. On
 * ephemeral hosts (e.g. Render free tier) data resets on redeploy — acceptable
 * for "for now"; move to MongoDB for durable storage.
 */
export type WithId<T> = T & { id: string; createdAt: string };

const DATA_DIR = path.resolve(process.cwd(), env.DATA_DIR);

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

export class JsonCollection<T extends Record<string, unknown>> {
  constructor(private readonly name: string) {}

  private readRaw(): WithId<T>[] {
    try {
      const txt = fs.readFileSync(filePath(this.name), "utf8");
      return JSON.parse(txt) as WithId<T>[];
    } catch {
      return [];
    }
  }

  private writeRaw(rows: WithId<T>[]): void {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath(this.name), JSON.stringify(rows, null, 2), "utf8");
  }

  all(): WithId<T>[] {
    return this.readRaw();
  }

  findById(id: string): WithId<T> | undefined {
    return this.readRaw().find((r) => r.id === id);
  }

  findOne(predicate: (row: WithId<T>) => boolean): WithId<T> | undefined {
    return this.readRaw().find(predicate);
  }

  insert(doc: T): WithId<T> {
    const rows = this.readRaw();
    const row: WithId<T> = { ...doc, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    rows.unshift(row);
    this.writeRaw(rows);
    return row;
  }

  deleteById(id: string): boolean {
    const rows = this.readRaw();
    const next = rows.filter((r) => r.id !== id);
    if (next.length === rows.length) return false;
    this.writeRaw(next);
    return true;
  }

  /** Replace the entire collection (used by the seed script). */
  replaceAll(docs: T[]): WithId<T>[] {
    const now = Date.now();
    const rows = docs.map((doc, i) => ({
      ...doc,
      id: crypto.randomUUID(),
      // keep insertion order stable & newest-first by spacing timestamps
      createdAt: new Date(now - i * 1000).toISOString(),
    })) as WithId<T>[];
    this.writeRaw(rows);
    return rows;
  }

  count(): number {
    return this.readRaw().length;
  }
}
