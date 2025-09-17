import { Rt } from "@prisma/client";
import prisma from "../db";
import { CreateRTInput } from "../schemas/rt.schema";
import { AppError, errorToAppError } from "../utils/errors";

export const getAllRt = async () => {
  return await prisma.rt.findMany();
};

export const createRt = async (data: CreateRTInput): Promise<Rt> => {
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
    console.error("Error creating rt:", error);
    throw errorToAppError(error);
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
    throw errorToAppError(error);
  }
};
