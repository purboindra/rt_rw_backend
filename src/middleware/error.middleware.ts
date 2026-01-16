import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { logger } from "../logger";
import { AppError } from "../utils/errors";

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const appErr = err instanceof AppError ? err : new AppError("Internal server error", 500);

  logger.error({ appErr }, "Error caught ing errorHandler middleware");

  if (req.method === "POST") {
    const body = req.body;
    logger.debug({ body });
  }

  if (err instanceof z.ZodError) {
    const { fieldErrors, formErrors } = z.flattenError(err);

    logger.error({ fieldErrors, formErrors }, "Error from zod");

    res.status(422).json({
      message: "Invalid input",
      data: null,
      details: fieldErrors,
    });
    return;
  }

  req.log?.error({ err: serializeErr(err), type: appErr.type, meta: appErr.meta }, appErr.message);

  res.status(appErr.statusCode).json({
    message: appErr.message,
    data: null,
    ...(appErr.meta ? { details: appErr.meta } : {}),
  });
}

function serializeErr(err: unknown) {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    };
  }
  return err;
}
