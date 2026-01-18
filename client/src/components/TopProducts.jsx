import TopProductCard from "@/pages/Product/TopProductCard";
import { useGetTopProductQuery } from "@/redux/api/productSlice";
import { Link } from "react-router-dom";

import { motion } from "motion/react";
import ScrollCarousel from "./ScrollCarousel";

const TopProducts = () => {
  const { data } = useGetTopProductQuery();

  return (
    <div className="">
      {data && <ScrollCarousel title="Top Products" topProducts={data.data} />}
    </div>
  );
};

export default TopProducts;
