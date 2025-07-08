import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";

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
