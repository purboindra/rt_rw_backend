import { Router } from "express";
import { generateInvoice, getMyInvoiceById, getMyInvoices } from "../controllers/duesInvoice.controller";
import { generateInvoiceSchema } from "../schemas/duesInvoice.schema";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.get("/", getMyInvoices);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getMyInvoiceById,
);

router.post(
  "/generate",
  validate({
    body: generateInvoiceSchema,
  }),
  generateInvoice,
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
