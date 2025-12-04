import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as activityService from "../services/activities.service";
import { notifyUser } from "../services/firebase.service";
import { AppError, errorToAppError } from "../utils/errors";
import { pushFcmTokens } from "../utils/fcmUtils";
import { verifyJwt } from "../utils/jwt";

export const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const activities = await activityService.findActivityById(id);

    res.status(200).json({
      message: "Success get activity detail",
      data: activities,
    });
    return;
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const getAllActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;

    const activities = await activityService.getAllActivities(query);

    res.status(200).json({
      message: "Success get all activites",
      data: activities,
    });
    return;
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, title, type, date, picId, userIds } = req.body;

    const accessToken = req.access_token;

    if (!accessToken) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    const jwt = verifyJwt(accessToken);

    if (typeof jwt !== "object") {
      throw new AppError("User tidak valid", 400);
    }

    const rtId = jwt.rt_id;
    const role = jwt.role;

    if (role !== "PENGURUS") {
      throw new AppError("Anda tidak diizinkan untuk membuat aktifitas", 403);
    }

    logger.debug({
      message: "Create activity",
      data: {
        rt_id: rtId,
        created_by_id: req?.user?.user_id ?? "",
      },
    });

    const response = await activityService.createActivity({
      createdById: req?.user?.user_id ?? "",
      picId: picId,
      rtId: rtId,
      userIds: userIds,
      date: date,
      title: title,
      type: type,
      description: description,
    });

    res.status(201).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    console.error("Error create activity controller", error);
    next(errorToAppError(error));
  }
};

export const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "Activity id is required" });
      return;
    }

    /// Fetch exist activity
    const currentActivity = await activityService.findActivityById(id);

    /// If isnt exist
    if (!currentActivity) {
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    const userIds: string[] = [
      ...(currentActivity?.users ?? []).map((userId) => userId.id),
      ...(req?.body?.user_ids ?? []),
    ];

    if (!Array.isArray(userIds)) {
      res.status(400).json({ message: "user_ids must be an array of user id" });
      return;
    }

    const updatedData = {
      ...body,
      userIds: !req?.body?.user_ids ? undefined : userIds,
    };

    const response = await activityService.updateActivity(id, updatedData);

    res.status(200).json({
      message: "Success update activity",
      data: response,
    });
    return;
  } catch (error) {
    logger.error({ error }, "Failed to update activity");
    next(errorToAppError(error));
  }
};

export const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "Activity id is required" });
      return;
    }

    await activityService.deleteActivity(id);

    res.status(200).json({
      message: "Success delete activity",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Failed to delete activity");
    next(errorToAppError(error));
  }
};

export const joinActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;

    /// Fetch exist activity
    const currentActivity = await activityService.findActivityById(id);

    /// If isnt exist
    if (!currentActivity) {
      throw new AppError("Kegiatan tidak ditemukan", 404);
    }

    const user_id = req?.user?.user_id;
    const username = req?.user?.name;

    if (!user_id) {
      throw new AppError("User tidak terautentikasi", 401);
    }

    await activityService.joinActivity(id, user_id!);

    const users = currentActivity.users;

    /// LOGIC SEND NOTIF TO ALL USERS WHO JOINED ACTIVITY
    if (Array.isArray(users) && users.length > 0) {
      const fcmTokens = pushFcmTokens(users, user_id!);

      await notifyUser({
        title: "Bergabung Kegiatan",
        body: `${username} bergabung ke kegiatan: ${currentActivity.title}`,
        fcmTokens: fcmTokens.flat(),
      });
    }

    res.status(202).json({
      message: "Success join activity",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Failed to join activity");
    next(errorToAppError(error));
  }
};

export const getUsersActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const users = await activityService.getUsersActivity(id);

    res.status(200).json({
      message: "Success get all users activity",
      data: users,
    });
    return;
  } catch (error) {
    next(errorToAppError(error));
  }
};
