import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("*"),
});

export const env = schema.parse(process.env);

export const corsOrigins =
  env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((s) => s.trim());
