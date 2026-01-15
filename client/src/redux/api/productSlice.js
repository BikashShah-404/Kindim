import { apiSlice } from "./apiSlice";

import { PRODUCT_URL } from "../constants";

const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, limit, keyword }) => {
        const params = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (keyword) params.keyword = keyword;

        return { url: `${PRODUCT_URL}`, params, method: "GET" };
      },
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/allproducts`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getTopProduct: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getNewProduct: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/new`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProductDetails: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCT_URL}/update-details/${productId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProductImage: builder.mutation({
      query: ({ productId, image }) => ({
        url: `${PRODUCT_URL}/update-image/${productId}`,
        method: "PATCH",
        body: image,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/delete/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useGetTopProductQuery,
  useGetNewProductQuery,
  useCreateProductMutation,
  useUpdateProductDetailsMutation,
  useUpdateProductImageMutation,
  useDeleteProductMutation,
} = productSlice;
