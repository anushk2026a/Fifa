import { z } from "zod";

const matchTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  code: z.string().min(1, "Team code is required"),
  score: z.number().optional(),
});

export const createMatchSchema = z.object({
  kickoffUtc: z.string().min(1, "Kickoff time is required"),
  citySlug: z.string().min(1, "City slug is required"),
  stadium: z.string().min(1, "Stadium is required"),
  home: matchTeamSchema,
  away: matchTeamSchema,
  status: z.enum(["scheduled", "live", "finished"]),
});

export const updateMatchSchema = createMatchSchema.partial();

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;
