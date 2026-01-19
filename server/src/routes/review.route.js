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
  .route("/product/:productId")
  .get(reviewController.getProductReviews)
  .post(verifyJWT, reviewController.addReview);

router
  .route("/:reviewId")
  .patch(verifyJWT, reviewController.updateReview)
  .delete(verifyJWT, reviewController.deleteReview);

export default router;
