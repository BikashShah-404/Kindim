import mongoose from "mongoose";
import { Product } from "../models/product.modal.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteAsset, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Order } from "../models/order.model.js";
import { pipeline } from "stream";

const addProduct = asyncHandler(async (req, res) => {
  const { name, brand, quantity, category, description, price, countInStock } =
    req.body;
  if (
    [name, brand, quantity, category, description, countInStock].some(
      (eachField) => eachField.trim() === "",
    )
  )
    throw new Error(
      "Product's name,brand,quantity,category,description and countInStock all are required...",
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
    countInStock,
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
    { new: true },
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
  const { page = 1, limit = 10 } = req.query;

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
  const topProducts = await Product.find({}).sort({ rating: -1 }).limit(8);
  if (!topProducts) throw new Error("Error while fetching the top products...");

  res.status(200).json({
    status: 200,
    data: topProducts,
    msg: "Top Products Fetched Successfully",
  });
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const newProducts = await Product.find({}).sort({ createdAt: -1 }).limit(8);
  if (!newProducts) throw new Error("Error while fetching the new products...");

  res.status(200).json({
    status: 200,
    data: newProducts,
    msg: "New Products Fetched Successfully",
  });
});

const makeQueryFromKeyword = (keyword) => {
  const lowerCaseKeyword = keyword.toString().toLowerCase();
  let checked = [];
  let radio = [];

  const categoryMatch = {
    phone: ["phone"],
    laptop: ["laptop"],
    mobile: ["phone"],
    fashion: ["shoes", "shirts"],
    fitness: ["gym", "exercise"],
    mouse: ["mouse"],
    shirts: ["shirts"],
    shoes: ["shoes"],
    camera: ["camera"],
    gym: ["gym"],
    sofa: ["sofa"],
    exercise: ["exercise"],
  };

  const matchedCategory = Object.keys(categoryMatch)
    .filter((eachKey) =>
      lowerCaseKeyword.split(" ").some((eachWord) => eachWord === eachKey),
    )
    .flatMap((eachKey) => categoryMatch[eachKey]);

  let query;

  const underMatch = lowerCaseKeyword.match(/under\s+(\d+)/);
  const aboveMatch = lowerCaseKeyword.match(/above\s+(\d+)/);
  const forMatch = lowerCaseKeyword.match(/for\s+(\d+)/);
  const rangeMatch =
    lowerCaseKeyword.match(/(\d+)\s+to\s+(\d+)/) ||
    lowerCaseKeyword.match(/between\s+(\d+)\s+(?:and|-)\s+(\d+)/);

  console.log(underMatch, aboveMatch, forMatch, rangeMatch);

  if (underMatch) {
    query = { $lte: parseFloat(underMatch[1]) };
  } else if (aboveMatch) {
    query = { $gte: parseFloat(aboveMatch[1]) };
  } else if (forMatch) {
    query = {
      $lte: parseFloat(forMatch[1]) + 1000,
      $gte: parseFloat(forMatch[1]) - 1000,
    };
  } else if (rangeMatch) {
    query = {
      $lte: parseFloat(rangeMatch[2]),
      $gte: parseFloat(rangeMatch[1]),
    };
  }
  console.log({ matchedCategory, query });

  return { matchedCategory, query };
};

const filterProducts = asyncHandler(async (req, res) => {
  const { checked, brands, radio, keyword } = req.body;

  console.log(req.body);

  const { page = 1, limit = 10 } = req.query;
  let args = {};
  console.log(keyword);

  const DBquery = [];
  let products;

  if (keyword) {
    const { matchedCategory, query } = makeQueryFromKeyword(keyword);

    if ((!matchedCategory || matchedCategory.length === 0) && !query) {
      return res.status(200).json({
        status: 200,
        data: {
          data: [],
          currentPage: +page,
          limit: +limit,
          totalDocs: 0,
          totalPages: 1,
          nextPage: null,
        },
        msg: "Filtered Products Fetched Successfully...",
      });
    }
    args.category = matchedCategory;
    args.price = query;
    if (brands.length > 0) args.brands = [...brands];

    console.log(radio.length);

    if (radio.length > 0) {
      if (radio[1]) {
        args.price = { $gte: parseFloat(radio[1]) };
      } else if (radio[0]) {
        args.price = { $lte: parseFloat(radio[0]) };
      } else if (radio[0] && radio[1]) {
        args.price = { $gte: parseFloat(radio[1]), $lte: parseFloat(radio[0]) };
      }
    }
  } else {
    if (checked.length > 0) {
      args.category = [...checked];
    }
    if (brands.length > 0) args.brands = [...brands];
    if (radio.length > 0) {
      if (radio[1]) {
        args.price = { $gte: parseFloat(radio[1]) };
      } else if (radio[0]) {
        args.price = { $lte: parseFloat(radio[0]) };
      } else if (radio[0] && radio[1]) {
        args.price = { $gte: parseFloat(radio[1]), $lte: parseFloat(radio[0]) };
      }
    }
  }

  console.log(args);

  if (keyword) {
    DBquery.push(
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          categoryId: {
            $first: "$category._id",
          },
          category: { $first: "$category.name" },
        },
      },
      {
        $match: {
          ...(args.category?.length
            ? { category: { $in: args.category } }
            : {}),
          ...(args.brands?.length ? { brand: { $in: args.brands } } : {}),
          ...(args.price
            ? {
                price: args.price,
              }
            : {}),
        },
      },
    );
    products = await Product.aggregatePaginate(Product.aggregate(DBquery), {
      page: +page,
      limit: +limit,
    });
  } else {
    console.log(args);

    DBquery.push({
      $match: {
        ...(args.category?.length
          ? {
              category: {
                $in: args.category.map(
                  (eachCategory) => new mongoose.Types.ObjectId(eachCategory),
                ),
              },
            }
          : {}),
        ...(args.brands?.length ? { brand: { $in: args.brands } } : {}),
        ...(args.price
          ? {
              price: args.price,
            }
          : {}),
      },
    });
    products = await Product.aggregatePaginate(Product.aggregate(DBquery), {
      page: +page,
      limit: +limit,
    });
  }

  console.log(products);

  res.status(200).json({
    status: 200,
    data: {
      data: products.docs,
      currentPage: +page,
      limit: +limit,
      totalDocs: products.totalDocs || 0,
      totalPages: products.totalPages,
      nextPage: products.nextPage,
    },
    msg: "Filtered Products Fetched Successfully...",
  });
});

const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Product.distinct("brand");

  res.status(200).json({
    status: 200,
    data: brands,
    msg: "All brands fetched successfully",
  });
});

const getProductCountByCategory = asyncHandler(async (req, res) => {
  const response = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $addFields: {
        category: { $first: "$category.name" },
      },
    },
  ]);

  res.status(200).json({
    status: 200,
    data: response,
    msg: "Product count by category fetched successfully",
  });
});

const getTopSellingProduct = asyncHandler(async (req, res) => {
  const [product] = await Order.aggregate([
    {
      $match: { isPaid: true },
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.qty" },
      },
    },
    {
      $sort: { totalSold: -1 },
    },
    { $limit: 1 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              brand: 1,
              image: 1,
              price: 1,
              rating: 1,
              numReviews: 1,
            },
          },
        ],
      },
    },
    { $addFields: { product: { $first: "$product" } } },
  ]);

  console.log(product);

  res.status(200).json({
    status: 200,
    data: product,
    msg: "Top Selling Product Fetched Successfully",
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
  filterProducts,
  getAllBrands,
  getProductCountByCategory,
  getTopSellingProduct,
};
