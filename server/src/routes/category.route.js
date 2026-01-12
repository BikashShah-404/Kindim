import { Router } from "express";
import { authorizedAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { categoryController } from "../controllers/category.controller.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, authorizedAdmin, categoryController.createCategory);

router
  .route("/categories")
  .get(verifyJWT, authorizedAdmin, categoryController.getAllCategories);

router
  .route("/:categoryId")
  .get(verifyJWT, authorizedAdmin, categoryController.getACategoryById)
  .patch(verifyJWT, authorizedAdmin, categoryController.updateCategory)
  .delete(verifyJWT, authorizedAdmin, categoryController.deleteCategory);

export default router;
