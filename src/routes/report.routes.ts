import { Router } from "express";
import multer from "multer";
import { createReport, deleteReport, getAllReports, getReportById } from "../controllers/report.controller";
import { idParams } from "../schemas/general.schema";
import { validate } from "../schemas/validate";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("image"), createReport);
router.get("/", getAllReports);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getReportById,
);
router.delete(
  "/:id",
  validate({
    params: idParams,
  }),
  deleteReport,
);

export default router;
