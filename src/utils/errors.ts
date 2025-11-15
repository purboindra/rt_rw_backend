import { Prisma } from "@prisma/client";
import * as z from "zod";
import { logger } from "../logger";

export type AppErrorType = "BAD_REQUEST" | "NOT_FOUND" | "CONFLICT" | "INTERNAL" | "UNAVAILABLE";

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
    publicMessage?: string,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.type = type;
    this.publicMessage = publicMessage;
  }
}

export function errorToAppError(err: unknown, fallback = "Internal server error"): AppError {
  logger.error({ err }, "From errorToAppError");

  if (err instanceof AppError) return err;

  if (err instanceof z.ZodError) {
    throw err;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2021":
        return new AppError("The table does not exist in the current database.", 500, {
          target: err.meta?.target,
        });
      case "P2002":
        return new AppError("Duplicate value for a unique field.", 409, {
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
      case "P2010": {
        const databaseError =
          typeof err.meta === "object" && err.meta != null ? (err.meta as Record<string, unknown>) : undefined;

        return new AppError("Database query failed.", 500, {
          code: err.code,
          // dbCode: typeof databaseError?.code === "string" ? databaseError.code : undefined,
          message: typeof databaseError?.message === "string" ? databaseError.message : undefined,
        });
      }
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

      503,
    );
  }

  return new AppError(fallback, 500);
}
