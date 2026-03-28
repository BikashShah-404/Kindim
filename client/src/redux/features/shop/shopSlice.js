import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  brands: [],
  checked: [],
  radio: [],
  selectedBrands: [],
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setChecked: (state, action) => {
      state.checked = action.payload;
    },
    setRadio: (state, action) => {
      state.radio = action.payload;
    },
    setSelectedBrands: (state, action) => {
      state.selectedBrands = action.payload;
    },
  },
});

export const {
  setCategories,
  setBrands,
  setChecked,
  setRadio,
  setSelectedBrands,
} = shopSlice.actions;

export default shopSlice.reducer;
