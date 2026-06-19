import rateLimit from "express-rate-limit";

/** Limit contact submissions to curb spam: 5 per minute per IP. */
export const contactRateLimit = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "RATE_LIMITED" },
});
