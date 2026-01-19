import mongoose from "mongoose";
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
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
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
        reviewBy: { $first: "$reviewBy" },
      },
    },
    {
      $project: {
        _id: 1,
        product: 1,
        rating: 1,
        review: 1,
        "reviewBy.username": 1,
        "reviewBy.profilePic": 1,
        createdAt: 1,
        updatedAt: 1,
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

const getProductReviewsPerRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new Error("Product-Id is required...");

  const DBquery = [];

  DBquery.push(
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    {
      $bucket: {
        groupBy: "$rating",
        boundaries: [1, 1.5, 2.5, 3.5, 4.5, 5.1],
        output: { count: { $sum: 1 } },
      },
    },
    {
      $addFields: {
        rating: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", 1] }, then: 1 },
              { case: { $eq: ["$_id", 1.5] }, then: 2 },
              { case: { $eq: ["$_id", 2.5] }, then: 3 },
              { case: { $eq: ["$_id", 3.5] }, then: 4 },
              { case: { $eq: ["$_id", 4.5] }, then: 5 },
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        rating: 1,
        count: 1,
      },
    },
    { $sort: { count: -1 } }
  );

  const reviewsPerRating = await Review.aggregate(DBquery);
  if (!reviewsPerRating)
    throw new Error("Error while getting Reviews Per Rating");

  res.status(200).json({
    status: 200,
    data: reviewsPerRating,
    msg: "Reviews Per Rating Fetched Successfully...",
  });
});

const getYourReviewForAProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new Error("Product-Id is required");

  const review = await Review.findOne({
    product: productId,
    reviewBy: req.user._id,
  });
  if (!review) throw new Error("No Review Found...");

  res
    .status(200)
    .json({ status: 200, data: review, msg: "Review Fetched Successfully..." });
});

const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const { rating, review } = req.body;
  if (!rating || !review) throw new Error("Review and Rating are required...");

  if (rating > 5) throw new Erro("Rating cannot be more than 5...");

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
        rating: rating && +rating,
        review,
      },
    },
    { new: true }
  );
  if (!reviewDocument) throw new Error("Error while updating the review...");

  await updateProfileRating(reviewDocument.product);

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
  getProductReviewsPerRating,
  getYourReviewForAProduct,
  addReview,
  updateReview,
  deleteReview,
};
