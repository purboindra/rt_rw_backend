import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new AppError("Authorization header missing", 401);
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Token missing", 401);
    }

    const jwt = verifyJwt(token);

    if (typeof jwt !== "object") {
      throw new AppError("Unauthorized", 401);
    }

    if (jwt.exp && jwt.exp < Date.now() / 1000) {
      throw new AppError("Token expired", 401);
    }

    if (jwt.revoked) {
      throw new AppError("Token revoked", 401);
    }

    req.access_token = token;

    req.user = {
      user_id: jwt.sub ?? jwt.userId,
      role: jwt.role,
      rt_id: jwt.rtId,
      name: jwt.name,
    };

    next();
  } catch (error) {
    const debugAuthMiddleware = {
      user: req.user,
      access_token: req.access_token,
      url: req.url,
      method: req.method,
      originalUrl: req.originalUrl,
      body: req.body,
      headers: req.headers,
    };

    let message = "Internal server error";
    let statusCode = 500;

    if (error instanceof AppError) {
      message = error.message;
      statusCode = error instanceof AppError ? error.statusCode : 500;
    } else if (error instanceof TokenExpiredError) {
      if (error.name === "TokenExpiredError") {
        message = "Token expired";
        statusCode = 401;
      } else {
        message = error.message;
      }
    }

    res.status(statusCode).send({
      message,
      data: null,
    });

    next("router");
  }
};
