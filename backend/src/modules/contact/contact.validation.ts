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
  country: emptyToUndefined,
  city: emptyToUndefined,
  stadium: emptyToUndefined,
  socialUrl: urlOrEmpty,
  youtube: urlOrEmpty,
  facebook: urlOrEmpty,
  instagram: urlOrEmpty,
  x: urlOrEmpty,
  message: z.string().min(1, "Message is required"),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
