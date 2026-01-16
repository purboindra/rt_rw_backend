import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as duesInvoiceService from "../services/duesInvoice.service";
import { AppError, errorToAppError } from "../utils/errors";

export const getInvoicesAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const rtId = req.user?.rt_id;

    if (!rtId) {
      throw new AppError("RT id not found", 404);
    }

    const response = await duesInvoiceService.getInvoicesAsAdmin(rtId, query);

    res.status(200).json({
      message: "Success get all invoices",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all invoices");
    next(errorToAppError(error));
  }
};

export const getInvoicesAsResident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const householdId = req.user?.household_id;

    if (!householdId) {
      throw new AppError("Household id not found", 404);
    }

    const response = await duesInvoiceService.getInvoicesAsResident(householdId, query);

    res.status(200).json({
      message: "Success get all invoices",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all invoices");
    next(errorToAppError(error));
  }
};

export const getInvoiceByIdAsResident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const householdId = req.user?.household_id;

    if (!householdId) {
      throw new AppError("Household id not found", 404);
    }

    const response = await duesInvoiceService.getInvoiceByIdAsResident(id, householdId);

    res.status(200).json({
      message: "Success get invoice",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get invoice by id");
    next(errorToAppError(error));
  }
};

export const getInvoiceByIdAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const rtId = req.user?.rt_id;

    if (!rtId) {
      throw new AppError("RT id not found", 404);
    }

    const response = await duesInvoiceService.getInvoiceByIdAsAdmin(id, rtId);

    res.status(200).json({
      message: "Success get invoice",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get invoice by id");
    next(errorToAppError(error));
  }
};

export const generateInvoiceAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    // const rtId = req.user?.rt_id;

    await duesInvoiceService.generateInvoiceAsAdmin(body);
    res.status(201).json({
      message: "Success generate invoice",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Error generate invoice");
    next(errorToAppError(error));
  }
};

export const voidInvoiceAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const response = await duesInvoiceService.voidInvoiceAsAdmin(id);

    res.status(200).json({
      message: "Succes update invoice status",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error update status invoice to void");
    next(errorToAppError(error));
  }
};

export const updateInvoiceDueDateAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const body = req.body;

    const response = await duesInvoiceService.updateInvoiceDueDateAsAdmin(id, body);

    res.status(200).json({
      message: "Succes update invoice due date",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error update status invoice to void");
    next(errorToAppError(error));
  }
};
