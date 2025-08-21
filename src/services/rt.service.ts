import { Rt } from "../../generated/prisma";
import prisma from "../db";
import { AppError } from "../utils/errors";

interface CreateRtInput {
  name: string;
  address: string;
  totalFunds?: number;
  users?: string[];
  activities?: string[];
  news?: string[];
}

export const getAllRt = async () => {
  return await prisma.rt.findMany();
};

export const createRt = async (data: CreateRtInput): Promise<Rt> => {
  try {
    const rt = await prisma.rt.create({
      data: {
        name: data.name,
        address: data.address,
        totalFunds: data.totalFunds || 0,
        users: { connect: data.users?.map((id) => ({ id })) },
        activities: { connect: data.activities?.map((id) => ({ id })) },
        news: { connect: data.news?.map((id) => ({ id })) },
      },
    });

    return rt;
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to create rt", 500);
  }
};

export const findRtById = async (id: string): Promise<Rt> => {
  try {
    const user = await prisma.rt.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new AppError("RT not found", 404);
    }

    return user;
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find RT", 500);
  }
};
