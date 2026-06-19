import express from "express";
import cors from "cors";
import helmet from "helmet";
import { corsOrigins } from "./config/env";
import { contactRouter } from "./modules/contact";
import { healthRouter } from "./modules/health";
import { contactRateLimit } from "./shared/middleware/rate-limit";
import { errorHandler, notFound } from "./shared/middleware/error-handler";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // accurate client IPs behind Render/Railway proxies
  app.use(helmet());
  app.use(cors({ origin: corsOrigins }));
  app.use(express.json({ limit: "100kb" }));

  // Feature modules (modular monolith — each owns its routes).
  app.use("/health", healthRouter);
  app.use("/api/contact", contactRateLimit, contactRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
