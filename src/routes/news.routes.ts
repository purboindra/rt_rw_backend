import { Router } from "express";
import { createNews, deleteNewsById, getAllNews, getNewsById } from "../controllers/news.controller";
import { validate } from "../schemas/validate";
import { idParams } from "../schemas/general.schema";
import { createNewsSchema } from "../schemas/news.schema";

const router = Router();

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
