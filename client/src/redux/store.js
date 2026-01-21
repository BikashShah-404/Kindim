import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice.js";
import favouriteReducer from "./favourites/favouriteSlice.js";
import cartReducer from "./features/cart/cartSlice.js";
import { getFavouritesFromLocalStorage } from "@/utils/localStorage";

const initialFavourites = getFavouritesFromLocalStorage() || "";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favourites: favouriteReducer,
    cart: cartReducer,
  },

  preloadedState: {
    favourites: initialFavourites,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
