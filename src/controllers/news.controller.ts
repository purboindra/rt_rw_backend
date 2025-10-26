import { NextFunction, Request, Response, response } from "express";
import { logger } from "../logger";
import * as newsService from "../services/news.service";
import { AppError, errorToAppError } from "../utils/errors";

export const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const news = await newsService.getAllnews();

    res.status(200).json({
      message: "Success get all news",
      data: news,
    });
  } catch (error) {
    logger.error({ error }, "Error get all news controller");
    next(errorToAppError(error));
  }
};

export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    const news = await newsService.findNewsById(id);

    res.status(200).json({
      message: "Success get news by id",
      data: news,
    });
  } catch (error) {
    logger.error({ error }, "Error get news by id controller");
    next(errorToAppError(error));
  }
};

export const createNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, body } = req.body;

    const userId = req.user?.user_id;
    const rtId = req.user?.rt_id;

    if (!userId) {
      throw new AppError("User unuahotrized", 401);
    }

    if (!rtId) {
      throw new AppError("User unuahotrized", 401);
    }

    await newsService.createNews({
      authorId: userId,
      rtId: rtId,
      body,
      title,
      description,
    });

    /// TODO SEND NOTIFICATION TO ALL USER IN RT

    res.status(201).json({
      message: "Success create news",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Error create news controller");
    next(errorToAppError(error));
  }
};

export const deleteNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    await newsService.deleteNewsById(id);

    res.status(200).json({
      message: "Success delete news",
      data: null,
    });
  } catch (error) {
    logger.error({ error }, "Error delete news by id controller");
    next(errorToAppError(error));
  }
};

export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const news = await newsService.updateNews(id, body);

    res.status(200).json({
      message: "Success update news",
      data: response,
    });
  } catch (error) {
    next(errorToAppError(error));
  }
};
