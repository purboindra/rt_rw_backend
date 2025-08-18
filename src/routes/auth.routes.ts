import { sendOTP } from "../api/auth/otp/send";
import {
  createRefreshToken,
  revokeRefreshToken,
  signIn,
  verifyOtp,
} from "../controllers/auth.controller";
import { Router } from "express";
import { authenticateToken } from "../middleware/authenticate.midldeware";

const router = Router();

router.post("/refresh-token", createRefreshToken);
router.post("/revoke-token", revokeRefreshToken);
router.post("/sign-in", signIn);
router.post("/otp/send", sendOTP);
router.post("/otp/verify", verifyOtp);

export default router;
