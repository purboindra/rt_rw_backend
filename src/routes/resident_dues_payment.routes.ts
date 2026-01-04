import { Router } from "express";
import {
  createPaymentAsResident,
  getAllPaymentsAsResident,
  getPaymentsByIdAsResident,
} from "../controllers/duesPayment.controller";
import { createPaymentSchema } from "../schemas/duesPayment.schema";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

var router = Router();

router.post(
  "/create",
  validate({
    body: createPaymentSchema,
  }),
  createPaymentAsResident,
);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getPaymentsByIdAsResident,
);
router.get("/", getAllPaymentsAsResident);

export default router;
