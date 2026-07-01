import type { Request, Response, NextFunction } from "express";

/** Recursively check for MongoDB operator keys (e.g. $ne, $where, $gt). */
function hasOperator(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasOperator);
  if (value !== null && typeof value === "object") {
    for (const key of Object.keys(value as Record<string, unknown>)) {
      if (key.startsWith("$")) return true;
      if (hasOperator((value as Record<string, unknown>)[key])) return true;
    }
  }
  return false;
}

/**
 * Rejects requests whose body or query contains MongoDB operator keys.
 * Guards against NoSQL injection attacks like { "$ne": null }.
 */
export function mongoSanitize(req: Request, res: Response, next: NextFunction) {
  if (req.body && hasOperator(req.body)) {
    return res.status(400).json({ ok: false, error: "INVALID_INPUT" });
  }
  if (req.query && hasOperator(req.query)) {
    return res.status(400).json({ ok: false, error: "INVALID_INPUT" });
  }
  next();
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates that req.params.id is a well-formed UUID before it reaches the service.
 * Prevents injection attempts via route params (e.g. /contact/../admin or $where payloads).
 */
export function validateId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  if (!id || !UUID_RE.test(id)) {
    return res.status(400).json({ ok: false, error: "INVALID_ID" });
  }
  next();
}
