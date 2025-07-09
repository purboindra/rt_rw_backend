import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users.routes";
import rtRoutes from "./routes/rt.routes";
import authRoutes from "./routes/auth.routes";
import activitiesRoutes from "./routes/activities.routes";
import { toNodeHandler } from "better-auth/node";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { sendOtpToTelegram } from "./services/telegeram.service";
import redis from "./lib/redis";

dotenv.config();

/// TODO: move to env
const BASE_URL = "/api/v1";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.all(`/${BASE_URL}/auth/*splat`, toNodeHandler(auth));

app.use((req, res, next) => {
  console.log(
    `middleware index.ts: ${req.method} ${req.url} ${res.statusCode} ${req.params}`
  );
  next();
});

app.post("/webhook", async (req, res) => {
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

redis.on("error", (err) => console.log("Redis Client Error", err));
redis.on("connect", () => console.log("Redis Client Connected"));

app.listen(PORT, async () => {
  console.log(`Server ready at http://localhost:${PORT}`);
  await redis.connect();
});
