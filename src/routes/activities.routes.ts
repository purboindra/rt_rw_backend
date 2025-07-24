import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  getAllActivities,
  joinActivity,
  updateActivity,
} from "../controllers/activites.controller";
import { authenticateToken } from "../middleware/authenticate.midldeware";

const router = Router();

router.post("/", authenticateToken, createActivity);
router.put("/:id", authenticateToken, updateActivity);
router.delete("/:id", authenticateToken, deleteActivity);
router.get("/", getAllActivities);
router.get("/:id", getActivityById);
router.post("/:id/join", authenticateToken, joinActivity);

export default router;
