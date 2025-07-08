import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  updateActivity,
} from "../controllers/activites.controller";
import { authenticateToken } from "../controllers/auth.controller";

const router = Router();

router.post("/", authenticateToken, createActivity);
router.put("/:id", authenticateToken, updateActivity);
router.delete("/:id", authenticateToken, deleteActivity);
router.get("/", getAllActivities);

export default router;
