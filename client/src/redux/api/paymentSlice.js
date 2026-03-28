import { PAYMENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const paymentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: ({ orderId, totalPrice }) => ({
        url: `${PAYMENT_URL}/initiate`,
        method: "POST",
        body: { orderId, totalPrice },
      }),
    }),

    completePayment: builder.query({
      query: ({ data }) => ({
        url: `${PAYMENT_URL}/complete?data=${data}`,
        method: "GET",
      }),
    }),

    failedPayment: builder.query({
      query: ({ data }) => ({
        url: `${PAYMENT_URL}/failure?data=${data}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useCompletePaymentQuery,
  useFailedPaymentQuery,
} = paymentSlice;
