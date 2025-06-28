import prisma from "../../prisma/client";
import { AppError } from "../utils/errors";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { findRtById } from "./rt.service";
import { findUserById, findUserByWhatsAppNumber } from "./user.service";

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
    });

    const refreshToken = generateRefreshToken(user.id);

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
    throw error instanceof AppError
      ? error
      : new AppError("Failed to create refresh token", 500);
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
    throw error instanceof AppError
      ? error
      : new AppError("Failed to revoke refresh token", 500);
  }
};

export const signIn = async (whatsAppNumber: string) => {
  try {
    const user = await findUserByWhatsAppNumber(whatsAppNumber);

    const { access_token, refresh_token } = await createRefreshToken(user.id);

    return {
      access_token,
      refresh_token,
    };
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to revoke refresh token", 500);
  }
};
