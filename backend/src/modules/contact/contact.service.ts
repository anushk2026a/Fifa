import { env } from "../../config/env";
import { getTransporter } from "../../shared/mailer";
import type { ContactInput } from "./contact.schema";

/**
 * Sends a contact submission to the team via SMTP.
 * If SMTP isn't configured (e.g. local dev), it logs and reports delivered:false
 * so the form still behaves, rather than erroring.
 */
export async function submitContact(input: ContactInput): Promise<{ delivered: boolean }> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("[contact] SMTP not configured — message not sent:", {
      name: input.name,
      email: input.email,
      city: input.city,
    });
    return { delivered: false };
  }

  const subject = `New enquiry${input.city ? ` — ${input.city}` : ""} from ${input.name}`;
  const text = [
    `Name:  ${input.name}`,
    `Email: ${input.email}`,
    `City:  ${input.city || "—"}`,
    "",
    input.message,
  ].join("\n");

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.CONTACT_TO,
    replyTo: input.email,
    subject,
    text,
  });

  return { delivered: true };
}
