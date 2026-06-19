import type { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ ok: false, error: "NOT_FOUND" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("[error]", err);
  res.status(500).json({ ok: false, error: "INTERNAL" });
}
