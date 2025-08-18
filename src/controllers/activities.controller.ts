import { Request, Response } from "express";
import * as activityService from "../services/activities.service";
import { AppError } from "../utils/errors";
import { notifyUser } from "../services/firebase.service";

export const getActivityById = async (req: Request, res: Response) => {
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
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    console.log(`query getAllActivities: ${JSON.stringify(query)}`);

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
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const createActivity = async (req: Request, res: Response) => {
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

    const response = await activityService.createActivity({
      createdById: req?.user?.user_id ?? "",
      accessToken: accessToken,
      date: date,
      title: title,
      type: type,
      description: description,
      picId: pic_id,
      userIds: user_ids,
    });

    res.status(201).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    console.error("Error create activity", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const updateActivity = async (req: Request, res: Response) => {
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

    const accessToken = req?.access_token;

    console.log("accessToken", accessToken);

    if (!accessToken) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    const userIds: string[] = [
      ...(currentActivity?.users ?? []).map((userId) => userId.id),
      ...(req?.body?.user_ids ?? []),
    ];

    console.log("userIds", userIds);

    if (!Array.isArray(userIds)) {
      res.status(400).json({ message: "user_ids must be an array of user id" });
      return;
    }

    const response = await activityService.updateActivity(id, {
      accessToken: accessToken,
      date: body?.date ?? currentActivity.date,
      description: body?.description ?? currentActivity.description,
      picId: body?.pic_id ?? currentActivity.picId,
      userIds: userIds,
    });

    res.status(200).json({
      message: "success",
      data: response,
    });
    return;
  } catch (error) {
    console.error("Error update activity", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "Activity id is required" });
      return;
    }

    await activityService.deleteActivity(id);

    res.status(200).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const joinActivity = async (req: Request, res: Response) => {
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

    console.log("users", users);

    /// LOGIC SEND NOTIF TO ALL USERS WHO JOINED ACTIVITY
    if (Array.isArray(users) && users.length > 0) {
      let fcm_tokens: string[] = [];

      for (const user of users) {
        const devices = user.devices;
        for (const device of devices) {
          const fcmToken = device.fcmToken;
          const isRevoked = device.isRevoked;

          if (!isRevoked && user.id !== user_id) {
            fcm_tokens.push(fcmToken);
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
    res.status(statusCode).json({ message, data: null });
    return;
  }
};
