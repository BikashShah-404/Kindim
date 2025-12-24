import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/sign-up")
  .post(upload.single("profilePic"), userController.signup);

export default router;
