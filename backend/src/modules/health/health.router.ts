import { Router } from "express";
import { mailerConfigured } from "../../config/env";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ ok: true, service: "sportsonepoint-api", mailer: mailerConfigured });
});
