import { Router } from "express";
import {
  getAllUsers,
  createUser,
  deleteUser,
  findUserByPhone,
} from "../controllers/user.controller";
import { authenticateToken } from "../middleware/authenticate.midldeware";

const router = Router();

router.get("/", getAllUsers);
router.post("/", authenticateToken, createUser);
router.delete("/:phone", authenticateToken, deleteUser);
router.get("/:phone", findUserByPhone);

export default router;
