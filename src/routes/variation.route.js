import { Router } from "express";
import verifyUserRole from "../middlewares/role.middleware.js";
import { createVariation } from "../controllers/variation.controller.js";

const router = Router();

router.route("/create").post(createVariation);

export default router;
