import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { DevicePlatformEnum } from "../utils/enums";
import { AppError } from "../utils/errors";
import prisma from "../../prisma/client";

import type { BatchResponse, MulticastMessage } from "firebase-admin/messaging";
import { NotifyFCMInterface, UpsertFcmTokenInterface } from "../..";

const app = initializeApp({
  credential: applicationDefault(),
});

export const messaging = getMessaging(app);

export const upsertToken = async ({
  fcmToken,
  platform,
  appVersion,
  deviceModel,
  osVersion,
  userId,
}: UpsertFcmTokenInterface) => {
  try {
    const response = await prisma.userDevice.upsert({
      where: { fcmToken },
      create: {
        userId,
        fcmToken,
        platform,
        deviceModel,
        osVersion,
        appVersion,
        lastSeenAt: new Date(),
      },
      update: {
        userId,
        platform,
        deviceModel,
        osVersion,
        appVersion,
        lastSeenAt: new Date(),
        isRevoked: false,
      },
    });

    return response;
  } catch (error) {
    console.error(`Error upsertFCMToken: ${error}`);
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    return new AppError(message, 500);
  }
};

export const notifyUser = async ({
  title,
  body,
  fcmTokens,
}: NotifyFCMInterface) => {
  try {
    const multicastMessage: MulticastMessage = {
      tokens: fcmTokens,
      data: {
        title: title,
        description: body,
      },
      android: {
        priority: "high",
      },
    };

    const response = await messaging.sendEachForMulticast(multicastMessage);

    return response;
  } catch (error) {
    console.error("Error notify user", error);
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    return new AppError(message, 500);
  }
};
