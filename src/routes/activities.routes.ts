import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  getAllActivities,
  joinActivity,
  updateActivity,
} from "../controllers/activities.controller";
import { createActivitySchema } from "../schemas/activity.schemas";
import { validate } from "../schemas/validate";

const router = Router();

router.post(
  "/",
  validate({
    body: createActivitySchema,
  }),
  createActivity
);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);
router.get("/", getAllActivities);
router.get("/:id", getActivityById);
router.post("/join", joinActivity);

export default router;
