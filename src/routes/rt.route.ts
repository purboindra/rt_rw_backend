import { Router } from "express";
import { createRt, getAllRt } from "../controllers/rt.controller";

const router = Router();

router.post("/", createRt);
router.get("/", getAllRt);

export default router;
