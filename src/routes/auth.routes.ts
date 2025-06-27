import { createRefreshToken } from "../controllers/auth.controller";
import { Router } from "express";
import { revokeRefreshToken } from "../services/auth.service";

const router = Router();

router.post("/refresh-token", createRefreshToken);
router.post("/revoke-token", revokeRefreshToken);

export default router;
