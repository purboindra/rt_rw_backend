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

import { debug } from "debug";

dotenv.config();

/// TODO: move to env
const BASE_URL = "/api/v1";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.use(express.json());

/// Middleware error handling if request body is empty
app.use((req: Request, res: Response, next: NextFunction) => {
  const info = {
    url: req.url,
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  };

  debug(`Request middleware: ${info}`);

  if (req.method === "POST" || req.method === "PUT") {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        message: "Request body is required.",
        data: null,
      });
      next("route");
    }
  }

  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).send("Something went wrong");
  return;
});

app.post("/webhook", async (req: Request, res: Response) => {
  const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

  const header = req.get("X-Telegram-Bot-Api-Secret-Token");
  if (!TELEGRAM_WEBHOOK_SECRET || header !== TELEGRAM_WEBHOOK_SECRET) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const update = req.body;

  if (update.message && update.message.text.includes("/start verify_")) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    const otpCode = text.split("verify_")[1];

    if (otpCode) {
      await sendOtpToTelegram(chatId, otpCode);
    }
  }
  res.status(200).send("OK");
});

// Routes
app.use(`${BASE_URL}/users`, userRoutes);
app.use(`${BASE_URL}/rts`, rtRoutes);
app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/activities`, activitiesRoutes);
app.use(`${BASE_URL}/fcm`, firebaseRoutes);
app.use(`${BASE_URL}/telegram`, telegramRoutes);

redis.on("error", (err: any) => debug(`Redis Client Error: ${err}`));

app.listen(PORT, async () => {
  await redis.connect();
});
