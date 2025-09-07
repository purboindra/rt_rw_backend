import { Router } from "express";
import { uploadFileController } from "../controllers/files.controller";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("file"), uploadFileController);

export default router;
