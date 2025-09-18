import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as rtService from "../services/rt.service";
import { AppError } from "../utils/errors";

export const getAllRt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rt = await rtService.getAllRt();
    res.status(200).json({
      message: "success",
      data: rt,
    });
    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};

export const findRtById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const response = await rtService.findRtById(id);

    return response;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : "Internal server error";
    logger.error({ message }, "Error get rt by id");
    next(new AppError(message, statusCode));
  }
};

export const createRt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, address } = req.body;

    const rt = await rtService.createRt({ name, address });

    res.status(201).json({
      message: "Success create rt",
      data: rt,
    });

    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};

export const deleteRt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    await rtService.deleteRt(id);
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};
