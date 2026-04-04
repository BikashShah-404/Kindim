import { useGetNewProductQuery } from "@/redux/api/productSlice";
import React from "react";

import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import HeartIcon from "./HeartIcon";

const HeroCard = ({ product }) => (
  <div className="relative overflow-hidden cursor-pointer bg-black/50 group row-span-2 font-alegreya rounded-lg ">
    <div className="w-full min-h-[600px] flex items-center justify-center   transition-transform duration-700 ease-out group-hover:scale-[1.05]">
      <img
        src={product?.image}
        alt={product?.name}
        className="w-full h-full object-cover absolute inset-0"
      />
    </div>
    <Link to={`/product/${product?._id}`}>
      <span className="absolute top-2  bg-amber-700 text-white text-xs tracking-widest px-2.5 py-1.5 uppercase font-semibold z-10 rounded-r-md">
        Just In
      </span>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col gap-y-2 justify-end p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
        <div>
          <p className="text-xs tracking-wider uppercase mb-1.5">
            {product?.brand}
          </p>
          <div className="">
            <StarRating rating={product?.rating} />
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <div className="flex flex-col">
            <p className="flex  text-3xl font-normal text-[#f0ebe0] leading-tight ">
              {product?.name}
            </p>
            <span className="text-xl font-medium text-green-400">
              ${product?.price}
            </span>
          </div>
          <div className="">
            <HeartIcon product={product} className="z-50" />
          </div>
        </div>
      </div>
    </Link>
  </div>
);

const SmallCard = ({ product }) => (
  <div className="relative overflow-hidden cursor-pointer bg-[#1a1814] group rounded-lg">
    <div className="w-full min-h-[300px] flex items-center justify-center   transition-transform duration-700 ease-out group-hover:scale-[1.05] relative">
      <img
        src={product?.image}
        alt={product?.name}
        className="w-full h-full object-cover absolute inset-0"
      />
    </div>
    <Link to={`/product/${product?._id}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col gap-y-2 justify-end p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
        <div>
          <p className="text-xs tracking-wider uppercase mb-1.5">
            {product?.brand}
          </p>
          <div className="">
            <StarRating rating={product?.rating} />
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <div className="flex flex-col">
            <p className="flex  text-xl font-normal text-[#f0ebe0] leading-tight ">
              {product?.name}
            </p>
            <span className="text-xl font-medium text-green-400">
              ${product?.price}
            </span>
          </div>
          <div className=" ">
            <HeartIcon product={product} className="z-50 " />
          </div>
        </div>
      </div>
    </Link>
  </div>
);

const StripCard = ({ product }) => (
  <Link to={`/product/${product?._id}`}>
    <div className="bg-[#141210] p-6 flex items-center gap-4 cursor-pointer border-t border-white/[0.04] hover:bg-[#1a1814] transition-colors rounded-lg font-alegreya">
      <div className="w-20 h-20 bg-[#1e1a14] flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex-1 text-secondary">
        <p className="text-xs  uppercase ">{product?.brand}</p>
        <p className="text-sm  text-[#f0ebe0] mb-1">{product?.name}</p>
        <p className="text-[13px] font-medium text-green-500">
          ${product?.price}
        </p>
      </div>
      <span className="text-xs tracking-[1.5px] uppercase bg-black text-amber-600 border border-white px-2 py-1 flex-shrink-0 rounded">
        New
      </span>
    </div>
  </Link>
);

const NewProducts = () => {
  const { data } = useGetNewProductQuery();
  const products = data?.data || [];
  console.log(products);

  const heroProduct = products[0];
  const gridProducts = products.slice(1, 5);
  const stripProducts = products.slice(5, 8);

  return (
    <section className="bg-gradient-to-br w-[100%] from-black via-gray-700 to-gray-950 text-secondary  px-4 sm:px-10 lg:px-16 py-20 relative  font-alegreya">
      <div className="flex items-center sm:items-end justify-between mb-16 ">
        <div className="w-full">
          <p className="text-sm tracking-[3px] uppercase text-amber-600 mb-3.5">
            Just dropped
          </p>
          <div className="w-full flex items-center justify-between ">
            <h2 className=" text-4xl sm:text-5xl  leading-[1.05]">
              New <span className="italic text-amber-600/80">&</span>
              <br />
              Notable
            </h2>
            <Link
              to="/shop"
              className="text-xs sm:text-sm  uppercase underline underline-offset-4 text-center tracking-widest "
            >
              View all arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* main bento grid */}
      <div className="grid sm:grid-cols-3 gap-2">
        {heroProduct && <HeroCard product={heroProduct} />}
        {gridProducts.map((product) => (
          <SmallCard key={product._id} product={product} />
        ))}
      </div>

      {/* bottom strip */}
      {stripProducts.length > 0 && (
        <div className="grid md:grid-cols-3 gap-2 mt-2">
          {stripProducts.map((product) => (
            <StripCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewProducts;
