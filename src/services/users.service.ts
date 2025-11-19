import { User } from "@prisma/client";
import crypto from "crypto";
import prisma from "../db";
import { logger } from "../logger";
import { CreateUserInput } from "../schemas/user.schemas";
import { VERIFICATION_TOKEN_EXPIRES_IN_MINUTES } from "../utils/constants";
import { AppError } from "../utils/errors";
import { sendVerificationEmail } from "./email.service";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const user = await prisma.user.findMany();

    return user;
  } catch (error) {
    throw error;
  }
};

export const findUserByWhatsAppNumber = async (whatsAppNumber: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phone: whatsAppNumber,
      },
      include: {
        rt: true,
        activitiesAsPIC: true,
        activities: true,
        devices: true,
        news: true,
        activitiesCreated: true,
        accounts: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  } catch (error) {
    throw error;
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
      throw new AppError("RT tidak ditemukan", 404);
    }

    const user = await prisma.user.create({ data });

    return user;
  } catch (error) {
    logger.error({ error }, "Error create user service");
    throw error;
  }
};

export const findUserById = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new AppError("User not found", 404);

    return user;
  } catch (error) {
    throw error;
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
    throw error;
  }
};

export const requestEmailVerification = async (email: string, userId: string) => {
  try {
    const existingUserWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
      logger.warn(
        `User ${userId} tried to claim email ${email} which is already owned by user ${existingUserWithEmail.id}`,
      );
      return {
        message: "Verification email sent. Please check your inbox.",
      };
    }

    const code = crypto.randomInt(100000, 999999).toString();

    const expiredAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000);

    await prisma.$transaction([
      prisma.verification.deleteMany({
        where: {
          userId: userId,
        },
      }),
      prisma.verification.create({
        data: {
          userId: userId,
          email: email,
          code: code,
          expiresAt: expiredAt,
        },
      }),
    ]);

    await sendVerificationEmail(email, code);

    return {
      message: "Email verifikasi telah dikirimkan ke alamat email kamu",
    };
  } catch (error) {
    logger.error({ error }, "Error request email verification");
    throw error;
  }
};

export const veriftyEmail = async (email: string, code: string) => {
  try {
  } catch (error) {
    logger.error({ error }, "Error verify email");
    throw error;
  }
};
