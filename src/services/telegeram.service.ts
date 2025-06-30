const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
import prisma from "../../prisma/client";

const getUpdates = async () => {
  const response = await fetch(
    `https://api.telegram.org/bot${telegramBotToken}/getUpdates`
  );
  const data = await response.json();
  return data.result;
};

const processUpdates = async () => {
  const updates = await getUpdates();

  updates.forEach(async (update: any) => {
    const chatId = update.message.chat.id;
    const otpCode = generateOtp();

    console.log("chatId", chatId);
    console.log("otpCode", otpCode);
  });
};

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

export const sendOtpToTelegram = async (chatId: string, code: string) => {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `🔐 Your OTP code is: ${code}`,
    }),
  });

  await prisma.otp.create({
    data: {
      code: code,
      expiration: new Date(Date.now() + 5 * 60 * 1000),
      phoneNumber: "0",
    },
  });
};
