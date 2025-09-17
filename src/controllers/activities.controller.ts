import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as activityService from "../services/activities.service";
import { notifyUser } from "../services/firebase.service";
import { AppError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";

export const getActivityById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const activities = await activityService.findActivityById(id);

    res.status(200).json({
      message: "Success get activity detail",
      data: activities,
    });
    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};

export const getAllActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query;

    const activities = await activityService.getAllActivities(query);

    res.status(200).json({
      message: "Success get all activites",
      data: activities,
    });
    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};

export const createActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description, title, type, date, pic_id, user_ids } = req.body;

    if (!title || !description || !type || !date || !pic_id) {
      res.status(400).json({
        message: "title, description, type, date, pic_id are required",
      });
      return;
    }

    if (!user_ids) {
      res.status(400).json({ message: "user_ids are required" });
      return;
    }

    if (!Array.isArray(user_ids)) {
      res.status(400).json({ message: "user_ids must be an array of user id" });
      return;
    }

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

    logger.debug({
      message: "Create activity",
      data: {
        rt_id: rtId,
        created_by_id: req?.user?.user_id ?? "",
      },
    });

    const response = await activityService.createActivity({
      created_by_id: req?.user?.user_id ?? "",
      pic_id: pic_id,
      rt_id: rtId,
      user_ids: user_ids,
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
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};

export const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};

export const deleteActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};

export const joinActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

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

    const accessToken = req?.access_token;
    const user_id = req?.user?.user_id;
    const username = req?.user?.name;

    if (!accessToken) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    if (!user_id) {
      res.status(401).json({ message: "User id is missing or invalid" });
      return;
    }

    await activityService.joinActivity(id, user_id);

    const users = currentActivity.users;

    /// LOGIC SEND NOTIF TO ALL USERS WHO JOINED ACTIVITY
    if (Array.isArray(users) && users.length > 0) {
      let fcm_tokens: string[] = [];

      for (const user of users) {
        const devices = user.devices;
        if (devices) {
          for (const device of devices) {
            const fcmToken = device.fcmToken;
            const isRevoked = device.isRevoked;

            if (!isRevoked && user.id !== user_id) {
              fcm_tokens.push(fcmToken);
            }
          }
        }
      }

      await notifyUser({
        title: "Join Activity",
        body: `${username} has joined the activity: ${currentActivity.title}`,
        fcmTokens: fcm_tokens.flat(),
      });
    }

    res.status(202).json({
      message: "Success join activity",
      data: null,
    });
    return;
  } catch (error) {
    console.error("Error join activity", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    next(new AppError(message, statusCode));
  }
};
