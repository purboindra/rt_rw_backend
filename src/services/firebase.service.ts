import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import pLimit from "p-limit";
import prisma from "../db";
import { AppError } from "../utils/errors";

import type { MulticastMessage } from "firebase-admin/messaging";
import { NotifyFCMInterface, UpsertFcmTokenInterface } from "../..";
import { logger } from "../logger";

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
      include: {
        user: true,
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

    const topic = `rt.${response.user.rtId}.admin`;
    const role = response.user.role;
    const isAdmin = role === "ADMIN";

    if (isAdmin) {
      await messaging.subscribeToTopic([fcmToken], topic);
    } else {
      await messaging.unsubscribeFromTopic([fcmToken], topic).catch(() => {});
    }

    if (response) return response;
  } catch (error) {
    logger.error({ error }, "Error upsert FCM Token");
    throw error;
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
    if (fcmTokens.length === 0) throw new AppError("Invalid fcm tokens", 400);

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

            if (code.includes("registration-token-not-registered") || code.includes("invalid-registration-token")) {
              invalidTokens.push(tokens[i]);
            }
          }
        });
        await Promise.all(tasks);
        return { success, failure, invalid: invalidTokens };
      }),
    );
  } catch (error) {
    logger.error({ error }, "Error notify user");
    throw error;
  }
};

export const subscribeToTopic = async (fcmToken: string, rtId: string) => {
  try {
    await messaging.subscribeToTopic([fcmToken], `rt.${rtId}.admin`);
  } catch (error) {
    logger.error({ error }, "Error subscribe to topic");
    throw error;
  }
};

export const registerUserDevice = async () => {};
