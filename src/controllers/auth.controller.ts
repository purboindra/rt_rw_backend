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
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
