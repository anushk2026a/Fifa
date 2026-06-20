import type { Request, Response, NextFunction } from "express";
import { verifyToken, type AuthPayload } from "./auth.service";

// Attach the authenticated admin onto the request.
export interface AuthedRequest extends Request {
  admin?: AuthPayload;
}

/** Gate a route behind a valid admin JWT (Authorization: Bearer <token>). */
export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  }
  req.admin = payload;
  next();
}
