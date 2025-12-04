import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { createRefreshToken } from "../services/auth.service";
import * as userService from "../services/users.service";
import { AppError, errorToAppError } from "../utils/errors";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      message: "Success get all users",
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
      message: "Success delete user",
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
      message: "Success find user by phone",
      data: user,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const findUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(id);
    res.status(200).json({
      message: "Success find user by id",
      data: user,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const requestEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("User Unauthorized", 401);
    }

    const response = await userService.requestEmailVerification(email, userId);

    res.status(201).json({
      message: "Success request email verification",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error while request email verification user controller");
    next(errorToAppError(error));
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code } = req.body;

    const response = await userService.verifyEmail(email, code);

    res.status(201).json({
      message: "Success verify email",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error while verify email user controller");
    next(errorToAppError(error));
  }
};
