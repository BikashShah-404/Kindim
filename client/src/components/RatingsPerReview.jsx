import React from "react";
import { IoStar } from "react-icons/io5";

const RatingsPerReview = ({ data: reviewsPerRating, totalReviews }) => {
  const reviewsStructure = [
    {
      rating: 1,
      count: 0,
      percentage: 0,
      colorToFill: "red",
    },
    {
      rating: 2,
      count: 0,
      percentage: 0,
      colorToFill: "orange",
    },
    {
      rating: 3,
      count: 0,
      percentage: 0,
      colorToFill: "green",
    },
    {
      rating: 4,
      count: 0,
      percentage: 0,
      colorToFill: "green",
    },
    {
      rating: 5,
      count: 0,
      percentage: 0,
      colorToFill: "green",
    },
  ];

  reviewsPerRating?.map((reviewPerRating) => {
    const check = reviewsStructure[reviewPerRating.rating - 1];
    if (reviewPerRating.rating === check.rating) {
      check.count = reviewPerRating.count;
      check.percentage = (check.count / totalReviews) * 100;
    }
  });

  console.log(reviewsStructure);

  return (
    <div className="flex flex-col space-y-4 ">
      {reviewsStructure.reverse().map((eachRating) => (
        <div className="flex space-x-4 items-center" key={eachRating.rating}>
          <p className="flex items-center space-x-0.5">
            <span>{eachRating.rating}</span>
            <IoStar className="font-bold" size={12} />
          </p>
          <div className="w-60 h-1.5 bg-white rounded-md">
            <div
              className={`h-full rounded-lg`}
              style={{
                width: `${eachRating.percentage}%`,
                backgroundColor: `${eachRating.colorToFill}`,
              }}
            ></div>
          </div>
          <p className="">{eachRating.count} reviews</p>
        </div>
      ))}
    </div>
  );
};

export default RatingsPerReview;
