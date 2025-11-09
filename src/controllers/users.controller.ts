import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { createRefreshToken } from "../services/auth.service";
import * as userService from "../services/users.service";
import { errorToAppError } from "../utils/errors";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      message: "success",
      data: users,
    });
    return;
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, address, rtId } = req.body;

    const user = await userService.createUser({
      name,
      phone,
      email,
      address,
      /// TODO: GET RT ID FROM TOKEN (CURRENT USER)
      rtId: rtId,
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
    logger.error({ error }, "Error while create user user controller");
    next(errorToAppError(error));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.params;
    await userService.deleteUser(phone);
    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const findUserByPhone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.params;
    const user = await userService.findUserByWhatsAppNumber(phone);
    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};
