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
      invalidatesTags: ["User"],
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
      providesTags: ["User"],
      keepUnusedDataFor: 0,
    }),

    getUsers: builder.query({
      query: ({ page, limit }) => ({
        url: `${USERS_URL}/get-all-users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/user/${userId}`,
        method: "DELETE",
      }),
    }),

    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/user/${userId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),

    updateUserDetails: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/user/${data.userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    refresh: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/refresh`,
        method: "POST",
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
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useRefreshMutation,
} = userSlice;
