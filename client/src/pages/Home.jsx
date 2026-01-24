import TopProducts from "@/components/TopProducts";
import { useGetProductsQuery } from "@/redux/api/productSlice";
import React from "react";
import { useParams } from "react-router-dom";

import HomeImage from "@/components/HomeImage";

const Home = () => {
  const { page, limit, keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({
    page,
    limit,
    keyword,
  });
  return (
    <div className="scroll-smooth">
      <HomeImage />
      <TopProducts />
    </div>
  );
};

export default Home;
