import { NextFunction, Request, Response } from "express";
import { upsertToken, notifyUser } from "../services/firebase.service";
import { AppError } from "../utils/errors";

export const notify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body, fcmTokens } = req.body;

    const response = await notifyUser({ title, body, fcmTokens });

    if (response instanceof AppError) {
      throw new AppError(response.message, response.statusCode);
    }

    res.status(200).json({ success: true, response });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: err?.message ?? "Failed to send notification" });
  }
};

export const upsertFCMToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fcm_token, platform, app_version, device_model, os_version } =
      req.body;

    if (!fcm_token) {
      throw new AppError("FCM token is required", 400);
    }

    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("User id is required", 400);
    }

    const response = await upsertToken({
      fcmToken: fcm_token,
      platform: platform.toUpperCase(),
      userId: userId,
      appVersion: app_version,
      deviceModel: device_model,
      osVersion: os_version,
    });

    if (response instanceof AppError) {
      throw new AppError(response.message, response.statusCode);
    }

    res
      .status(200)
      .json({ message: "FCM token upserted successfully", data: null });
    return;
  } catch (error: any) {
    console.error(`Error upsertFCMToken: ${error}`);
    res
      .status(500)
      .json({ error: error?.message ?? "Failed to upsert FCM token" });
    return;
  }
};
