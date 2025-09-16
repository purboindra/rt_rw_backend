import { Router } from "express";
import {
  createUser,
  deleteUser,
  findUserByPhone,
  getAllUsers,
} from "../controllers/users.controller";

const router = Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:phone", deleteUser);
router.get("/:phone", findUserByPhone);

export default router;
