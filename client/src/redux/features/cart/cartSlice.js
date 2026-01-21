import { updateCart } from "@/utils/cart";
import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      console.log(item);

      const existItem = state.cartItems.find(
        (cartItem) => cartItem._id === item._id,
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((cartItem) =>
          cartItem._id === existItem._id ? item : cartItem,
        );
        if (existItem.qty === item.qty) action.meta = { duplicate: true };
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem._id !== action.payload,
      );
      console.log(action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", state);
    },

    resetCart: (state) => {
      state = initialState;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
