import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const appErr =
    err instanceof AppError ? err : new AppError("Internal server error", 500);

  req.log?.error(
    { err: serializeErr(err), type: appErr.type, meta: appErr.meta },
    appErr.message
  );

  res.status(appErr.statusCode).json({
    error: {
      type: appErr.type,
      message: appErr.message,
      ...(appErr.meta ? { meta: appErr.meta } : {}),
    },
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
