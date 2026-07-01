import { MongoClient, type Db } from "mongodb";
import { env } from "../../config/env";
import { logger } from "../logger";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db | null> {
  if (!env.MONGODB_URI) return null;
  if (db) return db;
  client = new MongoClient(env.MONGODB_URI, {
    // Prevent command monitoring from leaking query payloads in logs.
    monitorCommands: false,
    // Fail fast on connection issues rather than hanging indefinitely.
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
  });
  await client.connect();
  db = client.db(env.MONGODB_DB);
  logger.info(`[mongo] connected → ${env.MONGODB_DB}`);
  return db;
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
