import { Request } from "express";
import { AppError } from "./errors";
import { verifyJwt } from "./jwt";

export const isAdmin = (req: Request): boolean => {
  const accessToken = req.access_token;

  if (!accessToken) {
    throw new AppError("Access token is missing or invalid", 401);
  }

  const jwt = verifyJwt(accessToken);

  if (typeof jwt !== "object") {
    throw new AppError("User tidak valid", 400);
  }

  const rtId = jwt.rt_id;
  const role = jwt.role;

  if (role !== "ADMIN") {
    throw new AppError("Anda tidak diizinkan untuk membuat aktifitas", 403);
  }

  return true;
};

export type Role = "WARGA" | "ADMIN" | "BENDAHARA";

export const isRole = (value: unknown): value is Role =>
  value === "WARGA" || value === "ADMIN" || value === "BENDAHARA";
