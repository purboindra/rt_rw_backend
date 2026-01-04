import { Router } from "express";
import { getInvoiceByIdAsResident, getInvoicesAsResident } from "../controllers/duesInvoice.controller";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.get("/", getInvoicesAsResident);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getInvoiceByIdAsResident,
);

// router.patch(
//   "/:id",
//   validate({
//     body: updateDuesTypeSchema,
//     params: idParams,
//   }),
//   updateDuesType,
// );

// router.delete(
//   "/:id",
//   validate({
//     params: idParams,
//   }),
//   deleteDuesTypeById,
// );

export default router;
