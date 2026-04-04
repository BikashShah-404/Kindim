import HeartIcon from "@/components/HeartIcon";
import StarRating from "@/components/StarRating";
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className=" relative bg-gray-900/90 p-2 rounded-xl w-full overflow-hidden ">
      <Link
        to={`/product/${product._id}`}
        className="flex flex-col md:flex-row "
      >
        <div className=" md:w-60 md:h-70 max-h-80 rounded-md overflow-hidden self-center relative">
          <img
            src={product.image}
            alt={`${product.image}.png`}
            className=" w-full  h-full object-cover"
          />
          <span className="px-4 py-1 rounded-lg bg-gradient-to-r from-black via-gray-600 to-gray-500 text-white absolute right-1 bottom-1">
            {product.brand}
          </span>
        </div>
        <div className="flex flex-col md:w-md pl-6 gap-y-6 ">
          <div className="flex flex-col ">
            <div className="text-xl mt-4">{product.name} </div>
            <div className="flex space-x-1 items-center">
              <StarRating rating={product.rating} />
              <span>{product.rating}</span>
            </div>
          </div>
          <div className=" text-sm   flex-1 flex flex-col  justify-center w-fit   ">
            {product.description.split(",").map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <div>{product.numReviews} reviews</div>
          <div className="font-bold text-xl md:absolute bottom-4 right-4 flex flex-col items-center text-green-400">
            ${product.price}.00
          </div>
        </div>
      </Link>
      <div className="absolute right-2 top-2">
        <HeartIcon product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
