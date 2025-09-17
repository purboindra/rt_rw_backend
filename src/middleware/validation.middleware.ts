import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import * as z from "zod";

export const zodErrorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof z.ZodError) {
    const { fieldErrors, formErrors } = z.flattenError(err);

    res.status(422).json({
      message: "Invalid input",
      fieldErrors,
      formErrors,
    });
    return;
  }
  next(err);
};
