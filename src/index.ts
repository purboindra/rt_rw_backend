import express, { NextFunction, Request, Response } from "express";
import pinoHttp from "pino-http";
import activitiesRoutes from "./routes/activities.routes";
import authRoutes from "./routes/auth.routes";
import bannerRoutes from "./routes/banners.routes";
import fileRoutes from "./routes/files.routes";
import firebaseRoutes from "./routes/firebase.route";
import rtRoutes from "./routes/rt.routes";
import telegramRoutes from "./routes/telegram.routes";
import userRoutes from "./routes/users.routes";

import dotenv from "dotenv";
import redis from "./lib/redis";
import { sendOtpToTelegram } from "./services/telegeram.service";

import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import { logger } from "./logger";
import { authenticateToken } from "./middleware/authenticate.midldeware";
import { errorHandler } from "./middleware/error.middleware";
import { zodErrorHandler } from "./middleware/validation.middleware";
import { getTelegramKeyForRedis } from "./utils/helper";

dotenv.config();

/// TODO: move to env
const BASE_URL = "/api/v1";

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// DISABLE CACHE
app.disable("etag");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        ip: req.socket?.remoteAddress,
      }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    customLogLevel: (req, res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} -> ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
      `${req.method} ${req.url} -> ${res.statusCode} ${err?.message ?? ""}`,
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) return next();

  // SKIP IS MULPART FORM DATA
  if (req.is("multipart/form-data")) return next();

  if (
    req.is("application/json") ||
    req.is("application/*+json") ||
    req.is("application/x-www-form-urlencoded")
  ) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res
        .status(400)
        .json({ message: "Request body is required.", data: null });
      return;
    }
  }
  next();
});

app.get("/healthz", (req: Request, res: Response) => {
  res.send("ok");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).send("Something went wrong");
  return;
});

app.post(
  `${BASE_URL}/telegram/webhook`,
  async (req: Request, res: Response) => {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const header = req.get("X-Telegram-Bot-Api-Secret-Token");

    if (secret && header !== secret) {
      res
        .status(401)
        .json({ message: "Missing or invalid telegram bot secret" });
      return;
    }

    const msg = req.body?.message;
    const chatId = msg?.chat?.id;
    const text: string | undefined = msg?.text;

    logger.info({ chatId, text, msg }, "telegram webhook");

    if (!chatId || !text) {
      res.status(400).json({ message: "No chat id or text found" });
      return;
    }

    const normalized = text.replace(/@[\w_]+/i, "").trim();
    const [cmd, arg = ""] = normalized.split(/\s+/, 2);

    logger.info({ text, cmd, arg }, "telegram webhook normalized");

    if (cmd === "/start") {
      if (arg.startsWith("verify_")) {
        const key = getTelegramKeyForRedis(arg);
        const payload = await redis.get(key);

        if (!payload) {
          res.status(200).json({
            code: "EXPIRED_OR_INVALID",
            message:
              "Token verifikasi tidak valid atau sudah kedaluwarsa.\nSilakan kembali ke aplikasi untuk meminta tautan baru.",
          });
          return;
        }

        await redis.del(key);

        const { phone, otp } = JSON.parse(payload) as {
          phone: string;
          otp: string;
        };

        // TODO: save chatId ke user for send notif

        try {
          sendOtpToTelegram(chatId, otp).catch((err) => {
            console.error("sendOtp failed", err);
            res.status(500).json({ message: "Failed to send OTP" });
            return;
          });
        } catch (err) {
          console.error("sendOtp failed", err);
          res.status(500).json({ message: "Failed to send OTP" });
          return;
        }
      }

      res.status(400).json({ message: "Invalid command or payload" });
      return;
    }

    res.status(200).json({ message: "OK", data: null });
    return;
  }
);

// Routes
app.use(`${BASE_URL}/users`, authenticateToken, userRoutes);
app.use(`${BASE_URL}/rts`, authenticateToken, rtRoutes);
app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/activities`, authenticateToken, activitiesRoutes);
app.use(`${BASE_URL}/fcm`, authenticateToken, firebaseRoutes);
app.use(`${BASE_URL}/telegram`, telegramRoutes);
app.use(`${BASE_URL}/upload`, authenticateToken, fileRoutes);
app.use(`${BASE_URL}/banners`, authenticateToken, bannerRoutes);

// REGISTER ERROR MIDDLEWARE
app.use(errorHandler);
app.use(zodErrorHandler);

app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
  return;
});

/// ERROR HANDLING
// app.use((err: AppError, req: Request, res: Response, _next: NextFunction) => {
//   req.log.error({ err }, "Unhandled error");
//   const status = err.statusCode ?? 500;
//   const message = err.publicMessage ?? err.message ?? "Internal Server Error";
//   res.status(status).json({ message });
//   return;
// });

async function start() {
  try {
    await redis.connect();
    app.listen(PORT, () => logger.info({ PORT }, "HTTP server listening"));
  } catch (err) {
    logger.fatal({ err }, "Failed to start");
    process.exit(1);
  }
}

process.on("uncaughtException", (err: any) => {
  const message = err.message;
  logger.error({ message }, "Uncaught exception catched");
  process.exit(1);
});

process.on("unhandledRejection", (err: any) => {
  const message = err.message;
  logger.error({ message }, "Unhandle rejection catched");
  process.exit(1);
});

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
