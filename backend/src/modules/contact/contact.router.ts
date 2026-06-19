import { Router } from "express";
import { validateBody } from "../../shared/http/validate";
import { contactSchema } from "./contact.schema";
import { submitContact } from "./contact.service";

export const contactRouter = Router();

contactRouter.post("/", validateBody(contactSchema), async (req, res, next) => {
  try {
    // Honeypot tripped → pretend success, do nothing.
    if (req.body.company) return res.status(201).json({ ok: true, delivered: false });

    const result = await submitContact(req.body);
    res.status(201).json({ ok: true, delivered: result.delivered });
  } catch (err) {
    next(err);
  }
});
