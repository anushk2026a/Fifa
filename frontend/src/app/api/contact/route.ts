import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name:      z.string().min(1).max(100),
  email:     z.string().max(254).email(),
  phone:     z.string().max(20).optional(),
  country:   z.string().max(100).optional(),
  city:      z.string().max(100).optional(),
  stadium:   z.string().max(150).optional(),
  socialUrl: z.string().url().max(500).optional().or(z.literal("")),
  youtube:   z.string().url().max(500).optional().or(z.literal("")),
  facebook:  z.string().url().max(500).optional().or(z.literal("")),
  instagram: z.string().url().max(500).optional().or(z.literal("")),
  x:         z.string().url().max(500).optional().or(z.literal("")),
  message:   z.string().min(1).max(2000),
  company:   z.string().max(100).optional(), // honeypot — bots fill this, humans don't
});

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid data" }, { status: 400 });
    }

    const input = parsed.data;

    // Honeypot tripped → pretend success
    if (input.company) {
      return NextResponse.json({ ok: true, delivered: false }, { status: 201 });
    }

    // Email via SMTP (runs on Vercel — no backend dependency).
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("[contact API] SMTP not configured — message not sent.");
      return NextResponse.json({ ok: true, delivered: false }, { status: 201 });
    }

    const subject = `New enquiry${input.city ? ` — ${input.city}` : ""} from ${input.name}`;
    const text = [
      `Name:        ${input.name}`,
      `Email:       ${input.email}`,
      `Phone:       ${input.phone || "—"}`,
      `Country:     ${input.country || "—"}`,
      `City:        ${input.city || "—"}`,
      `Stadium:     ${input.stadium || "—"}`,
      `Social link: ${input.socialUrl || "—"}`,
      "",
      input.message,
    ].join("\n");

    const MAIL_FROM = process.env.MAIL_FROM || "FIFA One Point <no-reply@fifaonepoint.com>";
    const CONTACT_TO = process.env.CONTACT_TO!;

    await transporter.sendMail({
      from: MAIL_FROM,
      to: CONTACT_TO,
      replyTo: input.email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true, delivered: true }, { status: 201 });
  } catch (err) {
    console.error("[contact API] Error:", err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
