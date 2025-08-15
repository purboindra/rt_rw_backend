import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { AppError } from "../utils/errors";
import prisma from "../../prisma/client";
import pLimit from "p-limit";

import type { BatchResponse, MulticastMessage } from "firebase-admin/messaging";
import { NotifyFCMInterface, UpsertFcmTokenInterface } from "../..";

const app = initializeApp({
  credential: applicationDefault(),
});

const messaging = getMessaging(app);

const CHUNK = 500;
const limit = pLimit(5);

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

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
  data = {},
  collapseKey,
  ttlSeconds = 3600,
}: NotifyFCMInterface) => {
  try {
    if (!fcmTokens?.length) throw new AppError("Invalid fcm tokens", 400);

    const batches = chunk([...new Set(fcmTokens)], CHUNK);

    const invalidTokens: string[] = [];
    let success = 0,
      failure = 0;

    const tasks = batches.map((tokens) =>
      limit(async () => {
        const msg: MulticastMessage = {
          tokens,
          notification: { title, body },
          data,
          android: {
            priority: "high",
            collapseKey,
            ttl: ttlSeconds * 1000,
            notification: {
              channelId: "fcm_default_channel",
              defaultSound: true,
              defaultVibrateTimings: true,
              priority: "high",
            },
          },
          apns: {
            headers: { "apns-priority": "10" },
            payload: { aps: { contentAvailable: true, sound: "default" } },
          },
          webpush: {
            headers: { Urgency: "high" },
          },
        };

        const res = await messaging.sendEachForMulticast(msg);

        success += res.successCount;
        failure += res.failureCount;

        res.responses.forEach((r, i) => {
          if (!r.success) {
            const code = (r.error || "").toString();

            if (
              code.includes("registration-token-not-registered") ||
              code.includes("invalid-registration-token")
            ) {
              invalidTokens.push(tokens[i]);
            }
          }
        });
        await Promise.all(tasks);
        return { success, failure, invalid: invalidTokens };
      })
    );
  } catch (error) {
    console.error("Error notify user", error);
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    return new AppError(message, 500);
  }
};
