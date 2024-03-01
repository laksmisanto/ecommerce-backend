import { Router } from "express";

import verifyUserRole from "../middlewares/role.middleware.js";

const router = Router();

router.route("/create").post(verifyUserRole);

export default router;
