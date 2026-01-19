import PaginationComp from "@/components/Pagination.jsx";
import StarRating from "@/components/StarRating";
import { useGetProductReviewsQuery } from "@/redux/api/reviewSlice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductAllReview = () => {
  const { id: productId } = useParams();
  console.log(productId);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("recent");

  const {
    data: reviewData,
    isLoading,
    refetch,
  } = useGetProductReviewsQuery({
    productId,
    page,
    limit,
    keyword,
  });

  console.log(reviewData);

  useEffect(() => {
    refetch();
  }, [keyword, refetch]);

  return (
    <div className="m-3 sm:p-6 rounded-lg bg-gradient-to-l from-black via-gray-700 to-gray-600 relative">
      {!isLoading && (
        <div className=" flex flex-col space-y-18">
          <div className="w-full mt-20">
            <div className="w-full flex flex-col sm:flex-row space-y-10 sm:space-y-0 items-center justify-around">
              <div className="text-2xl font-semibold text-white ">
                All Reviews :
              </div>
              <select
                className="bg-gradient-to-tr from-black via-gray-700 to-gray-600 text-white px-14 py-2 text-black rounded-md cursor-pointer font-bold cursor-pointer outline-0"
                defaultValue={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              >
                <option
                  value="recent"
                  className="bg-white/80 text-black cursor-pointer"
                >
                  Most Recent
                </option>
                <option
                  value="positive"
                  className="bg-white/80 text-black cursor-pointer "
                >
                  Positive First
                </option>
                <option
                  value="negative"
                  className="bg-white/80 text-black cursor-pointer "
                >
                  Negative First
                </option>
              </select>
            </div>
            <div className=" w-full flex flex-col items-center mt-8 py-10 space-y-12">
              {reviewData &&
                reviewData?.data?.reviews?.map((eachReview) => (
                  <div
                    key={eachReview._id}
                    className="flex space-x-1 w-11/12  sm:min-w-lg sm:max-w-2xl shadow-2xl bg-white/80 shadow-accent-foreground p-4 rounded-lg text-black relative"
                  >
                    <div className=" w-14 h-14 rounded-full overflow-hidden">
                      <img
                        src={
                          eachReview.reviewBy.profilePic
                            ? eachReview.reviewBy.profilePic
                            : ""
                        }
                        alt={`${eachReview.reviewBy.username}.png`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="absolute top-1 right-1">
                      {new Date(eachReview.updatedAt).toDateString()}
                    </div>
                    <div className="flex flex-col flex-1 space-y-5  ">
                      <p className="font-semibold">
                        {eachReview.reviewBy.username}
                      </p>
                      <div className="px-4">{eachReview.review}</div>
                      <div className="bg-gradient-to-l from-black via-gray-700 to-gray-600 w-fit px-6 py-2 rounded-xl">
                        <StarRating rating={eachReview.rating} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full p-2 flex items-center justify-center">
            <PaginationComp
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              total={reviewData?.data?.totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAllReview;
