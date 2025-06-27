import prisma from "../../prisma/client";
import { AppError } from "../utils/errors";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const createRefreshToken = async (userId: string) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new AppError("User not found", 404);
    }

    const findRt = await prisma.rt.findUnique({
      where: {
        id: findUser.rtId,
      },
    });

    if (!findRt) {
      throw new AppError("Rt not found", 404);
    }

    const accessToken = generateAccessToken({
      address: findUser.address,
      id: findUser.id,
      createdAt: findUser.createdAt,
      name: findUser.name,
      phone: findUser.phone,
      role: findUser.role,
      rt: {
        id: findRt.id,
        name: findRt.name,
        address: findRt.address,
        activities: [],
        totalFunds: findRt.totalFunds,
        users: [],
        createdAt: findRt.createdAt,
      },
    });

    const refreshToken = generateRefreshToken(findUser.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        /// Set the refresh token to expire in 7 days
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false,
        userId: findUser.id,
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
