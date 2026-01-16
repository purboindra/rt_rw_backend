import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as duesPaymentService from "../services/duesPayment.service";
import { AppError, errorToAppError } from "../utils/errors";

export const createPaymentAsResident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const viewerHouseholdId = req?.user?.household_id;

    const viewerUserId = req?.user?.user_id;

    if (!viewerHouseholdId) {
      throw new AppError("Household id tidak ditemukan", 404);
    }

    if (!viewerUserId) {
      throw new AppError("User id tidak ditemukan", 404);
    }

    const response = await duesPaymentService.createPaymentAsResident(viewerHouseholdId, viewerUserId, body);

    res.status(201).json({
      message: "Success create payment",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error create payment as resident");
    next(errorToAppError(error));
  }
};

export const getAllPaymentsAsResident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const viewerHouseholdId = req?.user?.household_id;
    const query = req.query;

    if (!viewerHouseholdId) {
      throw new AppError("Household id tidak ditemukan", 404);
    }

    const response = await duesPaymentService.getAllPaymentsAsResident(viewerHouseholdId, query);

    res.status(200).json({
      message: "Success get all payments",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all payment as resident");
    next(errorToAppError(error));
  }
};

export const getPaymentsByIdAsResident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const viewerHouseholdId = req?.user?.household_id;
    const id = req.params.id;

    if (!viewerHouseholdId) {
      throw new AppError("Household id tidak ditemukan", 404);
    }

    const response = await duesPaymentService.getPaymentsByIdAsResident(viewerHouseholdId, id);

    res.status(200).json({
      message: "Success get payment by id",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get payment by id as resident");
    next(errorToAppError(error));
  }
};

export const getAllPaymentsAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params;

    const response = await duesPaymentService.getAllPaymentsAsAdmin(params);

    res.status(200).json({
      message: "Success get all payments",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all payment as admin");
    next(errorToAppError(error));
  }
};

export const getPaymentsByIdAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const response = await duesPaymentService.getPaymentsByIdAsAdmin(id);

    res.status(200).json({
      message: "Success get payment by id",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get payment by id as admin");
    next(errorToAppError(error));
  }
};

export const verifyPaymentAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const response = await duesPaymentService.verifyPaymentAsAdmin(id);

    res.status(200).json({
      message: "Success verify payment",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error verify payment as admin");
    next(errorToAppError(error));
  }
};

export const rejectPaymentAsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const rejectReason = req.body;

    const response = await duesPaymentService.rejectPaymentAsAdmin(id, rejectReason);

    res.status(200).json({
      message: "Success reject payment",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error reject payment as admin");
    next(errorToAppError(error));
  }
};
