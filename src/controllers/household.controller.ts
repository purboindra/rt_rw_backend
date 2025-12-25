import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import * as householdsService from "../services/households.service";
import { errorToAppError } from "../utils/errors";

export const createHousehold = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    const response = await householdsService.createHouseholds({
      ...body,
    });

    res.status(201).json({
      message: "Success create household",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error create household controller");
    next(errorToAppError(error));
  }
};

export const attachUsersHousehold = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const householdId = req.params.id;
    const body = req.body;

    if (!householdId) {
      res.status(400).json({ message: "Household id is required" });
    }

    const response = await householdsService.attachUsersHousehold(householdId, body.userIds);

    res.status(200).json({
      message: "Success attach users to household",
      data: response,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const getAllHouseholds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query;
    const response = await householdsService.getAllHouseHolds(query);

    res.status(200).json({
      message: "Success fetch households",
      data: response,
    });
  } catch (error) {
    logger.error({ error }, "Error get all households controller");
    next(errorToAppError(error));
  }
};

export const getHouseholdsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const activities = await householdsService.findHouseholdById(id);

    res.status(200).json({
      message: "Success get household detail",
      data: activities,
    });
    return;
  } catch (error) {
    next(errorToAppError(error));
  }
};

export const deleteHoursehold = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const userId = req.user?.user_id;

    if (!userId) {
      res.status(400).json({ message: "User id is required" });
    }

    if (!id) {
      res.status(400).json({ message: "Household id is required" });
    }

    await householdsService.deleteHouseholdById(userId!!, id);
    res.status(200).json({
      message: "Success delete household",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Failed to delete household");
    next(errorToAppError(error));
  }
};

export const updateHousehold = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!id) {
      res.status(400).json({ message: "Household id is required" });
    }

    const response = await householdsService.updateHousehold(id, body);

    res.status(200).json({
      message: "Success update household",
      data: response,
    });
    return;
  } catch (error) {
    logger.error({ error }, "Failed to update household");
    next(errorToAppError(error));
  }
};
