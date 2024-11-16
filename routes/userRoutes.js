import express from "express";
import { singleupload } from "../middlewares/multer.js";
import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  updatePasswordController,
  updateProfilecontroller,
  updateprofilePicController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile", isAuth, getUserProfileController);
router.get("/logout", logoutController);
router.put("/profile-update", isAuth, updateProfilecontroller);
router.put("/update-password", isAuth, updatePasswordController);

router.put("/update-picture", isAuth, singleupload, updateprofilePicController);

export default router;
