import { Router } from "express";
import { authenticateToken } from "../middleware/authenticate.midldeware";
import {
  createBanner,
  getAllBanners,
  patchBanner,
  softDeleteBanner,
} from "../controllers/banners.controller";

const router = Router();

router.get("/", getAllBanners);
router.post("/", createBanner);
router.patch("/:id", patchBanner);
router.delete("/:id", softDeleteBanner);

export default router;
