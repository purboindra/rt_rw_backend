import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { DevicePlatformEnum } from "../utils/enums";
import { AppError } from "../utils/errors";
import prisma from "../../prisma/client";

const app = initializeApp({
  credential: applicationDefault(),
});

export const messaging = getMessaging(app);

interface UpsertFcmTokenInterface {
  fcmToken: string;
  platform: DevicePlatformEnum;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  userId: string;
}

export const upsertFCMToken = async ({
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
    throw new AppError("Failed to upsertFCMToken", 500);
  }
};
