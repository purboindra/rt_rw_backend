import { Router } from "express";
import {
  createDuesType,
  deleteDuesTypeById,
  getAllDuesTypes,
  getDuesTypeById,
  updateDuesType,
} from "../controllers/duesType.controller";
import { requireAnyRole } from "../middleware/role.middleware";
import { createDuesTypeSchema, updateDuesTypeSchema } from "../schemas/duesType.schema";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.get("/", getAllDuesTypes);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getDuesTypeById,
);

router.use(requireAnyRole(["ADMIN", "BENDAHARA"]));

router.post(
  "/",
  validate({
    body: createDuesTypeSchema,
  }),
  createDuesType,
);

router.patch(
  "/:id",
  validate({
    body: updateDuesTypeSchema,
    params: idParams,
  }),
  updateDuesType,
);

router.delete(
  "/:id",
  validate({
    params: idParams,
  }),
  deleteDuesTypeById,
);

export default router;
