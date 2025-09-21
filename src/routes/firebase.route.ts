import { Router } from "express";
import { notify, upsertFCMToken } from "../controllers/firebase.controller";
import { authenticateToken } from "../middleware/authenticated.midldeware";

const router = Router();

router.post("/notify", authenticateToken, notify);
router.post("/upsert-fcm-token", authenticateToken, upsertFCMToken);

export default router;
