import { Router } from "express";

import verifyUserRole from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createCategory } from "../controllers/category.controller.js";

const router = Router();

router.route("/create").post(upload.single("categoryImage"), createCategory);

export default router;
