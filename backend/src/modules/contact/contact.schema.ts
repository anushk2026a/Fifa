import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  city: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // Honeypot — real users leave this empty; bots tend to fill it.
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
