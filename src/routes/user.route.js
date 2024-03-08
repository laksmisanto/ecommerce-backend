import { Router } from "express";
import {
  changePassword,
  emailVerification,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/user.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyUser, userLogout);
router.route("/change_password").post(verifyUser, changePassword);
router.route("/verify").post(emailVerification);

export default router;
