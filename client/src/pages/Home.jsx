import TopProducts from "@/components/TopProducts";
import React, { useEffect } from "react";

import HomeImage from "@/components/HomeImage";
import SubscriptionCard from "@/components/SubscriptionCard";
import Stats from "@/components/Stats";
import SlidingBanner from "@/components/SlidingBanner";
import CollectionCard from "@/components/CollectionCard";
import SaleCard from "@/components/SaleCard";
import NewProducts from "@/components/NewProducts";

const Home = () => {
  return (
    <div className="scroll-smooth">
      <HomeImage />
      <SlidingBanner />
      <SaleCard />
      <TopProducts />
      <CollectionCard />
      <NewProducts />
      <Stats />
      <SubscriptionCard />
    </div>
  );
};

export default Home;
