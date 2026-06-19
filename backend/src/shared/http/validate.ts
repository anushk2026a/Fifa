import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

/** Validates and replaces req.body using a Zod schema. */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        ok: false,
        error: "VALIDATION_ERROR",
        details: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}
