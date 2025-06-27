import { Request, Response } from "express";
import * as rtService from "../services/rt.service";
import { AppError } from "../utils/errors";

export const getAllRt = async (req: Request, res: Response) => {
  try {
    const rt = await rtService.getAllRt();
    res.status(200).json({
      message: "success",
      data: rt,
    });
    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message });
    return;
  }
};

export const createRt = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      res.status(400).json({ message: "name and address are required" });
      return;
    }

    const rt = await rtService.createRt({ name, address });

    res.status(201).json({
      message: "Success create rt",
      data: rt,
    });

    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message });
    return;
  }
};
