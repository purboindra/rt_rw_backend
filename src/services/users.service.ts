import { User } from "@prisma/client";
import crypto from "crypto";
import prisma from "../db";
import redis from "../lib/redis";
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
      throw new AppError("Email sudah digunakan oleh pengguna lain", 400);
    }

    if (existingUserWithEmail?.emailVerified) {
      throw new AppError("Email sudah diverifikasi sebelumnya", 400);
    }

    const redisKey = `email-verification:${email}`;

    const code = crypto.randomInt(100000, 999999).toString();

    const expiresInSeconds = VERIFICATION_TOKEN_EXPIRES_IN_MINUTES * 60;

    await redis.set(redisKey, code, {
      expiration: {
        type: "EX",
        value: expiresInSeconds,
      },
    });

    await sendVerificationEmail(email, code);

    /// Update user email
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: email,
      },
    });

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
    const redisKey = `email-verification:${email}`;

    const storedCode = await redis.get(redisKey);

    if (!storedCode) {
      throw new AppError("Kode verifikasi telah kadaluarsa atau tidak valid", 400);
    }

    if (storedCode !== code) {
      throw new AppError("Kode verifikasi tidak valid", 400);
    }

    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });

    await redis.del(redisKey);

    return {
      message: "Email berhasil diverifikasi",
      user: { id: user.id, email: user.email, emailVerified: user.emailVerified },
    };
  } catch (error) {
    logger.error({ error }, "Error verify email");
    throw error;
  }
};
