import { apiSlice } from "./apiSlice";

import { SUBSCRIBTION_URL } from "../constants";

const subscribtionSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation({
      query: (data) => ({
        url: `${SUBSCRIBTION_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    toogleSubscribtion: builder.mutation({
      query: (data) => ({
        url: `${SUBSCRIBTION_URL}/toogle`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubscribeMutation, useToogleSubscribtionMutation } =
  subscribtionSlice;
