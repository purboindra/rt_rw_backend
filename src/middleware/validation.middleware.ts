import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const zodErrorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const { fieldErrors, formErrors } = err.flatten();
    res.status(422).json({
      message: "Invalid input",
      fieldErrors,
      formErrors,
    });
    return;
  }
  next(err);
};
