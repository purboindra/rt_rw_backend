import express from "express";
import userRoutes from "./routes/user.route";
import rtRoutes from "./routes/rt.route";
import authRoutes from "./routes/auth.routes";
import { toNodeHandler } from "better-auth/node";

import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { sendOtpToTelegram } from "./services/telegeram.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `middleware index.ts: ${req.method} ${req.url} ${req.ip} ${res.statusCode}`
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
app.use("/users", userRoutes);
app.use("/rt", rtRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
