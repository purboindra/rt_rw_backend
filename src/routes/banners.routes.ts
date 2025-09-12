import { Router } from "express";
import { authenticateToken } from "../middleware/authenticate.midldeware";
import {
  createBanner,
  getAllBanners,
  patchBanner,
  softDeleteBanner,
} from "../controllers/banners.controller";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", getAllBanners);
router.post("/", upload.single("image"), createBanner);
router.patch("/:id", patchBanner);
router.delete("/:id", softDeleteBanner);

export default router;
