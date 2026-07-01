import rateLimit from "express-rate-limit";

const rateLimitMessage = { ok: false, error: "RATE_LIMITED" };

/**
 * Auth endpoints (login, refresh): 10 requests per 15 minutes per IP.
 * Throttles brute-force password and token-replay attacks.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  // Count all requests (including successful ones) to prevent credential stuffing.
  skipSuccessfulRequests: false,
  message: rateLimitMessage,
});

/**
 * Contact form: 5 submissions per 60 seconds per IP.
 * Prevents spam flooding the contact inbox.
 */
export const contactRateLimit = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

/**
 * General API: 100 requests per 15 minutes per IP.
 * Applied as a broad umbrella over all feature routes.
 */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});
