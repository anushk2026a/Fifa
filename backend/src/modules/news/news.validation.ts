import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1).max(200),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional(),
  summary: z.string().min(1).max(2000),
  url: z.string().url(),
  source: z.string().max(100).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
