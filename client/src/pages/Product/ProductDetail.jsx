import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useGetProductByIdQuery } from "../../redux/api/productSlice.js";
import {
  useGetProductReviewsQuery,
  useGetProductReviewsNoPerRatingQuery,
  useGetYourReviewForProductQuery,
} from "../../redux/api/reviewSlice.js";
import StarRating from "@/components/StarRating.jsx";

import moment from "moment/moment.js";

import { FaShop } from "react-icons/fa6";
import { IoMdClock } from "react-icons/io";
import { BsBoxSeamFill } from "react-icons/bs";
import { GrBundle } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { IoStar } from "react-icons/io5";

import HeartIcon from "@/components/HeartIcon.jsx";
import RatingsPerReview from "@/components/RatingsPerReview.jsx";
import ReviewForm from "@/components/ReviewForm.jsx";

const ProductDetail = () => {
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [isReviewProductClicked, setIsReviewProductClicked] = useState(false);

  const { data, isLoading } = useGetProductByIdQuery(productId);
  const product = data?.data[0];

  const { userInfo } = useSelector((state) => state.auth);

  const { data: reviewData, isLoading: isReviewLoading } =
    useGetProductReviewsQuery({ productId, page: 1, limit: 6 });

  const { data: reviewsPerRating, isLoading: isReviewNoLoading } =
    useGetProductReviewsNoPerRatingQuery(productId);

  const { data: reviewOfUser } = useGetYourReviewForProductQuery(productId);

  const handleisReviewProductClicked = () => {
    if (!userInfo) toast.info("Please Log in to post/update review...");
    setIsReviewProductClicked(true);
  };

  return isLoading ? (
    <></>
  ) : (
    <div
      className={`m-3 sm:p-6 rounded-lg bg-gradient-to-l from-black via-gray-700 to-gray-600 relative`}
    >
      <div className="absolute top-2 right-2">
        <HeartIcon product={product} />
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <div className="rounded-lg overflow-hidden mt-4 md:mt-0">
          <img
            src={product.image}
            alt={`${product.name}.png`}
            className="w-full  xl:w-[38rem] lg:w-[32rem] md:w-[18rem] h-full "
          />
        </div>
        <div className="flex flex-col flex-1 text-white p-3 ml-3 space-y-2">
          <div className="flex flex-col space-y-1 mt-3">
            <p className="text-2xl font-medium">{product.name}</p>
            <div className="">
              <div className="text-sm">{product.description}</div>{" "}
            </div>
          </div>
          <p className="text-4xl text-green-600 font-semibold mt-8">
            ${product.price}.00
          </p>

          <div className="flex flex-col flex-1 justify-end space-y-4 mt-8 ">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0  sm:justify-evenly">
              <div className="flex space-x-1 items-center text-lg">
                <FaShop color="" />
                <span>Brand : </span>
                <p>{product.brand}</p>
              </div>
              <div className="flex space-x-1 items-center text-lg">
                <BsBoxSeamFill color="" />
                <span>Sold : </span>
                <p>{product.quantity} units</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0  sm:justify-evenly">
              <div className="flex space-x-1 items-center text-lg b">
                <IoMdClock color="white" />
                <span>Added :</span>
                <p>{moment(product.createdAt).fromNow()}</p>
              </div>
              <div className="flex space-x-1 items-center text-lg">
                <GrBundle color="" />
                <span>In Stock : </span>
                <p>{product.countInStock}</p>
              </div>
            </div>
            {product.countInStock > 0 && (
              <div className="flex justify-center space-x-4 items-center mt-4">
                <label htmlFor="qty">Order-Quantity : </label>
                <select
                  name="qty"
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="bg-white rounded-xl px-6 py-1 text-black"
                >
                  {[...Array(product.countInStock).keys()].map((i) => (
                    <option
                      key={i + 1}
                      value={i + 1}
                      className="text-white bg-black scroll-smooth "
                    >
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-between items-center text-xl">
              <div className="flex items-center space-x-1 mt-3 ">
                <div>{product.rating}</div>
                <StarRating rating={product.rating} />
              </div>
              <div>
                <p>{product.numReviews} reviews...</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center text-xl">
            <button
              className={`bg-gradient-to-r from-black via-gray-700 to-gray-600 px-14 py-2 text-white rounded-md cursor-pointer flex  items-center space-x-2 `}
              type="button"
              // onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              <span>Add to Cart</span>
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
      {/* Review Section: */}
      <div className="text-white mt-10 flex flex-col flex-1 ">
        <div className="text-2xl font-semibold ml-10">Rating & Reviews</div>
        <div>
          {isReviewLoading ? (
            <>...</>
          ) : (
            <div className="flex flex-col mt-12 space-y-12 w-full">
              <div className="flex w-full">
                <div className="flex flex-col space-y-10 sm:space-y-0 sm:flex-row w-full justify-center items-center  sm:space-x-[15vw] ">
                  <div className="flex flex-col space-y-1 ">
                    <div className="flex items-center space-x-2 ">
                      <span className="font-bold text-2xl">
                        {product.rating}
                      </span>
                      <IoStar className="font-bold" size={25} />
                    </div>
                    <div className="text-center">
                      {product.numReviews} reviews
                    </div>
                  </div>
                  {isReviewNoLoading ? (
                    <>Loading</>
                  ) : (
                    <>
                      <RatingsPerReview
                        data={reviewsPerRating?.data}
                        totalReviews={product?.numReviews}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="w-full mt-20">
                <div className="w-full flex items-center justify-around">
                  <div className="text-2xl font-semibold ">
                    Recent Reviews:{" "}
                  </div>
                  <button
                    className="bg-gradient-to-tr from-black via-gray-700 to-gray-600 text-white px-14 py-2 text-black rounded-md cursor-pointer font-bold"
                    onClick={handleisReviewProductClicked}
                  >
                    {reviewOfUser?.status === 200
                      ? "Update Your Review"
                      : "Review Product"}
                  </button>
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
                  <Link
                    className="bg-gradient-to-l from-black via-gray-700 to-gray-600 px-14 py-2 text-white rounded-md cursor-pointer"
                    to={"/product-review/:id"}
                  >
                    All {product.numReviews} reviews
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Review Post/Update */}
      {isReviewProductClicked && userInfo && (
        <ReviewForm
          toogle={setIsReviewProductClicked}
          productId={productId}
          reviewOfUser={reviewOfUser?.data || null}
        />
      )}
    </div>
  );
};

export default ProductDetail;
