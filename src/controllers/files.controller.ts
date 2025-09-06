import { Request, Response } from "express";
import { uploadFile } from "../services/files.service";

export const uploadActivityFile = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  try {
    const result = await uploadFile({
      buffer: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/activities",
      tags: ["activities-project"],
    });

    res.status(201).json({ data: result });
    return;
  } catch (err: any) {
    req.log?.error({ err }, "imagekit upload failed");
    res.status(500).json({ message: "Upload failed" });
    return;
  }
};
