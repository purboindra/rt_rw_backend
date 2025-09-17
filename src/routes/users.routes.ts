import { Router } from "express";
import {
  createUser,
  deleteUser,
  findUserByPhone,
  getAllUsers,
} from "../controllers/users.controller";
import { userSchema } from "../schemas/user.schemas";
import { validate } from "../schemas/validate";

const router = Router();

router.get("/", getAllUsers);
router.post(
  "/",
  validate({
    body: userSchema,
  }),
  createUser
);
router.delete("/:phone", deleteUser);
router.get("/:phone", findUserByPhone);

export default router;
