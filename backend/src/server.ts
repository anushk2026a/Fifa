import { createApp } from "./app";
import { env, mailerConfigured } from "./config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(
    `[backend] listening on :${env.PORT} — mailer ${mailerConfigured ? "configured" : "NOT configured"}`,
  );
});
