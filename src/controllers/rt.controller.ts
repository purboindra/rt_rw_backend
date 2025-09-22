import { NextFunction, Request, Response } from "express";
import * as rtService from "../services/rt.service";
import { errorToAppError } from "../utils/errors";

export const getAllRt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rt = await rtService.getAllRt();
    res.status(200).json({
      message: "success",
      data: rt,
    });
    return;
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const findRtById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const response = await rtService.findRtById(id);

    return response;
  } catch (error) {
    next(errorToAppError(error));
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
    next(errorToAppError(error));
  }
};

export const deleteRt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    await rtService.deleteRt(id);

    res.status(200).json({
      message: "Success delete rt",
      data: null,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};
