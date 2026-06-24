import { createApp } from "./app";
import { env } from "./config/env";
import { ensureDefaultAdmin } from "./modules/auth/auth.service";

ensureDefaultAdmin().catch((err) => console.error("[auth] seed failed:", err));

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[backend] listening on :${env.PORT}`);
});
