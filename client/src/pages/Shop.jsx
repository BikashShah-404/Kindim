import { useState, useEffect } from "react";

import { useGetFilterProductsQuery } from "@/redux/api/productSlice.js";
import { useGetAllCategoriesQuery } from "@/redux/api/categorySlice.js";

import {
  setCategories,
  setProducts,
  setChecked,
} from "@/redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop,
  );

  const categoriesQuery = useGetAllCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState(0);
  const [priceFilterType, setPriceFilterType] = useState("min");

  const filteredProductQuery = useGetFilterProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data.data));
    }
  }, [categoriesQuery, categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductQuery.isLoading) {
        const filteredProducts = filteredProductQuery.data?.data.filter(
          (product) => {
            return priceFilterType === "max"
              ? product.price <= Number(priceFilter)
              : product.price >= Number(priceFilter);
          },
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [
    checked,
    radio,
    filteredProductQuery.data,
    dispatch,
    priceFilter,
    priceFilterType,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductQuery.data?.data?.filter(
      (product) => product.brand === brand,
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductQuery.data?.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined),
      ),
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className=" bg-gradient-to-tr from-black via-gray-600 to-gray-500 ">
        <div className="flex md:flex-row w-full">
          <div className="bg-gradient-to-t from-black via-gray-600 to-gray-500 p-4 text-white rounded-r-xl h-fit pb-10 ">
            <div>
              <h2 className="text-lg font-medium px-4 py-1 rounded-xl bg-black">
                Filter By Categories
              </h2>
            </div>
            <div className="p-5 w-[10rem] flex flex-col space-y-2 ">
              {categories.map((c) => (
                <div key={c._id} className="flex items-center  space-x-2">
                  <input
                    type="checkbox"
                    id={`checkbox-${c._id}`}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="h-5 w-5 rounded-md  border-gray-400 hover:ring-1 ring-offset-black ring-chart-3 ring-offset-1  focus:ring-accent-foreground cursor-pointer accent-black "
                  />
                  <label
                    htmlFor={`checkbox-${c._id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {c.name}
                  </label>
                </div>
              ))}
            </div>
            <h2 className="text-lg font-medium px-4 py-1 rounded-xl bg-black mt-6">
              Filter By Brands
            </h2>
            <div className="p-5 w-[10rem] flex flex-col space-y-2  ">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center  space-x-2">
                  <input
                    type="radio"
                    name="brand"
                    id={`${brand}`}
                    onChange={() => handleBrandClick(brand)}
                    className="h-5 w-5 rounded-md  border-gray-400 hover:ring-1 ring-offset-black ring-chart-3 ring-offset-1  focus:ring-accent-foreground cursor-pointer accent-black "
                  />
                  <label
                    htmlFor={`${brand}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
            <h2 className="text-lg font-medium px-4 py-1 rounded-xl bg-black mt-6">
              Filter By Price
            </h2>
            <div className=" p-3 w-fit flex flex-row-reverse gap-x-2 items-center">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="bg-white px-1 py-2 rounded-md text-black placeholder:text-black border-gray-400 hover:ring-1 ring-offset-black ring-chart-3 ring-offset-1  focus:ring-accent-foreground  accent-black"
              />
              <select
                name="priceFilterType"
                id="priceFilterType"
                value={priceFilterType}
                onChange={(e) => setPriceFilterType(e.target.value)}
                className="bg-white py-2 px-1 rounded-md text-black"
              >
                <option id="priceFilterType" value="min" className="">
                  Min
                </option>
                <option id="priceFilterType" value="max">
                  Max
                </option>
              </select>
            </div>
            <div className="w-full flex items-center justify-center mt-6">
              <button
                className={`bg-white px-10 py-1.5 text-black rounded-md mt-8 
                cursor-pointer`}
                onClick={() => window.location.reload()}
              >
                Reset
              </button>{" "}
            </div>
          </div>
          <div className=" flex-1 p-10 ">
            <h2 className=" mb-2 font-semibold text-lg text-white">
              {products.length} products
            </h2>
            <div className="w-full  flex flex-col space-y-10 text-white mt-10 ">
              {products.length === 0 ? (
                <>Loading...</>
              ) : (
                products.map((product) => (
                  <div className="" key={product._id}>
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
