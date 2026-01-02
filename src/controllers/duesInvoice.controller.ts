import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as duesInvoiceService from "../services/duesInvoice.service";
import { AppError, errorToAppError } from "../utils/errors";

export const getAdminInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const rtId = req.user?.rt_id;

    if (!rtId) {
      throw new AppError("RT id not found", 404);
    }

    const response = await duesInvoiceService.getAdminInvoices(rtId, query);

    res.status(200).json({
      message: "Success get all invoices",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all invoices");
    next(errorToAppError(error));
  }
};

export const getMyInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const householdId = req.user?.household_id;

    if (!householdId) {
      throw new AppError("Household id not found", 404);
    }

    const response = await duesInvoiceService.getMyInvoices(householdId, query);

    res.status(200).json({
      message: "Success get all invoices",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all invoices");
    next(errorToAppError(error));
  }
};

export const getMyInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const householdId = req.user?.household_id;

    if (!householdId) {
      throw new AppError("Household id not found", 404);
    }

    const response = await duesInvoiceService.getMyInvoiceById(id, householdId);

    res.status(200).json({
      message: "Success get invoice",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get invoice by id");
    next(errorToAppError(error));
  }
};

export const getAdminInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const rtId = req.user?.rt_id;

    if (!rtId) {
      throw new AppError("RT id not found", 404);
    }

    const response = await duesInvoiceService.getAdminInvoiceById(id, rtId);

    res.status(200).json({
      message: "Success get invoice",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get invoice by id");
    next(errorToAppError(error));
  }
};

export const generateInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    const rtId = req.user?.rt_id;

    await duesInvoiceService.generateInvoice({
      ...body,
      rtId: rtId,
    });
    res.status(201).json({
      message: "Success generate invoice",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Error generate invoice");
    next(errorToAppError(error));
  }
};
