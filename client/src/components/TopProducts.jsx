import TopProductCard from "@/pages/Product/TopProductCard";
import { useGetTopProductQuery } from "@/redux/api/productSlice";
import { Link } from "react-router-dom";

import { motion } from "motion/react";
import ScrollCarousel from "./ScrollCarousel";

const TopProducts = () => {
  const { data } = useGetTopProductQuery();

  return (
    <div className="">
      {data ? (
        <ScrollCarousel topProducts={data.data} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-700 to-gray-600"></div>
      )}
    </div>
  );
};

export default TopProducts;
