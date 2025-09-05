import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  getAllActivities,
  joinActivity,
  updateActivity,
} from "../controllers/activities.controller";
import { authenticateToken } from "../middleware/authenticate.midldeware";

const router = Router();

router.post("/", createActivity);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);
router.get("/", getAllActivities);
router.get("/:id", getActivityById);
router.post("/join", joinActivity);

export default router;
