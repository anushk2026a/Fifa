import express from "express";
import cors from "cors";
import helmet from "helmet";
import { healthRouter } from "./modules/health";
import { authRouter } from "./modules/auth";
import { newsRouter } from "./modules/news";
import { contactRouter } from "./modules/contact";
import { matchesRouter } from "./modules/matches";
import { errorHandler, notFound } from "./shared/middleware/error-handler";

const corsOptions: cors.CorsOptions = {
  origin: [
    "https://fifaonepoint.com",
    "https://www.fifaonepoint.com",
    "http://localhost:3000",
  ],
  credentials: true,
};

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // accurate client IPs behind Render/Railway proxies
  app.use(helmet());
  app.options("*", cors(corsOptions));
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "100kb" }));

  // Feature modules (modular monolith — each owns its routes).
  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/news", newsRouter);
  app.use("/contact", contactRouter);
  app.use("/matches", matchesRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
