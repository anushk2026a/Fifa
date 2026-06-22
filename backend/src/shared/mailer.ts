import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  message: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  if (!env.SMTP_USER || !env.SMTP_TO) return;

  const lines = [
    `Name:     ${data.name}`,
    `Email:    ${data.email}`,
    data.phone    ? `Phone:    ${data.phone}`    : null,
    data.country  ? `Country:  ${data.country}`  : null,
    data.city     ? `City:     ${data.city}`      : null,
    ``,
    `Message:`,
    data.message,
    ``,
    data.youtube  ? `YouTube:  ${data.youtube}`  : null,
    data.facebook ? `Facebook: ${data.facebook}` : null,
    data.instagram? `Instagram:${data.instagram}`: null,
    data.x        ? `X:        ${data.x}`        : null,
  ].filter((l) => l !== null).join("\n");

  await transporter.sendMail({
    from: `"FIFA One Point" <${env.SMTP_USER}>`,
    to: env.SMTP_TO,
    replyTo: data.email,
    subject: `New contact from ${data.name}`,
    text: lines,
  });
}
