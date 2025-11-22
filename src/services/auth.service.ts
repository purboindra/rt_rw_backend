import prisma from "../db";
import { AppError } from "../utils/errors";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { findRtById } from "./rt.service";
import { findUserById, findUserByWhatsAppNumber } from "./users.service";

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;

export const createRefreshToken = async (userId: string) => {
  try {
    const user = await findUserById(userId);

    const rt = await findRtById(user.rtId);

    const accessToken = generateAccessToken({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      address: user.address,
      rtId: rt.id,
      email: user.email ?? undefined,
      isEmailVerified: user.emailVerified,
    });

    const refreshToken = generateRefreshToken(user.id, rt.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        /// Set the refresh token to expire in 7 days
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
        userId: user.id,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

export const revokeRefreshToken = async (refreshToken: string) => {
  try {
    await prisma.refreshToken.update({
      where: {
        token: refreshToken,
      },
      data: {
        revoked: true,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const generateToken = async (whatsAppNumber: string) => {
  try {
    const user = await findUserByWhatsAppNumber(whatsAppNumber);

    const { access_token, refresh_token } = await createRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
    };
  } catch (error) {
    throw error;
  }
};

export const checkIsVerified = async (phone: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    return user?.isVerified ?? false;
  } catch (error) {
    console.error("Error checking if user is verified:", error);
    throw error;
  }
};

export const sendOtpToService = async (phoneNumber: string, code: string, chatId: string) => {
  const telegramMessage = `🔐 Your OTP code is: ${code}`;

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: telegramMessage,
    }),
  });

  await prisma.otp.create({
    data: {
      phoneNumber,
      code,
      expiration: new Date(Date.now() + 5 * 60 * 1000),
    },
  });
};

export const storeOtpToDatabase = async (phoneNumber: string, otpCode: string) => {
  try {
    await prisma.otp.create({
      data: {
        phoneNumber,
        code: otpCode,
        expiration: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("Error storing otp to database:", error);

    throw error instanceof AppError ? error : new AppError("Failed to store otp to database", 500);
  }
};

export const verifyOtp = async (phoneNumber: string, otpCode: string) => {
  try {
    // TODO: CHECK IF OTP IS ACTIVE
    // IF USER HAVE AN ACTIVE OTP
    // THEN TRY GENERATE ONE
    // PREV OTP SHOULD BE EXPIRED

    const otp = await prisma.otp.findFirst({
      where: {
        phoneNumber,
        code: otpCode,
        expiration: {
          gt: new Date(),
        },
      },
    });

    if (!otp) {
      throw new AppError("Invalid OTP", 400);
    }

    await prisma.user.update({
      where: {
        phone: phoneNumber,
      },
      data: {
        isVerified: true,
      },
    });

    await prisma.otp.delete({
      where: {
        id: otp.id,
      },
    });

    const token = generateToken(phoneNumber);

    return token;
  } catch (error) {
    throw error;
  }
};

export const checkIsRegistered = async (phone: string): Promise<boolean | AppError> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (!user) {
      throw new AppError("User not registered", 401);
    }

    return !!user;
  } catch (error) {
    console.error("Error checking if user is registered:", error);
    throw error;
  }
};
