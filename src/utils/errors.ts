import { Prisma } from "@prisma/client";

export type AppErrorType =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL"
  | "UNAVAILABLE";

interface AppErrorArgs {}

export class AppError extends Error {
  statusCode: number;
  publicMessage?: string;
  type?: AppErrorType;

  constructor(
    message: string,
    statusCode: number,
    public meta?: Record<string, unknown>,
    type?: AppErrorType,
    publicMessage?: string
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.type = type;
    this.publicMessage = publicMessage;
  }
}

export function errorToAppError(
  err: unknown,
  fallback = "Internal server error"
): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2021":
        return new AppError(
          "The table does not exist in the current database.",
          404,
          {
            target: err.meta?.target,
          }
        );
      case "P2002":
        return new AppError("Duplicate value for a unique field.", 400, {
          target: err.meta?.target,
        });
      case "P2003":
        return new AppError("Related record not found (foreign key).", 400, {
          field: err.meta?.field_name,
        });
      case "P2000":
        return new AppError("Value is too long for the field.", 400, {
          column: err.meta?.column_name,
        });
      case "P2001":
      case "P2025":
        return new AppError("Record not found.", 404, {
          meta: err.meta,
        });
      default:
        return new AppError(fallback, 500, {
          code: err.code,
          meta: err.meta,
        });
    }
  }

  if (
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  ) {
    return new AppError(
      "Database temporarily unavailable. Please try again.",

      503
    );
  }

  return new AppError(fallback, 500);
}

export class ErrorData {
  data?: any;
  message: string;
  statusCode?: number;

  constructor(message = "", data = null, statusCode = undefined) {
    ((this.data = data),
      (this.message = message),
      (this.statusCode = statusCode));
  }
}
