import type { Request, Response, NextFunction } from "express";
import { verifyToken, type AuthPayload } from "./auth.service";

export interface AuthedRequest extends Request {
  admin?: AuthPayload;
}

function extractToken(req: Request): string {
  // 1. HttpOnly cookie — preferred, immune to XSS token theft.
  if (req.cookies?.accessToken) return req.cookies.accessToken as string;

  const header = req.headers.authorization ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

/** Gate a route behind a valid admin JWT (from HttpOnly cookie or Bearer header). */
export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  }
  req.admin = payload;
  next();
}
