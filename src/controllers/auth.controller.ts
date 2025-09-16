import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import redis from "../lib/redis";
import * as authService from "../services/auth.service";
import { generateOtp } from "../services/telegeram.service";
import { AppError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";

export const createRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(new AppError(message, statusCode));
  }
};

export const revokeRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(new AppError(message, statusCode));
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      const token = crypto.randomBytes(16).toString("base64url");

      await authService.storeOtpToDatabase(phone, otpCode);

      await redis.set(
        `tg:verify:${token}`,
        JSON.stringify({ phone, otp: otpCode }),
        { EX: 300 }
      );

      const webUrl = `https://t.me/RTRWCommBot?start=verify_${token}`;

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
    next(new AppError(message, statusCode));
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      throw new AppError("Phone number and otp is required", 400);
    }

    const token = await authService.verifyOtp(phone, otp);

    // await redis.del(otp);

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
    next(new AppError(message, statusCode));
  }
};
