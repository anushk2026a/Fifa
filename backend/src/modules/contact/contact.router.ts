import { Router } from "express";
import { validateBody } from "../../shared/http/validate";
import { createContactSchema, type CreateContactInput } from "./contact.validation";
import { createContact, listContacts, deleteContact } from "./contact.service";
import { requireAdmin } from "../auth";

export const contactRouter = Router();

// Public — save a contact submission
contactRouter.post("/", validateBody(createContactSchema), async (req, res, next) => {
  try {
    const created = await createContact(req.body as CreateContactInput);
    res.status(201).json({ ok: true, contact: created });
  } catch (err) {
    next(err);
  }
});

// Admin only — list all contact submissions
contactRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    res.json({ ok: true, contacts: await listContacts() });
  } catch (err) {
    next(err);
  }
});

// Admin only — remove a contact submission
contactRouter.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const ok = await deleteContact(req.params.id);
    if (!ok) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
