import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "../constants";
import { logout, setCredentials } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { resetCart } from "../features/cart/cartSlice";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" });

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result.error?.status === 401) {
    // Trying refreshToken to reLogin
    const refreshResult = await baseQuery(
      { url: "/api/v1/users/refresh", method: "POST" },
      api,
      extraOptions,
    );

    console.log(refreshResult);

    if (refreshResult?.data?.status === 200) {
      api.dispatch(setCredentials(refreshResult.data.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      toast.error("Session Expired. Please login again ");
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Order", "User", "Category", "Review", "AppReview"],
  endpoints: () => ({}),
});
