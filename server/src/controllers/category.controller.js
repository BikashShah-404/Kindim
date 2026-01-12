import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new Error("Category Name is required...");

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) throw new Error("Category Already Exists...");

  const category = await Category.create({ name });

  const createdCategory = await Category.findOne({ name });
  if (!createdCategory) throw new Error("Error while creating category");

  res.status(200).json({
    status: 200,
    data: category,
    msg: "Category Created Successfully...",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) throw new Error("Name of the category is required...");

  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("No category found...");

  category.name = name;
  const updatedCategory = await category.save();
  if (!updateCategory)
    throw new Error("Something went wrong while updating the category...");

  res.status(200).json({
    status: 200,
    data: updateCategory,
    msg: "Category Updated Successfully...",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) throw new Error("Category-Id is required...");

  const response = await Category.deleteOne({ _id: categoryId });
  if (!response) throw new Error("Something went wrong...");

  res.status(200).json({
    status: 200,
    data: response,
    msg: "Category Deleted Successfully...",
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res
    .status(200)
    .json({ status: 200, data: categories, msg: "All categories fetched..." });
});

const getACategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) throw new Error("Category-Id is required...");

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category Not Found...");

  res.status(200).json({
    status: 200,
    data: category,
    msg: "Category fetched successfully...",
  });
});

export const categoryController = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getACategoryById,
};
