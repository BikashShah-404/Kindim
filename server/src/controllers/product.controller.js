import mongoose from "mongoose";
import { Product } from "../models/product.modal.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteAsset, uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    quantity,
    category,
    description,
    price,
    // countInStock,
  } = req.body;
  if (
    [name, brand, quantity, category, description].some(
      (eachField) => eachField.trim() === ""
    )
  )
    throw new Error(
      "Product's name,brand,quantity,category,description all are required..."
    );

  const productImageLocalPath = req.file.path;
  if (!productImageLocalPath) throw new Error("Product Image is required...");

  const productImage = await uploadOnCloudinary(productImageLocalPath);
  if (!productImage)
    throw new Error("Something went wrong while uploading the product image");

  const product = new Product({
    name,
    brand,
    quantity,
    category,
    description,
    price,
    quantity,
    image: productImage.url,
  });
  await product.save();

  res.status(200).json({
    status: 200,
    data: product,
    msg: "Product Created Successfully",
  });
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const { name, brand, quantity, category, description, price, countInStock } =
    req.body;

  if (
    !name &&
    !brand &&
    !quantity &&
    !category &&
    !description &&
    !price &&
    !countInStock
  )
    throw new Error("No update field found");

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        name,
        brand,
        quantity,
        category,
        description,
        price,
        countInStock,
      },
    },
    { new: true }
  );

  if (!updatedProduct)
    throw new Erorr("Error while updating the product details");

  res.status(200).json({
    status: 200,
    data: updatedProduct,
    msg: "Product details updated successfully",
  });
});

const updateProductImage = asyncHandler(async (req, res) => {
  const productImageLocalPath = req.file.path;
  if (!productImageLocalPath)
    throw new Error("Product-Image to update not found");

  const productImage = await uploadOnCloudinary(productImageLocalPath);
  if (!productImage)
    throw new Error("Something went wrong while uploading the profilePic");

  const product = await Product.findById(req.params.productId);
  if (!product) throw new Error("Product to update not found");

  const assetId = product.image.split("/").pop()?.split(".")[0];
  console.log(assetId);

  if (!assetId) throw new Error("Invalid Product-Image URL format");

  const { result } = await deleteAsset(assetId);
  console.log(result);

  if (result !== "ok") throw new Error("Previous Product-Image not deleted");

  product.image = productImage.url;
  await product.save();

  res.status(200).json({
    status: 200,
    data: {
      image: productImage.url,
    },
    msg: "Product-Image Updated Successfully",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product to delete not found");

  const assetId = product.image.split("/").pop()?.split(".")[0];
  if (!assetId) throw new Error("Invalid Product-Image URL format");

  const { result } = await deleteAsset(assetId);
  if (result !== "ok") throw new Error("Product-Image not deleted");

  const response = await Product.deleteOne({ _id: productId });

  if (!response.acknowledged)
    throw new Error("Something went wrong while deleting the product");

  //   TODO:U need to delete the reviews of the product as well

  res
    .status(200)
    .json({ data: { response }, msg: "Product deleted successfully" });
});

const fetchProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const keyword = req.query.keyword || null;

  const DBquery = [];
  if (keyword) {
    DBquery.push({
      $match: { name: { $regex: keyword, $options: "i" } },
    });
  }

  const products = await Product.aggregatePaginate(Product.aggregate(DBquery), {
    page: +page,
    limit: +limit,
  });

  res.status(200).json({
    status: 200,
    data: {
      products: products.docs,
      currentPage: +page,
      limit: +limit,
      totalDocs: products.totalDocs || 0,
      totalPages: products.totalPages,
      nextPage: products.nextPage,
    },
    msg: "Products Fetched Successfully",
  });
});

const fetchProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  //  TODO: we need to make aggregation and all to provide reviews and ratings too...
  const DBquery = [];

  DBquery.push({
    $match: { _id: new mongoose.Types.ObjectId(productId) },
  });

  const product = await Product.aggregate(DBquery);
  if (!product)
    throw new Error("Something went wrong while fetching a product");

  res
    .status(200)
    .json({ status: 200, data: product, msg: "Product Fetched Successfully" });
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.params;

  const products = await Product.aggregatePaginate(Product.aggregate([]), {
    page: +page,
    limit: +limit,
  });

  res.status(200).json({
    status: 200,
    data: {
      products: products.docs,
      currentPage: +page,
      limit: +limit,
      totalDocs: products.totalDocs || 0,
      totalPages: products.totalPages,
      nextPage: products.nextPage,
    },
    msg: "Products Fetched Successfully...",
  });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({}).sort({ rating: -1 }).limit(6);
  if (!topProducts) throw new Error("Error while fetching the top products...");

  res.status(200).json({
    status: 200,
    data: topProducts,
    msg: "Top Products Fetched Successfully",
  });
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const newProducts = await Product.find({}).sort({ createdAt: -1 }).limit(6);
  if (!newProducts) throw new Error("Error while fetching the new products...");

  res.status(200).json({
    status: 200,
    data: newProducts,
    msg: "New Products Fetched Successfully",
  });
});

export const productController = {
  addProduct,
  updateProductDetails,
  updateProductImage,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  fetchTopProducts,
  fetchNewProducts,
};
