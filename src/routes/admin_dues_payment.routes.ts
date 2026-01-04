import { Router } from "express";
import {
  getAllPaymentsAsAdmin,
  getPaymentsByIdAsAdmin,
  rejectPaymentAsAdmin,
  verifyPaymentAsAdmin,
} from "../controllers/duesPayment.controller";
import { requireBody } from "../middleware/body.middleware";
import { requireAnyRole } from "../middleware/role.middleware";
import { rejectPaymentSchema } from "../schemas/duesPayment.schema";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

var router = Router();

router.use(requireAnyRole(["ADMIN", "BENDAHARA"]));

router.get("/", getAllPaymentsAsAdmin);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getPaymentsByIdAsAdmin,
);
router.post(
  "/:id/verify",
  validate({
    params: idParams,
  }),
  verifyPaymentAsAdmin,
);
router.post(
  "/:id/reject",
  requireBody(),
  validate({
    params: idParams,
    body: rejectPaymentSchema,
  }),
  rejectPaymentAsAdmin,
);

export default router;
