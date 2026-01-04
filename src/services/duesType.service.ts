import { Prisma } from "@prisma/client";
import prisma from "../db";
import { CreateDuesTypeInput, getDuesTypeQuery, UpdateDuesTypeInput } from "../schemas/duesType.schema";

export const createDuesType = async (params: CreateDuesTypeInput) => {
  try {
    return await prisma.duesType.create({
      data: {
        ...params,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateDuesType = async (id: string, data: Partial<UpdateDuesTypeInput>) => {
  try {
    await prisma.duesType.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllDuesTypes = async (rawQuery: unknown) => {
  try {
    const query = getDuesTypeQuery.parse(rawQuery);

    const q = query?.q?.trim();

    const where: Prisma.DuesTypeWhereInput = {
      ...{ deletedAt: null },
      ...(query?.rtId && { rtId: query.rtId }),
      //   ...(query?.status && { isActive: query.status }),
      ...(q && {
        name: { contains: query.q, mode: "insensitive" },
      }),
    };

    const response = await prisma.duesType.findMany({
      take: query.limit,
      where,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDueTypeById = async (id: string) => {
  try {
    const response = await prisma.duesType.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        invoices: true,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteDuesTypeById = async (userId: string, duesTypeId: string) => {
  try {
    await prisma.duesType.update({
      where: {
        id: duesTypeId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedById: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};
