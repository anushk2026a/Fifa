import { Router } from "express";
import { validateBody } from "../../shared/http/validate";
import { requireAdmin } from "../auth";
import { createNewsSchema, type CreateNewsInput } from "./news.validation";
import { listNews, createNews, deleteNews } from "./news.service";

export const newsRouter = Router();

// Public — powers the site's News section.
newsRouter.get("/", async (_req, res, next) => {
  try {
    res.json({ ok: true, news: await listNews() });
  } catch (err) {
    next(err);
  }
});

// Admin only — add a news item.
newsRouter.post("/", requireAdmin, validateBody(createNewsSchema), async (req, res, next) => {
  try {
    const created = await createNews(req.body as CreateNewsInput);
    res.status(201).json({ ok: true, news: created });
  } catch (err) {
    next(err);
  }
});

// Admin only — remove a news item.
newsRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const ok = await deleteNews(req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
