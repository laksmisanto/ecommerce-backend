import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

const router = Router();

router.route("/create").post(
  upload.fields([
    {
      name: "productFeaturedImage",
      maxCount: 1,
    },
    {
      name: "productDetailedImages",
      maxCount: 5,
    },
  ]),
  createProduct
);

export default router;
