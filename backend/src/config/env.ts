import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("*"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default("SportsOnePoint <no-reply@sportsonepoint.com>"),
  CONTACT_TO: z.string().optional(),
});

export const env = schema.parse(process.env);

/** True only when every value needed to actually send mail is present. */
export const mailerConfigured = Boolean(
  env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.CONTACT_TO,
);

export const corsOrigins =
  env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((s) => s.trim());
