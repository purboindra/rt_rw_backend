import { Router } from "express";
import {
  generateInvoiceAsAdmin,
  getInvoiceByIdAsAdmin,
  getInvoicesAsAdmin,
  updateInvoiceDueDateAsAdmin,
  voidInvoiceAsAdmin,
} from "../controllers/duesInvoice.controller";
import { requireAnyRole } from "../middleware/role.middleware";
import { generateInvoiceSchema, updateDueDateInvoiceSchema } from "../schemas/duesInvoice.schema";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.use(requireAnyRole(["ADMIN", "BENDAHARA"]));

router.get("/", getInvoicesAsAdmin);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getInvoiceByIdAsAdmin,
);
router.post(
  "/generate",
  validate({
    body: generateInvoiceSchema,
  }),
  generateInvoiceAsAdmin,
);

router.patch(
  "/:id/due-date",
  validate({
    body: updateDueDateInvoiceSchema,
    params: idParams,
  }),
  updateInvoiceDueDateAsAdmin,
);

router.patch(
  "/:id/status",
  validate({
    params: idParams,
  }),
  voidInvoiceAsAdmin,
);

// router.delete(
//   "/:id",
//   validate({
//     params: idParams,
//   }),
//   deleteDuesTypeById,
// );

export default router;
