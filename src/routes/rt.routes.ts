import { Router } from "express";
import { createRt, deleteRt, getAllRt } from "../controllers/rt.controller";
import { idParams } from "../schemas/general.schema";
import { createRTSchema } from "../schemas/rt.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.post(
  "/",
  validate({
    body: createRTSchema,
  }),
  createRt,
);
router.get("/", getAllRt);
router.delete(
  "/:id",
  validate({
    params: idParams,
  }),
  deleteRt,
);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getAllRt,
);

export default router;
