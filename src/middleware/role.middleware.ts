import { NextFunction, Request, Response } from "express";
import { isRole, Role } from "../utils/roleUtils";

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
