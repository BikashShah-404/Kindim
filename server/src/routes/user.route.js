import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, authorizedAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/sign-up")
  .post(upload.single("profilePic"), userController.signup);

router.route("/login").post(userController.login);
router.route("/logout").post(verifyJWT, userController.logout);
router.route("/refresh").post(userController.refresh);

router.route("/profile").get(verifyJWT, userController.getCurrentUser);
router.route("/update-profile").patch(verifyJWT, userController.updateProfile);
router
  .route("/update-profilepic")
  .patch(
    verifyJWT,
    upload.single("profilePic"),
    userController.updateProfilePic
  );

router.route("/change-password").post(verifyJWT, userController.updatePassword);
router
  .route("/get-forgetpassword-token")
  .post(userController.getForgetPasswordToken);
router
  .route("/verify-forgetpassword-token")
  .post(userController.verifyForgetPasswordToken);
router.route("/reset-password/:token").post(userController.resetPassword);

// Admin-Only:
router
  .route("/get-all-users")
  .get(verifyJWT, authorizedAdmin, userController.getAllUsers);
router
  .route("/user/:id")
  .get(verifyJWT, authorizedAdmin, userController.getAUserById)
  .patch(
    verifyJWT,
    authorizedAdmin,
    upload.single("profilePic"),
    userController.updateProfileById
  )
  .delete(verifyJWT, authorizedAdmin, userController.deleteAUserById);

export default router;
