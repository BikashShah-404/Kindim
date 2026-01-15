import { apiSlice } from "./apiSlice";

import { REVIEW_URL } from "../constants";

const reviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId) => ({
        url: `${REVIEW_URL}/product/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [
        { type: "Review", id: productId },
      ],
    }),

    postReview: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${REVIEW_URL}/product/${productId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Review", id: productId },
      ],
    }),

    updateReview: builder.mutation({
      query: ({ reviewId, productId, data }) => ({
        url: `${REVIEW_URL}/${reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Review", id: productId },
      ],
    }),

    deleteReview: builder.mutation({
      query: ({ reviewId, productId }) => ({
        url: `${REVIEW_URL}/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Review", id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  usePostReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewSlice;
