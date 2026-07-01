import { Router } from "express";
import { validateBody } from "../../shared/http/validate";
import { validateId } from "../../shared/middleware/mongo-sanitize";
import { requireAdmin } from "../auth";
import { createNewsSchema, type CreateNewsInput } from "./news.validation";
import { listNews, createNews, deleteNews } from "./news.service";
import { newsUpload, toCloudinary } from "../../shared/middleware/upload";

export const newsRouter = Router();

// Public — powers the site's News section.
newsRouter.get("/", async (_req, res, next) => {
  try {
    res.json({ ok: true, news: await listNews() });
  } catch (err) {
    next(err);
  }
});

// Admin only — add a news item (multipart/form-data with optional image file).
newsRouter.post(
  "/",
  requireAdmin,
  newsUpload.single("image"),
  async (req, _res, next) => {
    if (req.file) {
      try {
        req.body.image = await toCloudinary(req.file.buffer, "fifa/news");
      } catch (err) {
        return next(err);
      }
    }
    next();
  },
  validateBody(createNewsSchema),
  async (req, res, next) => {
    try {
      const created = await createNews(req.body as CreateNewsInput);
      res.status(201).json({ ok: true, news: created });
    } catch (err) {
      next(err);
    }
  },
);

// Admin only — remove a news item (validateId prevents injection via :id param).
newsRouter.delete("/:id", requireAdmin, validateId, async (req, res, next) => {
  try {
    const ok = await deleteNews(req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
