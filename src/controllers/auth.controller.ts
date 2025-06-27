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

export const revokeRefreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "refreshToken is required" });
      return;
    }

    const response = await authService.revokeRefreshToken(refreshToken);

    res.status(200).json({
      message: "Success revoke refresh token",
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

export const signIn = async (req: Request, res: Response) => {
  try {
    const { whatsAppNumber } = req.body;

    if (!whatsAppNumber) {
      res.status(400).json({ message: "whatsAppNumber is required" });
      return;
    }

    const response = await authService.signIn(whatsAppNumber);

    res.status(201).json({
      message: "Success sign in",
      data: response,
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
