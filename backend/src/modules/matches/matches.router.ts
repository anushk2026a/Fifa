import { Router } from "express";
import { validateBody } from "../../shared/http/validate";
import { validateId } from "../../shared/middleware/mongo-sanitize";
import { requireAdmin } from "../auth";
import {
  createMatchSchema,
  updateMatchSchema,
  type CreateMatchInput,
  type UpdateMatchInput,
} from "./matches.validation";
import { listMatches, createMatch, updateMatch, deleteMatch } from "./matches.service";

export const matchesRouter = Router();

// Public — retrieve all matches for the site fixture pages.
matchesRouter.get("/", async (_req, res, next) => {
  try {
    res.json({ ok: true, matches: await listMatches() });
  } catch (err) {
    next(err);
  }
});

// Admin only — create a match.
matchesRouter.post(
  "/",
  requireAdmin,
  validateBody(createMatchSchema),
  async (req, res, next) => {
    try {
      const created = await createMatch(req.body as CreateMatchInput);
      res.status(201).json({ ok: true, match: created });
    } catch (err) {
      next(err);
    }
  },
);

// Admin only — update a match (validateId guards :id param).
matchesRouter.put(
  "/:id",
  requireAdmin,
  validateId,
  validateBody(updateMatchSchema),
  async (req, res, next) => {
    try {
      const updated = await updateMatch(req.params.id, req.body as UpdateMatchInput);
      if (!updated) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
      res.json({ ok: true, match: updated });
    } catch (err) {
      next(err);
    }
  },
);

// Admin only — delete a match.
matchesRouter.delete("/:id", requireAdmin, validateId, async (req, res, next) => {
  try {
    const ok = await deleteMatch(req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
