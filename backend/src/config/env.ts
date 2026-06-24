import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("*"),

  // Admin auth / news dashboard
  JWT_SECRET: z.string().default("dev-insecure-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  ADMIN_EMAIL: z.string().email().default("adminfifa@gmail.com"),
  ADMIN_PASSWORD: z.string().min(1).default("123456"),

  // Where the JSON file store keeps its data (fallback when no MONGODB_URI).
  DATA_DIR: z.string().default("data"),

  // MongoDB — when set, news is stored here instead of the JSON file.
  // MONGO_URI is accepted as an alias for convenience.
  MONGODB_URI: z.string().optional(),
  MONGO_URI: z.string().optional(),
  MONGODB_DB: z.string().default("fifaonepoint"),

  // SMTP — contact form email delivery via Gmail
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_TO: z.string().default(""),
});

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  // Normalise the alias so the rest of the app only reads MONGODB_URI.
  MONGODB_URI: parsed.MONGODB_URI ?? parsed.MONGO_URI,
};

export const corsOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());
