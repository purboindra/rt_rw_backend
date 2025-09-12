import { Response, Request, NextFunction } from "express";
import { logger } from "../logger";
import { AppError, errorToAppError } from "../utils/errors";
import * as bannerService from "../services/banners.service";
import * as fileService from "../services/files.service";
import {
  bannerCreateSchema,
  bannerFieldsSchema,
  patchBannerSchema,
} from "../schemas/banner.schema";
import prisma from "../db";
import { imagekit } from "../lib/imageKit";

export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const query = req.query;

    const result = await bannerService.getAllBanners(query);

    res.status(200).json({
      message: "Success get all banners",
      data: result,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get all banners controller");
    const appError = errorToAppError(error);
    res.status(appError.statusCode).json({
      message: appError.message,
      data: null,
    });
  }
};

export const getBannerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await bannerService.getBannerById(id);

    res.status(200).json({
      message: "Success get banner by id",
      data: result,
    });
  } catch (error) {
    logger.error({ error }, "Failed to get banner by id controller");
    const appError = errorToAppError(error);
    res.status(appError.statusCode).json({
      message: appError.message,
      data: null,
    });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    let uploadedFileId: string | undefined;

    const file = req.file;

    if (!file)
      throw new AppError("Image file is required (field name: 'image')", 400);

    const fields = bannerFieldsSchema.parse(req.body);

    if (!fields.linkType) {
      throw new AppError("Link url is required", 400);
    }

    const uploaded = await fileService.uploadFile({
      buffer: file.buffer,
      fileName: file.originalname,
      folder: "/banners",
    });

    uploadedFileId = uploaded.fileId;

    const payload = bannerCreateSchema.parse({
      ...fields,
      imagePath: uploaded.filePath,
      imageKitFileId: uploadedFileId,
      imageUrl: uploaded.thumbnailUrl,
    });

    const row = await prisma.banner.create({
      data: {
        placement: payload.placement,
        title: payload.title,
        subTitle: payload.subTitle,
        allText: payload.allText,
        imageUrl: payload.imageUrl,
        links: payload.links,
        imagePath: payload.imagePath,
        imageKitFileId: payload.imageKitFileId,
        linkType: payload.linkType,
        linkUrl: payload.linkUrl,
        platform: payload.platform,
        sortOrder: payload.sortOrder,
        isActive: payload.isActive,
        startsAt: payload.startsAt,
        endsAt: payload.endsAt,
        minAppVersion: payload.minAppVersion,
      },
      select: {
        id: true,
        imagePath: true,
        isActive: true,
        sortOrder: true,
        imageUrl: true,
      },
    });

    res.status(201).json({
      message: "Success create banner",
      data: row,
    });
  } catch (error) {
    logger.error({ error }, "Failed to create banner controller");
    const appError = errorToAppError(error);
    res.status(appError.statusCode).json({
      message: appError.message,
      data: null,
    });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await bannerService.deleteBanner(id);

    res.status(200).json({
      message: "Success delete banner",
      data: result,
    });
  } catch (error) {
    logger.error({ error }, "Failed to delete banner controller");
    const appError = errorToAppError(error);
    res.status(appError.statusCode).json({
      message: appError.message,
      data: null,
    });
  }
};

export const softDeleteBanner = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const id = req.params.id;

    const result = await bannerService.softDeleteBanner(id, userId);

    res.status(200).json({
      message: "Success soft delete banner",
      data: result,
    });
    return;
  } catch (error) {
    logger.error({ error }, "Failed to soft delete banner controller");
    const appError = errorToAppError(error);
    res.status(appError.statusCode).json({
      message: appError.message,
      data: null,
    });
  }
};

export const patchBanner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const input = patchBannerSchema.parse(req.body);

    const current = await bannerService.getBannerById(id);
    if (!current) {
      res.status(404).json({ message: "Banner not found" });
      return;
    }

    if (
      input.updatedAt &&
      current.updatedAt.getTime() !== input.updatedAt.getTime()
    ) {
      throw new AppError(
        "Banner was modified by someone else. Refresh and try again.",
        409
      );
    }

    const data: any = Object.fromEntries(
      Object.entries({
        title: input.title,
        subtitle: input.subtitle,
        altText: input.altText,
        linkType: input.linkType,
        linkUrl: input.linkUrl,
        platforms: input.platforms,
        sortOrder: input.sortOrder,
        isActive: input.isActive,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
      }).filter(([, v]) => v !== undefined)
    );

    let oldFileIdToDelete: string | null = null;

    if (req.file) {
      const uploaded = await fileService.uploadFile({
        buffer: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/banners",
      });

      data.imagePath = uploaded.filePath;
      data.imageKitFileId = uploaded.fileId;
      data.imageUrl = uploaded.thumbnailUrl;
      if (current.imageKitFileId) oldFileIdToDelete = current.imageKitFileId;
    }

    const result = await bannerService.updateBanner(data, id);

    if (oldFileIdToDelete) {
      const refs = await prisma.banner.count({
        where: { imageKitFileId: oldFileIdToDelete },
      });
      if (refs === 0) {
        try {
          await imagekit.deleteFile(oldFileIdToDelete);
        } catch (_) {}
      }
    }

    res.status(200).json({
      message: "Success update banner",
      data: result,
    });
    return;
  } catch (error) {
    logger.error({ error }, "Failed to update banner controller");
    const appError = errorToAppError(error);
    res.status(appError.statusCode).json({
      message: appError.message,
      data: null,
    });
    return;
  }
};
