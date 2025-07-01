import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../utils/errors";
import { generateOtp } from "../services/telegeram.service";

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
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const revokeRefreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "refreshToken is required", data: null });
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
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ message: "phone number is required", data: null });
      return;
    }

    const isVerif = await authService.checkIsVerified(phone);

    if (!isVerif) {
      /// TELL TO CLIENT
      /// IF USER NOT VERIFY THEIR PHONE NUMBER

      const otpCode = generateOtp();

      await authService.storeOtpToDatabase(phone, otpCode);

      const botUrl = `https://t.me/rt_rw_com?start=verify_${otpCode}`;

      res.status(403).json({
        code: "USER_NOT_VERIFIED",
        message: "User not verified their phone number",
        data: {
          redirect_url: botUrl,
        },
      });
      return;
    }

    const response = await authService.signIn(phone);

    res.status(201).json({
      message: "Success sign in",
      data: response,
    });
    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};
