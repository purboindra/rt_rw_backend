import express from "express";
import userRoutes from "./routes/user.route";
import rtRoutes from "./routes/rt.route";
import authRoutes from "./routes/auth.routes";
import { toNodeHandler } from "better-auth/node";

import dotenv from "dotenv";
import { auth } from "./lib/auth";
import { generateOtp, sendOtpToTelegram } from "./services/telegeram.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.post("/webhook", async (req, res) => {
  const update = req.body;

  if (update.message && update.message.text === "/start") {
    const chatId = update.message.chat.id;

    await sendMessage(
      chatId,
      "Please send your WhatsApp number to verify your identity."
    );
  }

  if (update.message && update.message.contact) {
    const chatId = update.message.chat.id;
    const phoneNumber = update.message.contact.phone_number;

    /// TODO
    // await saveUserContact(chatId, phoneNumber);

    const otpCode = generateOtp();
    await sendOtpToTelegram(chatId, otpCode);

    // await saveOtpToDatabase(phoneNumber, otpCode);
  }

  res.status(200).send("OK");
});

// Fungsi untuk kirim pesan ke Telegram
const sendMessage = async (chatId: number, text: string) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
    }),
  });
};

// Routes
app.use("/users", userRoutes);
app.use("/rt", rtRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
