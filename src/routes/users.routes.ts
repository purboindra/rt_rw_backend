import { Router } from "express";
import {
  createUser,
  deleteUser,
  findUserByPhone,
  getAllUsers,
  requestEmailVerification,
  updateUser,
  verifyEmail,
} from "../controllers/users.controller";
import {
  requestEmailVerificationSchema,
  updateUserSchema,
  userSchema,
  verifyEmailSchema,
} from "../schemas/user.schemas";
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
router.patch(
  "/:id",
  validate({
    body: updateUserSchema,
  }),
  updateUser,
);
router.delete("/:phone", deleteUser);
router.get("/:phone", findUserByPhone);
router.post(
  "/request-email-verification",
  validate({
    body: requestEmailVerificationSchema,
  }),
  requestEmailVerification,
);
router.post(
  "/verify-email",
  validate({
    body: verifyEmailSchema,
  }),
  verifyEmail,
);

export default router;
