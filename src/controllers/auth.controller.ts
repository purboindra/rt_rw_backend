import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../utils/errors";

export const createRefreshToken = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    const response = await authService.createRefreshToken(user_id);

    res.status(201).json({
      message: "Success create refresh token",
      data: response,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message });
    return;
  }
};
