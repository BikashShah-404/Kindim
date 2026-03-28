import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const appReviewSchema = new mongoose.Schema(
  {
    reviewBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
  },
  { timestamps: true },
);
appReviewSchema.index({ reviewBy: 1 }, { unique: true });
appReviewSchema.plugin(mongooseAggregatePaginate);
export const AppReview = mongoose.model("AppReview", appReviewSchema);
