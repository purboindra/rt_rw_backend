import { Router } from "express";
import { createRt } from "../controllers/rt.controller";

const router = Router();

router.post("/", createRt);

export default router;
