import { Router } from "express";
import {
  attachUsersHousehold,
  createHousehold,
  deleteHoursehold,
  getAllHouseholds,
  getHouseholdsById,
  updateHousehold,
} from "../controllers/household.controller";
import { idParams } from "../schemas/general.schema";
import {
  attachMembersHouseholdSchema,
  createHouseholdsSchema,
  getHouseholdsQuery,
  updateHouseholdsSchema,
} from "../schemas/households.schema";
import { validate } from "../schemas/validate";
import { requireAnyRole } from "../utils/roleUtils";

var router = Router();

router.get("/", getAllHouseholds);
router.get(
  "/:id",
  validate({
    params: getHouseholdsQuery,
  }),
  getHouseholdsById,
);

router.use(requireAnyRole(["ADMIN"]));

router.post(
  "/",
  validate({
    body: createHouseholdsSchema,
  }),
  createHousehold,
);
router.post(
  "/:id/members",
  validate({
    body: attachMembersHouseholdSchema,
  }),
  attachUsersHousehold,
);

router.delete(
  "/:id",
  validate({
    params: idParams,
  }),
  deleteHoursehold,
);
router.patch(
  "/:id",
  validate({
    params: idParams,
    body: updateHouseholdsSchema,
  }),
  updateHousehold,
);

export default router;
