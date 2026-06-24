import { createApp } from "../src/app";
import { ensureDefaultAdmin } from "../src/modules/auth/auth.service";

// Seed the default admin into MongoDB on every cold start (idempotent — skips if already exists).
ensureDefaultAdmin().catch((err) => console.error("[auth] seed failed:", err));

export default createApp();
