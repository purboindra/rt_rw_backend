import { Router } from "express";
import { createRt, getAllRt } from "../controllers/rt.controller";
import { authenticateToken } from "../middleware/authenticate.midldeware";

const router = Router();

router.post("/", authenticateToken, createRt);
router.get("/", authenticateToken, getAllRt);

export default router;
