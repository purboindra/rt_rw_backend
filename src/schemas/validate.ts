import type { NextFunction, Request, Response } from "express";
import * as z from "zod";

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

type ValidateInput = (
  schema: z.ZodObject<{
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
  }>
) => MiddlewareFunction;

export const validateInput: ValidateInput =
  (schema): MiddlewareFunction =>
  (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
      });
    }

    // Call the next middleware or route handler
    next();
  };
