import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createRefreshToken,
  revokeRefreshToken,
  signIn,
  verifyOtp,
} from "../controllers/auth.controller";

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    status: "error",
    message: "Too many failed login attempts. Try again later.",
  },
});

const router = Router();

router.post("/refresh-token", createRefreshToken);
router.post("/revoke-token", revokeRefreshToken);
router.post("/sign-in", loginLimiter, signIn);
router.post("/otp/verify", verifyOtp);

export default router;
