import { apiSlice } from "./apiSlice";

import { ANALYTICS_URL } from "../constants";

const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => ({
        url: `${ANALYTICS_URL}/dashboard`,
        method: "GET",
      }),
    }),

    getRevenuePerDay: builder.query({
      query: () => ({ url: `${ANALYTICS_URL}/revenue-per-day`, method: "GET" }),
    }),

    getOrderAnalytics: builder.query({
      query: () => ({
        url: `${ANALYTICS_URL}/orders`,
        method: "GET",
      }),
    }),

    getTopSellingProducts: builder.query({
      query: () => ({
        url: `${ANALYTICS_URL}/top`,
        method: "GET",
      }),
    }),

    getLowStockProducts: builder.query({
      query: () => ({
        url: `${ANALYTICS_URL}/low-stock`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetRevenuePerDayQuery,
  useGetOrderAnalyticsQuery,
  useGetTopSellingProductsQuery,
  useGetLowStockProductsQuery,
} = categorySlice;
