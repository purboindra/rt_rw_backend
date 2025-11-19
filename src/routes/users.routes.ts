import { Router } from "express";
import {
  createUser,
  deleteUser,
  findUserByPhone,
  getAllUsers,
  requestEmailVerification,
} from "../controllers/users.controller";
import { userSchema, verifyEmaEmailSchema } from "../schemas/user.schemas";
import { validate } from "../schemas/validate";

const router = Router();

router.get("/", getAllUsers);
router.post(
  "/",
  validate({
    body: userSchema,
  }),
  createUser,
);
router.delete("/:phone", deleteUser);
router.get("/:phone", findUserByPhone);
router.post(
  "/verify-email",
  validate({
    body: verifyEmaEmailSchema,
  }),
  requestEmailVerification,
);

export default router;
