import { Router } from "express";
import { validateBody } from "../../shared/http/validate";
import { contactRateLimit } from "../../shared/middleware/rate-limit";
import { validateId } from "../../shared/middleware/mongo-sanitize";
import {
  createContactSchema,
  updateContactSchema,
  type CreateContactInput,
} from "./contact.validation";
import {
  createContact,
  listContacts,
  deleteContact,
  approveContact,
  listApprovedContacts,
  updateContact,
} from "./contact.service";
import { requireAdmin } from "../auth";
import { experienceUpload, toCloudinary } from "../../shared/middleware/upload";

export const contactRouter = Router();

// Public — submit a contact form with optional image upload (rate-limited to prevent spam).
contactRouter.post(
  "/",
  contactRateLimit,
  experienceUpload.single("image"),
  async (req, _res, next) => {
    if (req.file) {
      try {
        req.body.imageUrl = await toCloudinary(req.file.buffer, "fifa/experiences");
      } catch (err) {
        return next(err);
      }
    }
    next();
  },
  validateBody(createContactSchema),
  async (req, res, next) => {
    try {
      const created = await createContact(req.body as CreateContactInput);
      res.status(201).json({ ok: true, contact: created });
    } catch (err) {
      next(err);
    }
  },
);

// Public — list approved fan stories.
contactRouter.get("/approved", async (_req, res, next) => {
  try {
    res.json({ ok: true, stories: await listApprovedContacts() });
  } catch (err) {
    next(err);
  }
});

// Admin only — list all submissions.
contactRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    res.json({ ok: true, contacts: await listContacts() });
  } catch (err) {
    next(err);
  }
});

// Admin only — update a submission (validateId guards against injection via :id).
contactRouter.patch(
  "/:id",
  requireAdmin,
  validateId,
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const updated = await updateContact(req.params.id, req.body);
      if (!updated) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
      res.json({ ok: true, contact: updated });
    } catch (err) {
      next(err);
    }
  },
);

// Admin only — approve / unapprove.
contactRouter.patch(
  "/:id/approve",
  requireAdmin,
  validateId,
  async (req, res, next) => {
    try {
      const approved = (req.body as { approved?: boolean }).approved !== false;
      const updated = await approveContact(req.params.id, approved);
      if (!updated) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
      res.json({ ok: true, contact: updated });
    } catch (err) {
      next(err);
    }
  },
);

// Admin only — delete a submission.
contactRouter.delete("/:id", requireAdmin, validateId, async (req, res, next) => {
  try {
    const ok = await deleteContact(req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
