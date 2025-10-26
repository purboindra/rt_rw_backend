import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as fileService from "../services/files.service";
import * as reportService from "../services/report.service";
import { AppError, errorToAppError } from "../utils/errors";

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.user_id;
    const rtId = req.user?.rt_id;

    const { description, title } = req.body;

    if (!userId) {
      throw new Error("User unauthorized");
    }

    if (!rtId) {
      throw new Error("User unauthorized");
    }

    const file = req.file;

    let imageUrl: string | undefined;

    if (file != null && file != undefined) {
      const uploaded = await fileService.uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
        folder: "/reports",
      });

      imageUrl = uploaded.url;
    }

    await reportService.createReport({
      description,
      title,
      imageUrl: imageUrl || "",
      rtId,
      userId,
      status: "OPEN",
    });

    res.status(201).json({
      message: "Success create report",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Error create report controller");
    next(errorToAppError(error));
  }
};

export const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await reportService.getAllReports(req.query);

    res.status(200).json({
      message: "Success get all reports",
      data: reports,
    });
  } catch (error) {
    logger.error({ error }, "Error get all reports controller");
    next(errorToAppError(error));
  }
};

export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await reportService.findReportById(req.params.id);

    res.status(200).json({
      message: "Success get report by id",
      data: report,
    });
  } catch (error) {
    logger.error({ error }, "Error get report by id controller");
    next(errorToAppError(error));
  }
};

export const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const userId = req?.user?.user_id;

    if (!userId) {
      throw new AppError("User unauthorized", 401);
    }

    await reportService.deleteReport(id, userId);

    res.status(200).json({
      message: "Success delete report",
      data: null,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};
