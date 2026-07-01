import { z } from "zod";

const emptyToUndefined = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.string().max(150).optional(),
);

const urlOrEmpty = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.string().url().max(500).optional(),
);

export const createContactSchema = z.object({
  name:      z.string().min(1, "Name is required").max(100),
  email:     z.string().email("Invalid email address").max(254),
  // Phone is optional; when provided enforce a reasonable length.
  phone:     z.preprocess((val) => (val === "" ? undefined : val), z.string().max(20).optional()),
  country:   z.string().min(1, "Country is required").max(100),
  city:      z.string().min(1, "City is required").max(100),
  stadium:   emptyToUndefined,
  socialUrl: urlOrEmpty,
  message:   z.string().min(1, "Message is required").max(2000),
  // imageUrl is injected by the multer middleware after file upload — not sent by the client directly.
  imageUrl:  z.string().max(500).optional(),
});

export const updateContactSchema = z.object({
  message: z.string().trim().min(1).max(2000).optional(),
  approved: z.boolean().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
