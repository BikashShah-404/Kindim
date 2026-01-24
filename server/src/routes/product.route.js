import { Router } from "express";

import { verifyJWT, authorizedAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { productController } from "../controllers/product.controller.js";

const router = Router();

router.route("/").get(productController.fetchProducts);

router
  .route("/allproducts")
  .get(verifyJWT, authorizedAdmin, productController.fetchAllProducts);

router.route("/top").get(productController.fetchTopProducts);
router.route("/new").get(productController.fetchNewProducts);
router.route("/filter-products").post(productController.filterProducts);

router.route("/:productId").get(productController.fetchProductById);

router
  .route("/create")
  .post(
    verifyJWT,
    authorizedAdmin,
    upload.single("image"),
    productController.addProduct,
  );

router
  .route("/update-details/:productId")
  .patch(verifyJWT, authorizedAdmin, productController.updateProductDetails);

router
  .route("/update-image/:productId")
  .patch(
    verifyJWT,
    authorizedAdmin,
    upload.single("image"),
    productController.updateProductImage,
  );

router
  .route("/delete/:productId")
  .delete(verifyJWT, authorizedAdmin, productController.deleteProduct);

export default router;
