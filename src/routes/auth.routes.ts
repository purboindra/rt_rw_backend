import { sendOTP } from "../api/auth/otp/send";
import {
  createRefreshToken,
  revokeRefreshToken,
  signIn,
} from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/refresh-token", createRefreshToken);
router.post("/revoke-token", revokeRefreshToken);
router.post("/sign-in", signIn);
router.post("/otp/send", sendOTP);

export default router;
