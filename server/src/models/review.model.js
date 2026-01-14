import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    reviewBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, reviewBy: 1 }, { unique: true });
reviewSchema.plugin(mongooseAggregatePaginate);
export const Review = mongoose.model("Review", reviewSchema);
