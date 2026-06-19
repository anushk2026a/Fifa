import nodemailer, { type Transporter } from "nodemailer";
import { env, mailerConfigured } from "../config/env";

let transporter: Transporter | null = null;

/** Returns a shared SMTP transporter, or null if SMTP isn't configured. */
export function getTransporter(): Transporter | null {
  if (!mailerConfigured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}
