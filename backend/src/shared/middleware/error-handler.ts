import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../logger";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, error: "NOT_FOUND" });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // Zod validation errors: shouldn't reach here if validateBody guards are in place,
  // but handle defensively so Zod internals never leak to the client.
  if (err instanceof ZodError) {
    return res.status(422).json({
      ok: false,
      error: "VALIDATION_ERROR",
      details: err.flatten().fieldErrors,
    });
  }

  // Structured log with request context; never log passwords, tokens, or secrets.
  logger.error("Unhandled error", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    err: err instanceof Error
      ? { name: err.name, message: err.message }
      : String(err),
  });

  // Generic response — never expose stack traces, Mongo errors, or internal details.
  res.status(500).json({ ok: false, error: "INTERNAL" });
}
