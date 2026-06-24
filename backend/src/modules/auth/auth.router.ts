import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../shared/http/validate";
import { login } from "./auth.service";
import { requireAdmin, type AuthedRequest } from "./auth.middleware";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as z.infer<typeof loginSchema>;
    const result = await login(email, password);
    if (!result) {
      return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });
    }
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
});

// Lets the dashboard confirm a stored token is still valid.
authRouter.get("/me", requireAdmin, (req: AuthedRequest, res) => {
  res.json({ ok: true, admin: { email: req.admin!.email, role: req.admin!.role } });
});
