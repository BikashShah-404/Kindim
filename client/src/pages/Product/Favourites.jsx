import { useSelector } from "react-redux";
import { selectFavouriteProduct } from "@/redux/favourites/favouriteSlice";
import StarRating from "@/components/StarRating";

import { motion } from "motion/react";
import HeartIcon from "@/components/HeartIcon";
import { Link } from "react-router-dom";

const Favourites = () => {
  const favourites = useSelector(selectFavouriteProduct);
  return (
    <div className="w-full h-screen p-10 flex flex-col ">
      <div className=" text-2xl mt-8 font-semibold ">
        <p>Favourite Products:</p>
      </div>
      <div className=" flex flex-row flex-1 flex-wrap py-10 gap-11 justify-center">
        {favourites.length === 0 ? (
          <div className="w-full flex items-center justify-center text-3xl">
            Looks Lonely Here...
          </div>
        ) : (
          <>
            {favourites.map((product) => (
              <motion.div
                className="flex flex-col relative"
                key={product._id}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Link to={`/product/${product._id}`}>
                  <div className=" flex flex-col max-w-xs  sm:min-w-md sm:max-w-md p-3 pr-5 bg-black/91 rounded-lg text-white space-y-1 relative hover:shadow-2xl min-h-[40vh] ">
                    <div className="w-full h-60 overflow-hidden rounded-xl mt-4">
                      <img
                        src={product.image}
                        alt={`$product.name}.png`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col -space-y-1">
                      <div className="font-semibold">{product?.name}</div>
                      <div className="truncate text-sm">
                        {product.description}
                      </div>
                    </div>
                    <div className="flex justify-between mt-10">
                      <div className="flex flex-row space-x-1  items-center">
                        <div>{product.rating}</div>
                        <StarRating rating={product.rating} />
                      </div>
                      <div className=" font-bold text-lg   text-green-500">
                        ${product.price}.00
                      </div>{" "}
                    </div>
                  </div>
                </Link>
                <div className="absolute right-1 top-1">
                  <HeartIcon product={product} />
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Favourites;
