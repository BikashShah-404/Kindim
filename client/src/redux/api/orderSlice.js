import { apiSlice } from "./apiSlice";

import { ORDERS_URL } from "../constants";

const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}`,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "GET",
      }),
    }),

    getOwnOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    getAllOrders: builder.query({
      query: ({ page, limit }) => ({
        url: `${ORDERS_URL}/all?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    deliverOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    payOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/pay`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetOwnOrdersQuery,
  useGetAllOrdersQuery,
  useDeliverOrderMutation,
  usePayOrderMutation,
} = orderSlice;
