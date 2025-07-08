import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  updateActivity,
} from "../controllers/activites.controller";
import { authenticateToken } from "../middleware/authenticate.midldeware";

const router = Router();

router.post("/", authenticateToken, createActivity);
router.put("/:id", authenticateToken, updateActivity);
router.delete("/:id", authenticateToken, deleteActivity);
router.get("/", getAllActivities);

export default router;
