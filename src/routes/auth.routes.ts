import { createRefreshToken } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/refresh-token", createRefreshToken);

export default router;
