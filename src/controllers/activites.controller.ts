import { Request, Response } from "express";
import * as activityService from "../services/activity.service";
import { AppError } from "../utils/errors";

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await activityService.getAllActivities();
    res.status(200).json({
      message: "success",
      data: activities,
    });
    return;
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { description, title, type } = req.body;

    const accessToken = req.user?.access_token;

    if (!accessToken) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    const response = await activityService.createActivity({
      accessToken: accessToken,
      date: new Date().toISOString(),
      title: title,
      type: type,
      description: description,
    });

    res.status(201).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const { description, title, type } = req.body;

    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "Activity id is required" });
      return;
    }

    const accessToken = req.user?.access_token;

    if (!accessToken) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    const response = await activityService.updateActivity(id, {
      accessToken: accessToken,
      date: new Date().toISOString(),
      title: title,
      type: type,
      description: description,
    });

    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: "Activity id is required" });
      return;
    }

    const accessToken = req.user?.access_token;

    if (!accessToken) {
      res.status(401).json({ message: "Access token is missing or invalid" });
      return;
    }

    const response = await activityService.deleteActivity(id);

    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";
    res.status(statusCode).json({ message, data: null });
    return;
  }
};
