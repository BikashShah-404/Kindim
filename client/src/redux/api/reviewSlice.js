import { apiSlice } from "./apiSlice";

import { REVIEW_URL } from "../constants";
import { body } from "motion/react-client";

const reviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ productId, page, limit, keyword = "recent" }) => ({
        url: `${REVIEW_URL}/product/review/${productId}?page=${page}&limit=${limit}&keyword=${keyword}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, { productId }) => [
        { type: "Review", id: productId },
      ],
    }),
    getProductReviewsNoPerRating: builder.query({
      query: (productId) => ({
        url: `${REVIEW_URL}/product/reviews-per-rating/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [
        { type: "Review", id: productId },
      ],
    }),
    getYourReviewForProduct: builder.query({
      query: (productId) => ({
        url: `${REVIEW_URL}/product-review/${productId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [
        { type: "Review", id: productId },
      ],
    }),

    postReview: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${REVIEW_URL}/product/review/${productId}`,
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
        url: `${REVIEW_URL}/product/${reviewId}`,
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
        url: `${REVIEW_URL}/product/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Review", id: productId },
      ],
    }),

    getTopAppReviews: builder.query({
      query: () => ({
        url: `${REVIEW_URL}/app`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["AppReview"],
    }),

    getMyAppReview: builder.query({
      query: () => ({
        url: `${REVIEW_URL}/app/my-review`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["AppReview"],
    }),

    addAppReview: builder.mutation({
      query: ({ data }) => ({
        url: `${REVIEW_URL}/app`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppReview"],
    }),

    updateAppReview: builder.mutation({
      query: ({ reviewId, data }) => ({
        url: `${REVIEW_URL}/app/${reviewId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AppReview"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetProductReviewsNoPerRatingQuery,
  useGetYourReviewForProductQuery,
  usePostReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetTopAppReviewsQuery,
  useGetMyAppReviewQuery,
  useAddAppReviewMutation,
  useUpdateAppReviewMutation,
} = reviewSlice;
