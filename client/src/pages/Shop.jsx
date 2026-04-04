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
import { PanelRightClose } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ToolTipComp from "@/components/Tooltip";

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { categories, brands, selectedBrands, checked, radio } = useSelector(
    (state) => state.shop,
  );

  const categoriesQuery = useGetAllCategoriesQuery();
  console.log(categoriesQuery);

  const [isFilterPanelClicked, setIsFilterPanelClicked] = useState(false);

  const brandsQuery = useGetAllBrandsQuery();
  const [priceFilter, setPriceFilter] = useState(0);
  const [debouncedPrice, setDebouncedPrice] = useState(0);
  const [priceFilterType, setPriceFilterType] = useState("min");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState(null);

  useEffect(() => {
    const query = location.state?.query;
    if (query) {
      setKeyword(query);
      setPage(1);
      // ← clear location state so it doesn't persist on reload
      window.history.replaceState({}, document.title);
    } else {
      setKeyword(null);
      dispatch(setChecked([]));
      dispatch(setSelectedBrands([]));
      dispatch(setRadio([]));
      setPriceFilter(0);
    }
  }, [location.state, dispatch]);

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
    if (filteredProductQuery.isFetching) return;
    if (!filteredProductQuery.isSuccess) return;

    if (keyword && selectedBrands.length === 0) {
      if (!products || products.length === 0) {
        setCategories([]);
        setBrands([]);
        setRadio([]);
      }

      dispatch(
        setCategories(
          Array.from(
            new Map(
              products.map(({ categoryId, category }) => [
                categoryId,
                { _id: categoryId, name: category },
              ]),
            ).values(),
          ),
        ),
      );
      dispatch(setBrands(Array.from(new Set(products.map((p) => p.brand)))));
    } else if (
      !categoriesQuery.isLoading &&
      !brandsQuery.isLoading &&
      selectedBrands.length === 0
    ) {
      dispatch(setCategories(categoriesQuery?.data?.data));
      dispatch(setBrands(brandsQuery?.data?.data));
    }
  }, [
    filteredProductQuery.isFetching,
    filteredProductQuery.isSuccess,
    products,
    keyword,
    selectedBrands.length,
    categoriesQuery.data,
    brandsQuery.data,
    dispatch,
  ]);

  console.log(categories);

  const handleBrandClick = async (value, brand) => {
    console.log(brand);

    const updatedSelectedBrands = value
      ? [...selectedBrands, brand]
      : selectedBrands.filter((b) => b !== brand);

    setPage(1);
    console.log(updatedSelectedBrands);
    dispatch(setSelectedBrands(updatedSelectedBrands));
    // await filteredProductQuery.refetch();
  };

  const handleCheck = (value, id) => {
    console.log(value);

    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);

    setPage(1);
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

  const handleReset = () => {
    // // window.history.replaceState({}, document.title);
    // dispatch(setChecked([]));
    // dispatch(setSelectedBrands([]));
    // dispatch(setRadio([]));
    // setPriceFilter("min");
    // setPriceFilter(0);
    // filteredProductQuery.refetch();
    window.location.reload();
  };

  return (
    <>
      <div className=" bg-gradient-to-tr from-black via-gray-600 to-gray-500 ">
        <div className="flex md:flex-row w-full ">
          <AnimatePresence>
            {!isFilterPanelClicked && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:hidden fixed left-0 top-14 z-10 flex items-center justify-center w-fit h-screen bg-black/50 rounded-r-md"
              >
                <div
                  role="button"
                  onClick={() => setIsFilterPanelClicked(true)}
                  aria-label="Open filters"
                  className="w-full h-full flex items-center justify-center cursor-pointer text-3xl  focus:outline-none"
                >
                  <ToolTipComp
                    Icon={<span className="text-5xl ">{">"}</span>}
                    Text="Open Filter Tab"
                    className={
                      "cursor-pointer text-black flex items-center justify-center w-fit h-fit py-1 "
                    }
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFilterPanelClicked && (
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-t from-black via-gray-600 to-gray-500   text-white rounded-xl z-10   fixed top-18 left-0 h-[93vh] overflow-hidden   lg:hidden  "
              >
                <div className="absolute right-0 h-full bg-black/50">
                  <div
                    role="button"
                    onClick={() => setIsFilterPanelClicked(false)}
                    aria-label="Open filters"
                    className="w-full h-full flex items-center justify-center cursor-pointer text-3xl  focus:outline-none"
                  >
                    <ToolTipComp
                      Icon={<span className="text-5xl ">{"<"}</span>}
                      Text="Open Filter Tab"
                      className={
                        "cursor-pointer text-black flex items-center justify-center w-fit h-fit py-1 "
                      }
                    />
                  </div>
                </div>
                <div className=" overflow-y-scroll overflow-x-hidden h-full px-4 pr-5 py-4 ">
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
                          checked={checked.includes(c._id)}
                          disabled={keyword ? true : false}
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
                  {products?.length !== 0 && (
                    <div className=" p-3 w-fit flex flex-col-reverse gap-y-3 xl:flex-row-reverse gap-x-2 items-center mt-4">
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
                  )}

                  <div className="w-full flex items-center justify-center  ">
                    <button
                      className={`bg-white px-10 py-1.5 text-black rounded-md my-10 
                cursor-pointer `}
                      onClick={handleReset}
                    >
                      Reset
                    </button>{" "}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gradient-to-t from-black via-gray-600 to-gray-500   text-white rounded-xl   sticky top-18 h-[93vh] overflow-hidden hidden lg:block ">
            <div className=" overflow-y-scroll overflow-x-hidden h-full px-4 py-4 ">
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
                      checked={checked.includes(c._id)}
                      disabled={keyword ? true : false}
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
              {products?.length !== 0 && (
                <div className=" p-3 w-fit flex flex-col-reverse gap-y-3 xl:flex-row-reverse gap-x-2 items-center mt-4">
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
              )}

              <div className="w-full flex items-center justify-center  ">
                <button
                  className={`bg-white px-10 py-1.5 text-black rounded-md my-10 
                cursor-pointer `}
                  onClick={handleReset}
                >
                  Reset
                </button>{" "}
              </div>
            </div>
          </div>

          {filteredProductQuery?.isLoading ? (
            <div className=" flex flex-1 justify-center items-center">
              <div className="flex items-center gap-x-4 h-fit  shadow-2xl w-fit bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl  ">
                <Spinner className={"h-10 w-10 "} />
                <span className="text-secondary font-semibold">
                  Fetching Products...
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 p-2 pl-8 md:p-10 mb-60  ">
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
                    <div className="w-full " key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
              </div>
              <div className="mt-20 ">
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
