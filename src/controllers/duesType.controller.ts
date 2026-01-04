import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as duesTypeService from "../services/duesType.service";
import { AppError, errorToAppError } from "../utils/errors";

export const createDuesType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const response = await duesTypeService.createDuesType(body);
    res.status(201).json({
      message: "Success create dues type",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error create dues type");
    next(errorToAppError(error));
  }
};

export const updateDuesType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const body = req.body;

    await duesTypeService.updateDuesType(id, body);

    res.status(201).json({
      message: "Success update dues type",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Error update dues type");
    next(errorToAppError(error));
  }
};

export const getAllDuesTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;

    const response = await duesTypeService.getAllDuesTypes(query);

    res.status(200).json({
      message: "Success get all dues types",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all dues types");
    next(errorToAppError(error));
  }
};

export const getDuesTypeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const response = await duesTypeService.getDueTypeById(id);

    if (!response) {
      throw new AppError("Tipe tagihan tidak ditemukan", 404);
    }

    res.status(200).json({
      message: "Success get dues type",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all dues type by id");
    next(errorToAppError(error));
  }
};

export const deleteDuesTypeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("User is required", 400);
    }

    await duesTypeService.deleteDuesTypeById(userId, id);

    res.status(200).json({
      message: "Success delete dues type",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Error delete dues type by id");
    next(errorToAppError(error));
  }
};
