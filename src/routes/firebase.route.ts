import { Router } from "express";
import { notify } from "../controllers/firebase.controller";

const router = Router();

router.post("/notify", notify);

export default router;
