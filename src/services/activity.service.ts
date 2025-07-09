import { CreateActivityParams, UpdateActivityParams } from "../..";
import { ActivityType } from "../../generated/prisma";
import prisma from "../../prisma/client";
import { ActivityEnum } from "../utils/enums";
import { AppError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";

export const createActivity = async (params: CreateActivityParams) => {
  try {
    const jwt = verifyJwt(params.accessToken);

    if (typeof jwt !== "object") {
      throw new AppError("Unauthorized", 401);
    }

    const rtId = jwt.rt_id;

    if (!(params.type in ActivityEnum)) {
      throw new AppError(
        `Invalid type. Valid types are: ${Object.values(ActivityType).join(
          ", "
        )}`,
        400
      );
    }

    const response = await prisma.activity.create({
      data: {
        date: params.date,
        title: params.title,
        type: params.type as ActivityEnum,
        description: params.description,
        pic: {
          connect: {
            id: params.picId,
          },
        },
        rt: {
          connect: {
            id: rtId,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error instanceof AppError
      ? error
      : new AppError("Failed to create activity", 500);
  }
};

export const findActivityById = async (activityId: string) => {
  try {
    const response = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!response) {
      throw new AppError("Activity not found", 404);
    }

    return response;
  } catch (error) {
    console.error("Error find activity by id:", error);
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find activity", 500);
  }
};

export const deleteActivity = async (activityId: string) => {
  try {
    const response = await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });

    if (!response) {
      throw new AppError("Activity not found", 404);
    }

    return response;
  } catch (error) {
    console.error("Error find activity by id:", error);
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find activity", 500);
  }
};

export const getAllActivities = async () => {
  try {
    const response = await prisma.activity.findMany();

    return response;
  } catch (error) {
    console.error("Error find activities:", error);
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find activity", 500);
  }
};

export const updateActivity = async (
  activityId: string,
  data: UpdateActivityParams
) => {
  try {
    const jwt = verifyJwt(data.accessToken);

    if (typeof jwt !== "object") {
      throw new AppError("Unauthorized", 401);
    }

    if (!(data.type in ActivityEnum)) {
      throw new AppError(
        `Invalid type. Valid types are: ${Object.values(ActivityType).join(
          ", "
        )}`,
        400
      );
    }

    const rtId = jwt.rt_id;

    const response = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        date: data.date,
        title: data.title,
        type: data.type as ActivityEnum,
        description: data.description,
        rt: {
          connect: {
            id: rtId,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Error find activity by id:", error);
    throw error instanceof AppError
      ? error
      : new AppError("Failed to find activity", 500);
  }
};
