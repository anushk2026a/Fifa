import { MongoClient, type Db } from "mongodb";
import { env } from "../../config/env";

/** Lazily-connected MongoDB handle. Returns null when MONGODB_URI is not set,
 *  so callers can fall back to the JSON file store. */
let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db | null> {
  if (!env.MONGODB_URI) return null;
  if (db) return db;
  client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  db = client.db(env.MONGODB_DB);
  console.log(`[mongo] connected → ${env.MONGODB_DB}`);
  return db;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
