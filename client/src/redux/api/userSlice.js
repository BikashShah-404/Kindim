import { apiSlice } from "./apiSlice";

import { USERS_URL } from "../constants";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),

    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/sign-up`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({ url: `${USERS_URL}/logout`, method: "POST" }),
    }),

    updateProfilePic: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-profilepic`,
        method: "PATCH",
        body: data,
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/update-profile`,
        method: "PATCH",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "POST",
        body: data,
      }),
    }),

    getFPToken: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/get-forgetpassword-token`,
        method: "POST",
        body: data,
      }),
    }),

    sendFPToken: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-forgetpassword-token`,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password/${data.token}`,
        method: "POST",
        body: { email: data.email, newPassword: data.newPassword },
      }),
    }),

    checkIfAdmin: builder.query({
      query: () => ({
        url: `${USERS_URL}/check-isadmin`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUpdateProfilePicMutation,
  useChangePasswordMutation,
  useGetFPTokenMutation,
  useSendFPTokenMutation,
  useResetPasswordMutation,
  useCheckIfAdminQuery,
} = userSlice;
