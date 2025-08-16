import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";
import { TokenExpiredError } from "jsonwebtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("authenticateToken middleware called");

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
    req.user = jwt;

    next();
  } catch (error) {
    console.error("Error authenticateToken middleware", error);

    let message = "Internal server error";
    if (error instanceof AppError) {
      message = error.message;
    } else if (error instanceof TokenExpiredError) {
      if (error.name === "TokenExpiredError") {
        message = "Token expired";
      } else {
        message = error.message;
      }
    }

    const statusCode = error instanceof AppError ? error.statusCode : 500;

    res.status(statusCode).send({
      message,
      data: null,
    });
    next("route");
  }
};
