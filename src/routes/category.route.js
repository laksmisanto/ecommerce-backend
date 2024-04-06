import { Router } from "express";

import verifyUserRole from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  categoryLists,
  createCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.route("/create").post(upload.single("categoryImage"), createCategory);
router.route("/category-list").get(categoryLists);

export default router;
