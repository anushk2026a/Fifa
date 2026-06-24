import { z } from "zod";

const emptyToUndefined = z.preprocess((val) => (val === "" ? undefined : val), z.string().optional());
const urlOrEmpty = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.string().url().optional()
);

export const createContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: emptyToUndefined,
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  stadium: emptyToUndefined,
  socialUrl: urlOrEmpty,
  youtube: urlOrEmpty,
  facebook: urlOrEmpty,
  instagram: urlOrEmpty,
  x: urlOrEmpty,
  message: z.string().min(1, "Message is required"),
});

export const updateContactSchema = z.object({
  message: z.string().trim().min(1, "Message is required").optional(),
  approved: z.boolean().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
