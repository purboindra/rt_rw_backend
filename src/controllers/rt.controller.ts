import { Request, Response } from "express";
import * as rtService from "../services/rt.service";

export const createRt = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      res.status(400).json({ message: "name and address are required" });
      return;
    }

    const rt = await rtService.createRt({ name, address });

    res.status(201).json({
      message: "Success create rt",
      data: rt,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
