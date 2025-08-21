import prisma from "../db";
import { Role, User } from "../../generated/prisma";
import { AppError } from "../utils/errors";

interface CreateUserInput {
  name: string;
  phone: string;
  email?: string;
  address: string;
  role: Role;
  rtId: string;
}

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
    throw error instanceof AppError
      ? error
      : new AppError("Failed to create user", 500);
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
