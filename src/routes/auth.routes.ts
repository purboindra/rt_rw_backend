import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createRefreshToken, revokeRefreshToken, signIn, verifyOtp } from "../controllers/auth.controller";

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    error: "Too many authentication attempts",
    retryAfter: "10 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const router = Router();

router.post("/refresh-token", createRefreshToken);
router.post("/revoke-token", revokeRefreshToken);
router.post("/sign-in", authLimiter, signIn);
router.post("/otp/verify", verifyOtp);

export default router;
