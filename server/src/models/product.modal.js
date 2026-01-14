import mongoose, { Mongoose } from "mongoose";
const { ObjectId } = mongoose.Schema;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, required: true, ref: "Category" },
    description: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
