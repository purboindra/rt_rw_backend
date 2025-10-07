import { Router } from "express";
import {
  createActivity,
  deleteActivity,
  getActivityById,
  getAllActivities,
  getUsersActivity,
  joinActivity,
  updateActivity,
} from "../controllers/activities.controller";
import { createActivitySchema } from "../schemas/activity.schemas";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.post(
  "/",
  validate({
    body: createActivitySchema,
  }),
  createActivity,
);
router.put(
  "/:id",
  validate({
    params: idParams,
  }),
  updateActivity,
);
router.delete(
  "/:id",
  validate({
    params: idParams,
  }),
  deleteActivity,
);
router.get("/", getAllActivities);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getActivityById,
);
router.get(
  "/:id/users",
  validate({
    params: idParams,
  }),
  getUsersActivity,
);
router.post("/join", joinActivity);

export default router;
