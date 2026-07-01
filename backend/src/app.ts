import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { corsOrigins } from "./config/env";
import { logger } from "./shared/logger";
import { mongoSanitize } from "./shared/middleware/mongo-sanitize";
import { apiRateLimit } from "./shared/middleware/rate-limit";
import { healthRouter } from "./modules/health";
import { authRouter } from "./modules/auth";
import { newsRouter } from "./modules/news";
import { contactRouter } from "./modules/contact";
import { matchesRouter } from "./modules/matches";
import { errorHandler, notFound } from "./shared/middleware/error-handler";

const corsOptions: cors.CorsOptions = {
  origin: corsOrigins,
  credentials: true,
};

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // accurate client IPs behind Render/Railway/Vercel proxies

  // ── Security headers ──────────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc:              ["'self'"],
          scriptSrc:               ["'self'"],
          // Allow inline styles (required by most admin dashboard frameworks).
          styleSrc:                ["'self'", "'unsafe-inline'"],
          imgSrc:                  ["'self'", "data:", "https:"],
          fontSrc:                 ["'self'", "https:"],
          connectSrc:              ["'self'"],
          objectSrc:               ["'none'"],
          baseUri:                 ["'self'"],
          formAction:              ["'self'"],
          frameAncestors:          ["'none'"],
          // Force browsers to upgrade plain HTTP sub-resources to HTTPS.
          upgradeInsecureRequests: [],
        },
      },
      hsts: {
        maxAge: 31_536_000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      // Relaxed for a REST API consumed by a separate frontend origin.
      crossOriginEmbedderPolicy: false,
    }),
  );

  // ── HTTP access log ───────────────────────────────────────────────────────────
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trimEnd(), { source: "http" }) },
    }),
  );

  // ── Core middleware ───────────────────────────────────────────────────────────
  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json({ limit: "100kb" }));

  // ── NoSQL injection guard ─────────────────────────────────────────────────────
  // Reject any request body or query string that contains MongoDB operator keys
  // (e.g. { "$ne": null }).  Applied globally before any route handler runs.
  app.use(mongoSanitize);

  // ── Broad per-route rate limits ───────────────────────────────────────────────
  // Auth router applies its own tighter authRateLimit on sensitive endpoints.
  app.use("/auth",    apiRateLimit);
  app.use("/news",    apiRateLimit);
  app.use("/contact", apiRateLimit);
  app.use("/matches", apiRateLimit);

  // ── Feature routers ───────────────────────────────────────────────────────────
  app.use("/health",  healthRouter);
  app.use("/auth",    authRouter);
  app.use("/news",    newsRouter);
  app.use("/contact", contactRouter);
  app.use("/matches", matchesRouter);

  // ── Error handling ────────────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
