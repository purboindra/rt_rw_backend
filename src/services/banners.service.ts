import prisma from "../db";
import { logger } from "../logger";
import {
  createBannerSchema,
  updateBannerSchema,
} from "../schemas/banner.schema";
import { errorToAppError } from "../utils/errors";

export const getAllBanners = async () => {
  try {
    const response = await prisma.banner.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to get all banners");
    throw errorToAppError(error, "Failed to fetch banners");
  }
};

export const getBannerById = async (id: string) => {
  try {
    const response = await prisma.banner.findFirst({
      where: {
        id: id,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to get banner by id");
    throw errorToAppError(error, "Failed to fetch banner by id");
  }
};

export const createBanner = async (rawQuery: unknown) => {
  try {
    const query = createBannerSchema.parse(rawQuery);

    const response = await prisma.banner.create({
      data: {
        ...query,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to create banner");
    throw errorToAppError(error, "Failed to create banner");
  }
};

export const updateBanner = async (rawQuery: unknown, bannerId: string) => {
  try {
    const query = updateBannerSchema.parse(rawQuery);

    const response = await prisma.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        ...query,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to update banner");
    throw errorToAppError(error, "Failed to update banner");
  }
};

export const deleteBanner = async (bannerId: string) => {
  try {
    const response = await prisma.banner.delete({
      where: {
        id: bannerId,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to delete banner");
    throw errorToAppError(error, "Failed to delete banner");
  }
};
