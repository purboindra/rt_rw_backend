import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users.routes";
import rtRoutes from "./routes/rt.routes";
import authRoutes from "./routes/auth.routes";
import activitiesRoutes from "./routes/activities.routes";
import firebaseRoutes from "./routes/firebase.route";
import telegramRoutes from "./routes/telegram.routes";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import { sendOtpToTelegram } from "./services/telegeram.service";
import redis from "./lib/redis";

import { AppError } from "./utils/errors";
import { logger } from "./logger";
import pinoHttp from "pino-http";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { authenticateToken } from "./middleware/authenticate.midldeware";

dotenv.config();

/// TODO: move to env
const BASE_URL = "/api/v1";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(pinoHttp({ logger }));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (
    (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") &&
    (!req.body || Object.keys(req.body).length === 0)
  ) {
    res.status(400).json({ message: "Request body is required.", data: null });
    return;
  }
  return next();
});

app.get("/healthz", (req: Request, res: Response) => {
  res.send("ok");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).send("Something went wrong");
  return;
});

app.post(`${BASE_URL}/telegram/webhook`, (req: Request, res: Response) => {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const header = req.get("X-Telegram-Bot-Api-Secret-Token");

  // if (!secret || header !== secret) {
  //   res.status(401).json({ message: "Unauthorized" });
  //   return;
  // }

  const msg = req.body?.message;
  const chatId = msg?.chat?.id;
  const text: string | undefined = msg?.text;

  if (!chatId || !text) {
    res.status(400).json({ message: "No chat id or text found" });
    return;
  }

  const normalized = text.replace(/@[\w_]+/i, "").trim();
  const [cmd, arg = ""] = normalized.split(/\s+/, 2);

  logger.info({ text }, "telegram webhook");

  if (cmd === "/start") {
    if (arg.startsWith("verify_")) {
      const code = arg.slice("verify_".length);
      try {
        sendOtpToTelegram(chatId, code).catch((err) =>
          req.log.error({ err }, "sendOtp failed")
        );
      } catch (err) {
        console.error("sendOtp failed", err);
      }
    }

    res.status(200).json({ message: "OK" });
    return;
  }

  // if (text?.startsWith("/start verify_")) {
  //   const code = text.split("verify_")[1];
  //   const chatId = req.body.message.chat.id;

  //   logger.info({ code, chatId }, "telegram webhook");

  //   if (code)
  //     sendOtpToTelegram(chatId, code).catch((err) =>
  //       req.log.error({ err }, "sendOtp failed")
  //     );
  // }
  res.status(200).json({ message: "OK", data: null });
  return;
});

// Routes
app.use(`${BASE_URL}/users`, authenticateToken, userRoutes);
app.use(`${BASE_URL}/rts`, rtRoutes);
app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/activities`, authenticateToken, activitiesRoutes);
app.use(`${BASE_URL}/fcm`, authenticateToken, firebaseRoutes);
app.use(`${BASE_URL}/telegram`, telegramRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
  return;
});

/// ERROR HANDLING
app.use((err: AppError, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({ err }, "Unhandled error");
  const status = err.statusCode ?? 500;
  const message = err.publicMessage ?? err.message ?? "Internal Server Error";
  res.status(status).json({ message });
  return;
});

async function start() {
  try {
    await redis.connect();
    app.listen(PORT, () => logger.info({ PORT }, "HTTP server listening"));
  } catch (err) {
    logger.fatal({ err }, "Failed to start");
    process.exit(1);
  }
}

["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig as NodeJS.Signals, async () => {
    logger.info({ sig }, "Shutting down");
    try {
      await redis.quit();
    } catch {}
    process.exit(0);
  });
});

start();
