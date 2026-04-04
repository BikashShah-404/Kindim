import { useGetTopSellingProductQuery } from "@/redux/api/productSlice";
import { useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SaleCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useGetTopSellingProductQuery();
  const product = data?.data;
  console.log(product);

  return (
    <div className="min-h-[82vh] w-[100%] flex flex-col-reverse md:flex-row  items-center bg-gradient-to-br w-[100%] from-black via-gray-700 gap-y-10  to-gray-950 font-alegreya px-6 md:px-16 gap-10 py-16 md:py-0 ">
      <div className=" flex flex-col gap-y-10 w-full md:w-1/2 justify-center  ">
        <p className="bg-white/90 text-primary font-semibold w-fit px-4 py-2 tracking-widest rounded-b-sm">
          LIMITED TIME
        </p>
        <div className="text-4xl sm:text-5xl w-full  md:w-1/2 flex flex-col gap-y-4">
          <p>
            Up to 40<span className="text-amber-600">%</span> off
          </p>
          <p>this season's </p>
          <p>BEST SELLERS</p>
        </div>
        <p className="">
          Don't miss out on our biggest sale of the season. Carefully curated
          pieces at prices that make sense.
        </p>
        <div className="w-full  flex justify-center sm:justify-normal">
          <button
            className={`bg-gradient-to-tr from-black via-gray-700 to-gray-600 px-4 sm:px-14 py-2 text-white rounded-md cursor-pointer flex  items-center space-x-2 w-fit hover:bg-gradient-to-bl font-semibold tracking-wider  sm:text-lg `}
            type="button"
            onClick={() => navigate("/shop")}
          >
            <span>SHOP THE SALE</span>
          </button>{" "}
        </div>
      </div>
      <div
        className="w-full sm:w-2/3 md:w-1/2  cursor-pointer flex justify-center items-center "
        onClick={() => navigate(`/product/${product.product._id}`)}
      >
        <div
          className=" relative md:w-full lg:w-2/3 md:h-[55vh]  rounded-md overflow-hidden "
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute px-3 py-1 rounded-r-md top-2 left-0 bg-amber-700 text-secondary font-semibold tracking-wider">
            SALE
          </div>
          <img
            src={product?.product.image}
            alt=""
            className="w-full h-full object-cover"
          />
          <AnimatePresence>
            {isHovered && (
              <motion.p
                className="text-white absolute bottom-0  font-alegreya w-full h-fit bg-black/60   flex flex-col items-center justify-center rounded-t-2xl py-2"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/product/${product.product._id}`)}
              >
                <span className="text-4xl">{product.product.name}</span>
                <span className="flex gap-x-1 items-center justify-center text-lg">
                  {product.totalSold}{" "}
                  <span className="text-amber-600 text-xl font-semibold">
                    buys
                  </span>
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;
