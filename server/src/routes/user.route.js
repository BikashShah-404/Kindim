import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/sign-up")
  .post(upload.single("profilePic"), userController.signup);

router.route("/login").post(userController.login);
router.route("/logout").post(verifyJWT, userController.logout);
router.route("/refresh").post(userController.refresh);

router.route("/profile").get(verifyJWT, userController.getCurrentUser);

export default router;
