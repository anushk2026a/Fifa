/**
 * One-time migration: copy contacts from the local JSON file into MongoDB.
 * Safe to re-run — skips any contact whose id already exists in Mongo.
 * Run with: npx tsx src/scripts/migrate-contacts.ts
 */
import fs from "node:fs";
import path from "node:path";
import { getDb, closeDb } from "../shared/db/mongo";
import { env } from "../config/env";
import type { WithId } from "../shared/db/json-store";
import type { ContactSubmission } from "../modules/contact/contact.repo";

const jsonPath = path.resolve(process.cwd(), env.DATA_DIR, "contacts.json");

async function main() {
  if (!env.MONGODB_URI) {
    console.error("[migrate] No MONGODB_URI set — nothing to migrate to.");
    process.exitCode = 1;
    return;
  }

  let local: WithId<ContactSubmission>[] = [];
  try {
    local = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch {
    console.error(`[migrate] Could not read ${jsonPath}`);
    process.exitCode = 1;
    return;
  }

  if (local.length === 0) {
    console.log("[migrate] JSON file is empty, nothing to migrate.");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.error("[migrate] Could not connect to MongoDB.");
    process.exitCode = 1;
    return;
  }

  const col = db.collection<WithId<ContactSubmission>>("contacts");

  let inserted = 0;
  let skipped = 0;

  for (const doc of local) {
    const exists = await col.findOne({ id: doc.id });
    if (exists) {
      skipped++;
      continue;
    }
    await col.insertOne({ ...doc });
    inserted++;
    console.log(`[migrate] inserted → ${doc.name} (${doc.email})`);
  }

  console.log(`[migrate] done. inserted=${inserted} skipped=${skipped}`);
}

main()
  .catch((err) => {
    console.error("[migrate] failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closeDb());
