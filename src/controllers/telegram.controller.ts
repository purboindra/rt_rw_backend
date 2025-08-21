import { Router, Request, Response } from "express";

const router = Router();

const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;

export const verifyWebhook = async (req: Request, res: Response) => {
  const header = req.get("X-Telegram-Bot-Api-Secret-Token");

  if (!SECRET || header !== SECRET) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const update = req.body;

  res.status(200).json({ message: "OK", data: null });
};

export default router;
