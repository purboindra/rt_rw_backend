import { Router } from "express";
import { generateInvoice, getAdminInvoiceById, getAdminInvoices } from "../controllers/duesInvoice.controller";
import { generateInvoiceSchema } from "../schemas/duesInvoice.schema";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";
import { requireAnyRole } from "../utils/roleUtils";

const router = Router();

router.use(requireAnyRole(["ADMIN", "BENDAHARA"]));

router.get("/", getAdminInvoices);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getAdminInvoiceById,
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
