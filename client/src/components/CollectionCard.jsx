import { useGetProductCountInCategoryQuery } from "@/redux/api/productSlice";
import { useMemo } from "react";

import { AnimatePresence, motion } from "motion/react";

import Footwear from "../assets/Footwear.jpg";
import Fashion from "../assets/Fashion.jpg";
import Fitness from "../assets/Fitness.jpg";
import HomeItems from "../assets/homeItems.jpg";
import Accessories from "../assets/Accessories.jpg";
import Tech from "../assets/Tech.jpg";
import HoverCard from "./HoverCard";
import { Link } from "react-router-dom";

const CollectionCard = () => {
  const { data } = useGetProductCountInCategoryQuery();
  const productCountByCategory = data?.data;
  console.log(productCountByCategory);

  const categories = useMemo(() => {
    const displayCategories = [
      {
        name: "Footwear",
        keywords: ["shoes", "sandals", "slippers"],
        count: 0,
        image: Footwear,
      },
      {
        name: "Fashion",
        keywords: ["shirts", "pants", "jeans"],
        count: 0,
        image: Fashion,
      },
      {
        name: "Accessories",
        keywords: ["watch", "necklace", "chain", "ring"],
        count: 0,
        image: Accessories,
      },
      {
        name: "Tech",
        keywords: ["phone", "laptop", "camera", "mouse"],
        count: 0,
        image: Tech,
      },
      { name: "Fitness", keywords: ["gym"], count: 0, image: Fitness },
      { name: "Home Items", keywords: ["sofa"], count: 0, image: HomeItems },
    ];

    productCountByCategory?.forEach((each) => {
      displayCategories.forEach((eachOne) => {
        if (
          eachOne.keywords.some((keyword) =>
            each.category?.toLowerCase().includes(keyword.toLowerCase()),
          )
        ) {
          eachOne.count += each.count;
        }
      });
    });

    return displayCategories.sort(({ count: a }, { count: b }) => b - a);
  }, [productCountByCategory]);

  console.log(categories);

  return (
    <div className="bg-[#0e0d0b] w-[100%]  text-secondary   px-8 py-20 font-alegreya pb-30 ">
      <div className="font-alegreya text-sm ">BROWSE BY CATEGORY</div>
      <div className="w-full  flex justify-between  sm:items-end mt-4 mb-20 text-5xl">
        <h2 className=" font-light text-secondary leading-[1.05]">
          Shop <span className="italic text-amber-600">the</span>
          <br />
          Collection
        </h2>
        <Link
          className="text-sm  underline underline-offset-4 text-center tracking-widest"
          to={"/shop"}
        >
          VIEW ALL CATEGORIES
        </Link>
      </div>
      <div className="w-full grid md:grid-cols-2  gap-x-10 gap-y-10 md:px-4 lg:px-10 ">
        <div className="w-full grid  grid-cols-1  gap-y-10  ">
          <HoverCard data={categories[0]} />
          <HoverCard data={categories[categories.length - 1]} />
        </div>
        <div className="w-full  grid grid-cols-1  grid-rows-1  lg:grid-cols-2 gap-4">
          {categories.slice(1, categories.length - 1).map((each, index) => (
            <HoverCard data={each} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
