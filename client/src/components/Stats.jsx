import React from "react";
import { NumberTicker } from "./ui/number-ticker";
import { number } from "motion";
import { useGetTopAppReviewsQuery } from "@/redux/api/reviewSlice";
import SlidingTestimonials from "./SlidingTestimonials";

const sections = [
  { number: 11, highlight: "K+", name: "HAPPY CUSTOMERS" },
  { number: 500, highlight: "+", name: "PRODUCTS" },
  { number: 98, highlight: "%", name: "SATISFACTION RATE" },
  { number: 24, highlight: "/7", name: "CUSTOMER SUPPORT" },
];

const Stats = () => {
  const { data, isLoading } = useGetTopAppReviewsQuery();
  const topReviews = data?.data;

  return (
    <div className="w-[100%] bg-[#0e0d0b] min-h-screen flex flex-col justify-between py-20 font-alegreya p-10 gap-y-20">
      <div className="flex flex-col gap-y-6 ">
        <span className="tracking-[1.4px] text-sm">WHAT PEOPLE SAY</span>
        <h2 className=" font-light text-secondary leading-[1.05] text-5xl">
          <span className="italic text-amber-600">Loved</span> by
          <br />
          thousands
        </h2>{" "}
      </div>
      {!isLoading && <SlidingTestimonials topReviews={topReviews} />}
      <div className="flex  w-full  items-center justify-center flex-wrap gap-4 p-10 mt-4">
        {sections.map((eachSection, index) => (
          <div
            className="bg-black text-secondary rounded-md flex flex-col w-80 h-40 items-center justify-center gap-y-3 font-alegreya"
            key={index}
          >
            <div className="flex text-5xl tracking-tighter ">
              <NumberTicker
                value={eachSection.number}
                className={"text-white"}
              />
              <span className="text-orange-400">{eachSection.highlight}</span>
            </div>
            <p className="text-lg ">{eachSection.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
