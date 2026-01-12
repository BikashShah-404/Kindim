import { apiSlice } from "./apiSlice";

import { CATEGORY_URL } from "../constants";

const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({ url: `${CATEGORY_URL}`, method: "POST", body: data }),
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, updateData }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PATCH",
        body: updateData,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/categories`,
        method: "GET",
      }),
    }),
    getACategory: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useGetACategoryQuery,
} = categorySlice;
