import { Router } from "express";
import {
  createDuesType,
  deleteDuesTypeById,
  getAllDuesTypes,
  getDuesTypeById,
  updateDuesType,
} from "../controllers/dues_type.controller";
import { createDuesTypeSchema, updateDuesTypeSchema } from "../schemas/duesType.schema";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";
import { requireAnyRole } from "../utils/roleUtils";

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
