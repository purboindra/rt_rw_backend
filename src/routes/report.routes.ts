import { Router } from "express";
import multer from "multer";
import { createReport, getAllReports } from "../controllers/report.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("image"), createReport);
router.get("/", getAllReports);

export default router;
