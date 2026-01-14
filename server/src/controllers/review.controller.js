import { Review } from "../models/review.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProfileRating } from "../utils/updateProfileRating.js";

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new Error("Product-Id is required...");

  const { page = 1, limit = 10 } = req.query;

  const DBquery = [];

  DBquery.push(
    {
      $lookup: {
        from: "users",
        localField: "reviewBy",
        foreignField: "_id",
        as: "reviewBy",
      },
    },
    {
      $addFields: {
        reviewBy: { $first: "$reviewBy.username" },
      },
    },
    { $sort: { createdAt: -1 } }
  );

  const reviews = await Review.aggregatePaginate(Review.aggregate(DBquery), {
    page: +page,
    limit: +limit,
  });
  if (!reviews) throw new Error("No Reviews Found...");

  res.status(200).json({
    status: 200,
    data: {
      reviews: reviews.docs,
      currentPage: +page,
      limit: +limit,
      totalDocs: reviews.totalDocs || 0,
      totalPages: reviews.totalPages,
      nextPage: reviews.nextPage,
    },
    msg: "Reviews Fetched Successfully...",
  });
});

const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const { rating, review } = req.body;
  if (!rating || !review) throw new Error("Review and Rating are required...");

  const alreadyReviewed = await Review.findOne({
    product: productId,
    reviewBy: req.user._id,
  });
  if (alreadyReviewed)
    throw new Error("You have already reviewed this product");

  const reviewDocument = await Review.create({
    product: productId,
    rating: +rating,
    review,
    reviewBy: req.user._id,
  });
  if (!reviewDocument) throw new Error("Error while generating review");

  await updateProfileRating(productId);

  res.status(200).json({
    status: 200,
    data: reviewDocument,
    msg: "Review Posted Successfully",
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, review } = req.body;
  if (!rating && !review) throw new Error("Nothing to update...");

  const reviewDocument = await Review.findByIdAndUpdate(
    reviewId,
    {
      $set: {
        rating: +rating,
        review,
      },
    },
    { new: true }
  );
  if (!reviewDocument) throw new Error("Error while updating the review...");

  await updateProfileRating(productId);

  res.status(200).json({
    status: 200,
    data: reviewDocument,
    msg: "Review Successfully Updated",
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const response = await Review.deleteOne({ _id: reviewId });
  if (!response.acknowledged)
    throw new Error("Something went wrong while deleting the review");

  await updateProfileRating(productId);

  res
    .status(200)
    .json({ data: { response }, msg: "Review deleted successfully" });
});

export const reviewController = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
};
