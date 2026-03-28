import { useState, useEffect } from "react";

import {
  useGetAllBrandsQuery,
  useGetFilterProductsQuery,
} from "@/redux/api/productSlice.js";
import { useGetAllCategoriesQuery } from "@/redux/api/categorySlice.js";

import {
  setBrands,
  setCategories,
  setChecked,
  setRadio,
  setSelectedBrands,
} from "@/redux/features/shop/shopSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";
import PaginationComp from "@/components/Pagination";
import { Spinner } from "@/components/ui/spinner";

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { categories, brands, selectedBrands, checked, radio } = useSelector(
    (state) => state.shop,
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const categoriesQuery = useGetAllCategoriesQuery();
  const brandsQuery = useGetAllBrandsQuery();
  const [priceFilter, setPriceFilter] = useState(0);
  const [debouncedPrice, setDebouncedPrice] = useState(0);
  const [priceFilterType, setPriceFilterType] = useState("min");

  const keyword = location.state?.query || "";
  console.log(keyword);

  const filteredProductQuery = useGetFilterProductsQuery({
    checked,
    selectedBrands,
    radio,
    keyword,
    page,
    limit,
  });
  console.log(filteredProductQuery);

  const products = filteredProductQuery.data?.data?.data;
  console.log(products);

  useEffect(() => {
    if (radio.length === 0) {
      setPriceFilter(0);
    }
  }, [
    radio,
    filteredProductQuery.data,
    dispatch,
    priceFilterType,
    filteredProductQuery,
  ]);

  useEffect(() => {
    if (keyword) {
      console.log("abc");

      console.log(products?.map((eachProduct) => eachProduct.category));

      dispatch(
        setCategories(
          Array.from(
            new Set(products?.map((eachProduct) => eachProduct.category)),
          )?.map((eachUniqueCategory, index) => ({
            _id: index,
            name: eachUniqueCategory,
          })),
        ),
      );
      dispatch(
        setBrands(
          Array.from(
            new Set(products?.map((eachProduct) => eachProduct.brand)),
          ),
        ),
      );
    } else if (!categoriesQuery.isLoading && !brandsQuery.isLoading) {
      dispatch(setCategories(categoriesQuery?.data?.data));
      dispatch(setBrands(brandsQuery?.data?.data));
    }
  }, [
    categoriesQuery,
    categoriesQuery.data,
    dispatch,
    keyword,
    brandsQuery,
    brandsQuery.data,
    products,
  ]);

  const handleBrandClick = async (value, brand) => {
    console.log(brand);

    const updatedSelectedBrands = value
      ? [...selectedBrands, brand]
      : selectedBrands.filter((b) => b !== brand);

    dispatch(setSelectedBrands(updatedSelectedBrands));
    // await filteredProductQuery.refetch();
  };

  const handleCheck = (value, id) => {
    console.log(value);

    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPrice(priceFilter);
    }, 800);
    return () => clearTimeout(handler);
  }, [priceFilter]);

  useEffect(() => {
    if (debouncedPrice) {
      dispatch(
        setRadio(
          priceFilterType === "min"
            ? [null, debouncedPrice]
            : [debouncedPrice, null],
        ),
      );
    }
  }, [debouncedPrice, priceFilterType, dispatch]);

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className=" bg-gradient-to-tr from-black via-gray-600 to-gray-500 ">
        <div className="flex md:flex-row w-full p-1">
          <div className="bg-gradient-to-t from-black via-gray-600 to-gray-500   text-white rounded-xl   sticky top-18 h-[93vh] overflow-hidden">
            <div className=" overflow-y-scroll h-full px-4 py-4 ">
              <div>
                <h2 className="text-xl font-medium px-4 py-1 rounded-xl bg-black font-alegreya">
                  Filter By Categories
                </h2>
              </div>
              <div className="p-5 w-[10rem] flex flex-col space-y-2 ">
                {categories?.map((c) => (
                  <div key={c._id} className="flex items-center  space-x-2">
                    <input
                      type="checkbox"
                      id={`checkbox-${c._id}`}
                      defaultChecked={keyword ? true : false}
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
              <h2 className="text-xl font-alegreya font-medium px-4 py-1 rounded-xl bg-black mt-6">
                Filter By Brands
              </h2>
              <div className="p-5 w-[10rem] flex flex-col space-y-2  ">
                {brands?.map((brand) => (
                  <div key={brand} className="flex items-center  space-x-2">
                    <input
                      type="checkbox"
                      name="brand"
                      id={`${brand}`}
                      onChange={(e) =>
                        handleBrandClick(e.target.checked, brand)
                      }
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
              <h2 className="text-xl font-alegreya font-medium px-4 py-1 rounded-xl bg-black mt-6">
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
              <div className="w-full flex items-center justify-center ">
                <button
                  className={`bg-white px-10 py-1.5 text-black rounded-md my-10 
                cursor-pointer `}
                  onClick={() => window.location.reload()}
                >
                  Reset
                </button>{" "}
              </div>
            </div>
          </div>

          {filteredProductQuery?.isLoading ? (
            <div className=" flex flex-1   justify-center items-center">
              <div className="flex items-center gap-x-4 h-fit  shadow-2xl w-fit bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl  ">
                <Spinner className={"h-10 w-10 "} />
                <span className="text-secondary font-semibold">
                  Fetching Products...
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 p-10 mb-60  ">
              <h2 className=" mb-2 font-semibold text-2xl text-white font-alegreya ">
                {products?.length} products
              </h2>
              <div className="w-full  flex flex-1  flex-col space-y-10 text-white mt-10 ">
                {products?.length === 0 ? (
                  <div className="flex flex-1 justify-center text-3xl font-alegreya justify-center items-center">
                    No Products Found...
                  </div>
                ) : (
                  products?.map((product) => (
                    <div className="" key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
              </div>
              <div className="mt-20">
                <PaginationComp
                  page={page}
                  limit={limit}
                  setPage={setPage}
                  setLimit={setLimit}
                  total={filteredProductQuery?.data?.data?.totalPages}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
