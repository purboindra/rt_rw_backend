import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../utils/errors";
import { generateOtp } from "../services/telegeram.service";
import redis from "../lib/redis";
import { verifyJwt } from "../utils/jwt";
import { refreshToken } from "firebase-admin/app";

export const createRefreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({ message: "refreshToken is required", data: null });
      return;
    }

    const jwt = verifyJwt(refresh_token);

    if (typeof jwt !== "object") {
      throw new AppError("Unauthorized", 401);
    }

    const { user_id } = jwt;

    const response = await authService.createRefreshToken(user_id ?? "");

    await authService.revokeRefreshToken(refresh_token);

    res.status(201).json({
      message: "Success create refresh token",
      data: response,
    });
  } catch (error) {
    console.error("Error create refresh token", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const revokeRefreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({ message: "refreshToken is required", data: null });
      return;
    }

    const response = await authService.revokeRefreshToken(refresh_token);

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

    const registered = await authService.checkIsRegistered(phone);

    if (registered instanceof AppError) {
      throw registered;
    }

    const isVerif = await authService.checkIsVerified(phone);

    if (!isVerif) {
      /// TELL TO CLIENT
      /// IF USER NOT VERIFY THEIR PHONE NUMBER

      const otpCode = generateOtp();

      await redis.set(otpCode.toString(), phone, { EX: 300 });

      await authService.storeOtpToDatabase(phone, otpCode);

      const webUrl = `https://t.me/RTRWCommBot?start=verify_${otpCode}`;

      res.status(201).json({
        code: "USER_NOT_VERIFIED",
        message: "User not verified their phone number",
        data: {
          redirect_url: webUrl,
        },
      });
      return;
    }

    const response = await authService.generateToken(phone);

    res.status(201).json({
      message: "Success sign in",
      data: response,
    });
    return;
  } catch (error) {
    console.error("Error sign in", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      throw new AppError("Phone number and otp is required", 400);
    }

    const token = await authService.verifyOtp(phone, otp);

    await redis.del(otp);

    res.status(200).json({
      message: "Success verify otp",
      data: token,
    });
    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    console.error("Error verify otp", message);
    res.status(statusCode).json({ message, data: null });
    return;
  }
};
