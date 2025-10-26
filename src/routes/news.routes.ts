import { Router } from "express";
import { createNews, deleteNewsById, getAllNews, getNewsById, updateNews } from "../controllers/news.controller";
import { idParams } from "../schemas/general.schema";
import { createNewsSchema } from "../schemas/news.schema";
import { validate } from "../schemas/validate";

const router = Router();

router.patch(
  "/:id",
  validate({
    params: idParams,
  }),
  updateNews,
);
router.get("/", getAllNews);
router.get(
  "/:id",
  validate({
    params: idParams,
  }),
  getNewsById,
);
router.delete("/:id", validate({ params: idParams }), deleteNewsById);
router.post(
  "/",
  validate({
    body: createNewsSchema,
  }),
  createNews,
);

export default router;
