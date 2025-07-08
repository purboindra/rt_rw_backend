import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../utils/errors";
import { generateOtp } from "../services/telegeram.service";
import { verifyJwt } from "../utils/jwt";
import redis from "../lib/redis";

export const createRefreshToken = async (req: Request, res: Response) => {
  try {
    const { access_token, refresh_token } = req.body;

    if (!access_token) {
      res.status(400).json({ message: "access_token is required", data: null });
      return;
    }

    const jwt = verifyJwt(access_token);

    if (typeof jwt !== "object") {
      res.status(401).json({ message: "Unauthorized", data: null });
      return;
    }

    const userId = jwt.user_id;

    const response = await authService.createRefreshToken(userId);

    await authService.revokeRefreshToken(refresh_token);

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
  console.log("signIn");
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

      await redis.set(otpCode.toString(), phone, { EX: 300 });

      await authService.storeOtpToDatabase(phone, otpCode);

      const webUrl = `https://t.me/RTRWCommBot?start=verify_${otpCode}`;

      const botUrl = webUrl;

      res.status(201).json({
        code: "USER_NOT_VERIFIED",
        message: "User not verified their phone number",
        data: {
          redirect_url: botUrl,
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

    console.log(`Phone number: ${phone}, otp: ${otp}`);

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

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("authenticateToken middleware called");

    const authHeader = req.headers["authorization"];

    console.log("authenticateToken authHeader", authHeader);

    if (!authHeader) {
      throw new AppError("Authorization header missing", 401);
    }

    const token = authHeader && authHeader.split(" ")[1];

    console.log("authenticateToken token", token);

    if (!token) {
      throw new AppError("Token missing", 401);
    }

    const jwt = verifyJwt(token);

    console.log("authenticateToken jwt", jwt);

    if (typeof jwt !== "object") {
      throw new AppError("Unauthorized", 401);
    }

    if (jwt.exp && jwt.exp < Date.now() / 1000) {
      throw new AppError("Token expired", 401);
    }

    req.access_token = token;

    next();
  } catch (error) {
    console.error("Error authenticateToken", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};
