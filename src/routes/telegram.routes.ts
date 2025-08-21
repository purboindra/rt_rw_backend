import { Router } from "express";
import { verifyWebhook } from "../controllers/telegram.controller";

const router = Router();

router.post("/verify", verifyWebhook);

export default router;
