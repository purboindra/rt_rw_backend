import { Router } from "express";
import { uploadActivityFile } from "../controllers/files.controller";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/activity", upload.single("file"), uploadActivityFile);

export default router;
