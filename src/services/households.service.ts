import { Prisma } from "@prisma/client";
import prisma from "../db";
import { logger } from "../logger";
import { CreateHouseholdInput, getHouseholdsQuery, UpdateHouseholdInput } from "../schemas/households.schema";
import { AppError } from "../utils/errors";

export const createHouseholds = async (params: CreateHouseholdInput) => {
  try {
    return await prisma.household.create({
      data: {
        address: params.address,
        rtId: params.rtId,
        status: params.status,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error creating household");
    throw error;
  }
};

export const attachUsersHousehold = async (householdId: string, userIds: string[]) => {
  try {
    if (!userIds?.length || userIds.length === 0) {
      throw new AppError("User ids are required to attach to household", 400);
    }

    /// If household not found
    /// Will throw an error
    const household = await prisma.household.findFirst({
      where: { id: householdId },
      select: { id: true, rtId: true, users: true },
    });

    if (!household) {
      throw new AppError("Household not found", 404);
    }

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        rtId: true,
      },
    });

    if (users.length !== userIds.length) {
      throw new AppError("Some users not found", 404);
    }

    const invalidRt = users.find((user) => user.rtId !== household.rtId);

    if (invalidRt) {
      throw new AppError("User RT mismatch with household RT", 400);
    }

    const result = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: {
        householdId: householdId,
      },
    });

    return result;
  } catch (error) {
    logger.error({ error }, "Error creating household");
    throw error;
  }
};

export const getAllHouseHolds = async (rawQuery: unknown) => {
  try {
    const query = getHouseholdsQuery.parse(rawQuery);

    const where: Prisma.HouseholdWhereInput = {
      ...{ deletedAt: null },
      ...(query?.rtId && { rtId: query.rtId }),
      ...(query?.status && { status: query.status }),
      ...(query?.q && {
        OR: [
          {
            address: { contains: query.q, mode: "insensitive" },
            // user: {
            //   name: { contains: query.q, mode: "insensitive" },
            // },
          },
        ],
      }),
    };

    const response = await prisma.household.findMany({
      take: query.limit,
      where,
      include: {
        users: true,
      },
      orderBy: [{ createdAt: query?.order }, { id: query?.order }],
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Error fetching houeholds:");
    throw error;
  }
};

export const findHouseholdById = async (householdId: string) => {
  try {
    const response = await prisma.household.findFirst({
      where: {
        id: householdId,
        deletedAt: null,
      },
      include: {
        users: true,
        invoices: true,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Error fetching household by id:");
    throw error;
  }
};

export const deleteHouseholdById = async (userId: string, householdId: string) => {
  try {
    await prisma.household.update({
      where: {
        id: householdId,
      },
      data: {
        deletedAt: new Date(),
        deletedById: userId,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error deleting household by id:");
    throw error;
  }
};

export const updateHousehold = async (householdId: string, data: Partial<UpdateHouseholdInput>) => {
  try {
    const response = await prisma.household.update({
      where: {
        id: householdId,
      },
      data: {
        ...data,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Error updating household by id:");
    throw error;
  }
};
