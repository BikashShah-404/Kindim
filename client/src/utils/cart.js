export const addDecimals = (num) =>
  Number((Math.round(num * 100) / 100).toFixed(2));

export const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce(
      (acc, cartItem) => acc + cartItem.price * cartItem.qty,
      0,
    ),
  );

  console.log(state);

  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 50);
  state.taxPrice = addDecimals(Number(0.18 * state.itemsPrice).toFixed(2));

  state.totalPrice = Number(
    state.itemsPrice + state.shippingPrice + state.taxPrice,
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
