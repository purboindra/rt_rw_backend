import { Router } from "express";
import { createRt, getAllRt } from "../controllers/rt.controller";
import { idParams } from "../schemas/general.schema";
import { createRTSchema } from "../schemas/rt.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.post(
  "/",
  validate({
    body: createRTSchema,
  }),
  createRt
);
router.get("/", getAllRt);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getAllRt
);

export default router;
