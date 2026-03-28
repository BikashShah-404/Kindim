import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reviewController } from "../controllers/review.controller.js";

const router = Router();

router
  .route("/product/reviews-per-rating/:productId")
  .get(reviewController.getProductReviewsPerRating);

router
  .route("/product-review/:productId")
  .get(verifyJWT, reviewController.getYourReviewForAProduct);

router
  .route("/product/review/:productId")
  .get(reviewController.getProductReviews)
  .post(verifyJWT, reviewController.addReview);

router
  .route("/product/:reviewId")
  .patch(verifyJWT, reviewController.updateReview)
  .delete(verifyJWT, reviewController.deleteReview);

router
  .route("/app")
  .get(reviewController.getTopAppReviews)
  .post(verifyJWT, reviewController.addAppReview);

router.route("/app/my-review").get(verifyJWT, reviewController.getMyAppReview);

router
  .route("/app/:reviewId")
  .patch(verifyJWT, reviewController.updateAppReview);

export default router;
