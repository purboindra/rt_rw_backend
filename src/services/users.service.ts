import { User } from "@prisma/client";
import { CreateUserInput } from "../..";
import prisma from "../db";
import { logger } from "../logger";
import { AppError, errorToAppError } from "../utils/errors";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const user = await prisma.user.findMany();

    return user;
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find user", 500);
  }
};

export const findUserByWhatsAppNumber = async (
  whatsAppNumber: string
): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phone: whatsAppNumber,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find user", 500);
  }
};

export const createUser = async (data: CreateUserInput) => {
  try {
    const userByWhatsAppNumber = await prisma.user.findUnique({
      where: {
        phone: data.phone,
      },
    });

    if (userByWhatsAppNumber) {
      throw new AppError("User already exists", 400);
    }

    const findRt = await prisma.rt.findUnique({
      where: {
        id: data.rtId,
      },
    });

    if (!findRt) {
      throw new AppError("RT not found", 404);
    }

    const user = await prisma.user.create({ data });

    return user;
  } catch (error) {
    logger.error({ error }, "Error create user service");
    throw errorToAppError(error, "Failed to create user");
  }
};

export const findUserById = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find user", 500);
  }
};

export const deleteUser = async (phone: string): Promise<User> => {
  try {
    const user = await prisma.user.delete({
      where: {
        phone,
      },
    });

    return user;
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find user", 500);
  }
};
