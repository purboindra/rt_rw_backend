import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users.routes";
import rtRoutes from "./routes/rt.routes";
import authRoutes from "./routes/auth.routes";
import activitiesRoutes from "./routes/activities.routes";
import { toNodeHandler } from "better-auth/node";

import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { sendOtpToTelegram } from "./services/telegeram.service";
import redis from "./lib/redis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.all("/api/v1/auth/*splat", toNodeHandler(auth));

app.use((req, res, next) => {
  console.log(
    `middleware index.ts: ${req.method} ${req.url} ${res.statusCode}`
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

const baseUrl = "/api/v1";

// Routes
app.use(`${baseUrl}/v1/user`, userRoutes);
app.use(`${baseUrl}/v1/r`, rtRoutes);
app.use(`${baseUrl}/v1/aut`, authRoutes);
app.use(`${baseUrl}/v1/activitie`, activitiesRoutes);

redis.on("error", (err) => console.log("Redis Client Error", err));
redis.on("connect", () => console.log("Redis Client Connected"));

app.listen(PORT, async () => {
  console.log(`Server ready at http://localhost:${PORT}`);
  await redis.connect();
});
