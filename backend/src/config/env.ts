import "dotenv/config";
import { z } from "zod";

const isProd = process.env.NODE_ENV === "production";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),

  // Comma-separated list of allowed CORS origins.
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  // ── Auth ──────────────────────────────────────────────────────────────────────
  // In production these must be set explicitly; the in-code defaults are dev-only.
  JWT_SECRET: isProd
    ? z.string().min(32, "JWT_SECRET must be ≥32 chars in production")
    : z.string().default("dev-insecure-jwt-secret-change-me"),
  JWT_REFRESH_SECRET: isProd
    ? z.string().min(32, "JWT_REFRESH_SECRET must be ≥32 chars in production")
    : z.string().default("dev-insecure-refresh-secret-change-me"),
  // Access tokens are short-lived; use /auth/refresh to obtain new ones.
  JWT_EXPIRES_IN: z.string().default("15m"),
  // Refresh token lifetime in milliseconds (default 7 days).
  REFRESH_TOKEN_EXPIRES_IN_MS: z.coerce.number().default(7 * 24 * 60 * 60 * 1_000),

  ADMIN_EMAIL: z.string().email().default("adminfifa@gmail.com"),
  ADMIN_PASSWORD: isProd
    ? z.string().min(8, "ADMIN_PASSWORD must be set in production")
    : z.string().default("dev-change-me-123"),

  // ── Storage ───────────────────────────────────────────────────────────────────
  DATA_DIR: z.string().default("data"),
  MONGODB_URI: z.string().optional(),
  MONGO_URI: z.string().optional(),
  MONGODB_DB: z.string().default("fifaonepoint"),

  // ── SMTP ─────────────────────────────────────────────────────────────────────
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_TO: z.string().default(""),

  // ── Cloudinary ────────────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY:    z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
});

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  MONGODB_URI: parsed.MONGODB_URI ?? parsed.MONGO_URI,
};

export const corsOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());
