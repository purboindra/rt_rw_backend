import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { AppError } from "../utils/errors";
import { createRefreshToken } from "../services/auth.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      message: "success",
      data: users,
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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address, rt_id } = req.body;

    if (!name || !phone) {
      res
        .status(400)
        .json({ message: "name and phone are required", data: null });
      return;
    }

    if (!address) {
      res.status(400).json({ message: "address is required", data: null });
      return;
    }

    if (!rt_id) {
      res.status(400).json({ message: "rt is required", data: null });
      return;
    }

    const user = await userService.createUser({
      name,
      phone,
      email,
      address,
      /// TODO: GET RT ID FROM TOKEN (CURRENT USER)
      rtId: rt_id,
      role: "WARGA",
    });

    const { refresh_token, access_token } = await createRefreshToken(user.id);

    res.status(201).json({
      message: "Success create user",
      data: {
        access_token,
        refresh_token,
      },
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};
