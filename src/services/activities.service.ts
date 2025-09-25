import { ActivityType, Prisma } from "@prisma/client";
import prisma from "../db";
import { logger } from "../logger";
import { CreateActivityInput, getActivitiesQuery, updateActivitySchema } from "../schemas/activity.schemas";
import { ActivityEnum } from "../utils/enums";
import { AppError } from "../utils/errors";
import { pruneUndefined } from "../utils/helper";

export const createActivity = async (params: CreateActivityInput) => {
  try {
    if (!(params.type in ActivityEnum)) {
      throw new AppError(`Invalid type. Valid types are: ${Object.values(ActivityType).join(", ")}`, 400);
    }

    if (params.userIds.length === 0) {
      throw new AppError("User ids are required", 400);
    }

    if (!params.picId) {
      throw new AppError("Pic id is required", 400);
    }

    if (params.date && typeof params.date !== "number") {
      throw new AppError("Date must be a number", 400);
    }

    if (params.date && params.date < Date.now() / 1000) {
      throw new AppError("Date must be in the future", 400);
    }

    const response = await prisma.activity.create({
      data: {
        date: params.date,
        title: params.title,
        type: params.type as ActivityEnum,
        description: params.description,
        createdBy: {
          connect: {
            id: params.createdById,
          },
        },
        users: {
          connect: params.userIds.map((id: string) => ({ id })),
        },

        pic: {
          connect: {
            id: params.picId,
          },
        },
        rt: {
          connect: {
            id: params.rtId,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
};

export const findActivityById = async (activityId: string) => {
  try {
    const response = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
      include: {
        pic: {
          select: {
            id: true,
            name: true,
            rt: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            rt: true,
            role: true,
          },
        },
        users: {
          select: {
            devices: {
              select: {
                isRevoked: true,
                fcmToken: true,
                platform: true,
                deviceModel: true,
                osVersion: true,
                appVersion: true,
                lastSeenAt: true,
              },
            },
            id: true,
            name: true,
            rt: true,
            role: true,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Error find activity by id:", error);
    throw error;
  }
};

export const deleteActivity = async (activityId: string) => {
  try {
    const response = await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });

    return response;
  } catch (error) {
    console.error("Error find activity by id:", error);
    throw error;
  }
};

export const getAllActivities = async (rawQuery: unknown) => {
  try {
    const query = getActivitiesQuery.parse(rawQuery);

    const where: Prisma.ActivityWhereInput = {
      ...(query?.rtId && { rtId: query.rtId }),
      ...(query?.type && { type: query.type.toUpperCase() as any }),
      ...(query?.picId && { picId: query.picId }),

      ...(query?.q && {
        OR: [
          { title: { contains: query.q, mode: "insensitive" } },
          { pic: { name: { contains: query.q, mode: "insensitive" } } },
        ],
      }),
    };

    const rows = await prisma.activity.findMany({
      where,
      take: query?.limit,
      orderBy: [{ createdAt: query?.order }, { id: query?.order }],
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        rtId: true,
        date: true,
        createdById: true,
        picId: true,
        bannerImageUrl: true,
        imageUrl: true,
        description: true,
        pic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return rows;
  } catch (error) {
    logger.error({ error }, "Failed to get all activites");
    throw error;
  }
};

export const updateActivity = async (activityId: string, raw: unknown) => {
  try {
    const activity = await findActivityById(activityId);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    const input = updateActivitySchema.parse(raw);

    const userIds: string[] = [...(activity?.users ?? []).map((userId) => userId.id), ...(input.userIds ?? [])];

    const data: Prisma.ActivityUpdateInput = pruneUndefined({
      date: input.date ?? undefined,
      description: input.description,
      picId: input.picId,
      bannerImageUrl: input.bannerImageUrl,
      imageUrl: input.imageUrl,
      type: input.type as ActivityEnum,
      users: {
        set: userIds.map((id) => ({ id })),
      },
    });

    if (input.userIds !== undefined) {
      data.users = { set: input.userIds.map((id) => ({ id })) };
    }

    const response = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data,
      select: { id: true, date: true, description: true, picId: true },
    });

    return response;
  } catch (error) {
    console.error("Error find activity by id:", error);
    throw error;
  }
};

export const joinActivity = async (activityId: string, userId: string) => {
  try {
    const activity = await findActivityById(activityId);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    const hasJoinActivity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (hasJoinActivity) {
      throw new AppError("You are already joined this activity", 400);
    }

    const response = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Error find activity by id:", error);
    throw error;
  }
};
