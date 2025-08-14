import { NextFunction, Request, Response } from "express";
import { messaging } from "../services/firebase.service";
import type { MulticastMessage } from "firebase-admin/messaging";

export const notify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const registrationTokens = ["FCM TOKEN 1", "FCM TOKEN 2", "FCM TOKEN 3"];

    const message: MulticastMessage = {
      tokens: registrationTokens,
      data: {
        title: "Gotong Royong",
        description: "Gotong royong di RT 023/099 Minggu Pagi!",
      },
      android: {
        priority: "high",
      },
    };

    const response = await messaging.sendEachForMulticast(message);
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
  } catch (error: any) {
    console.error(`Error upsertFCMToken: ${error}`);
    res
      .status(500)
      .json({ error: error?.message ?? "Failed to upsert FCM token" });
  }
};
