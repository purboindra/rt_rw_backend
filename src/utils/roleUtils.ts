import { NextFunction, Request, Response } from "express";
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

const isRole = (value: unknown): value is Role => value === "WARGA" || value === "ADMIN" || value === "BENDAHARA";

const stringToRole = (role: unknown): Role => {
  if (!role) return "WARGA";

  const normalized = String(role).trim().toUpperCase();
  if (isRole(normalized)) return normalized;

  return "WARGA";
};

export const requireAnyRole = (allowed: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  const roleRaw = req.user?.role;

  const normalized = String(roleRaw ?? "")
    .trim()
    .toUpperCase();

  if (!isRole(normalized)) {
    res.status(403).json({ message: "Forbidden", data: null });
    return;
  }

  if (!allowed.includes(normalized)) {
    res.status(403).json({ message: "Forbidden", data: null });
    return;
  }

  return next();
};
