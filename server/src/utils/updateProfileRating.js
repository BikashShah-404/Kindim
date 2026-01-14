import { Product } from "../models/product.modal.js";
import { Review } from "../models/review.model.js";

export const updateProfileRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;
  console.log(numReviews);
  const rating = numReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews
    : 0;

  const ratingUpdatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        numReviews,
        rating,
      },
    },
    { new: true }
  );
};
