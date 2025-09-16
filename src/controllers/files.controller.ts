import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { uploadFile } from "../services/files.service";
import { AppError } from "../utils/errors";

export const uploadFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const folder = req.query.folder;

  if (!folder) {
    res.status(400).json({ message: "Folder is required" });
    return;
  }

  try {
    const result = await uploadFile({
      buffer: req.file.buffer,
      fileName: req.file.originalname,
      folder: `/${folder}`,
    });

    res.status(201).json({ data: result });
    return;
  } catch (error: any) {
    logger.error({ error }, "Failed to upsert notification");
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};
