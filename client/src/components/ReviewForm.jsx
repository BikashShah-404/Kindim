import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Input from "./Input";
import { useForm } from "react-hook-form";
import ToolTip from "./Tooltip";
import { MdCancel } from "react-icons/md";
import {
  usePostReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/api/reviewSlice";
import { toast } from "react-toastify";

const ReviewForm = ({ toogle, productId, reviewOfUser }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
  } = useForm({
    defaultValues: {
      review: reviewOfUser?.review || null,
      rating: reviewOfUser?.rating || null,
    },
  });

  const [postReview] = usePostReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const handleReviewPost = async (data) => {
    if (reviewOfUser) {
      // updateReview
      if (Object.keys(dirtyFields).length === 0) {
        toast.info("Nothing to Update");
        return;
      } else {
        const payload = {};
        Object.keys(dirtyFields).map((eachDirtyField) => {
          payload[eachDirtyField] = data[eachDirtyField];
        });
        const response = await updateReview({
          reviewId: reviewOfUser._id,
          productId,
          data: payload,
        }).unwrap();

        if (response.status === 200) {
          toast.success("Review Updated...");
          toogle(false);
        }
      }
    } else {
      // postReview:
      const response = await postReview({ productId, data }).unwrap();
      console.log(response);
      if (response.status === 200) {
        toast.success("Review Posted...");
        toogle(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-35  overflow-hidden">
      <form onSubmit={handleSubmit(handleReviewPost)} className="w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>
              {reviewOfUser ? "Update Review" : "Post Review"}
            </CardTitle>
            <CardDescription>Type your review and rating</CardDescription>
            <CardAction>
              <ToolTip
                Icon={<MdCancel size={28} />}
                Text={"Cancel"}
                onClick={() => toogle(false)}
                type={"button"}
              />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex flex-col -space-y-3">
              <Input
                className=""
                label="Review :"
                type="text"
                placeholder="Enter review..."
                {...register("review", {
                  required: "Review is required",
                })}
              />
              {errors.review && (
                <p className="text-red-700 ml-6 text-start  w-full">
                  {errors.review.message}...
                </p>
              )}{" "}
            </div>
            <div className="flex flex-col -space-y-3">
              <Input
                className=""
                label="Rating :"
                type="text"
                placeholder="Enter rating (1-5)"
                {...register("rating", {
                  required: "Rating is required",
                  min: { value: 1, message: "Rating must be between 1-5" },
                  max: { value: 5, message: "Rating must be between 1-5" },
                  validate: (v) =>
                    typeof +v === "number" && !isNaN(+v)
                      ? true
                      : "Needs to be a number",
                })}
              />
              {errors.rating && (
                <p className="text-red-700 ml-6 text-start  w-full">
                  {errors.rating.message}...
                </p>
              )}{" "}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              type="submit"
              className="bg-black px-14 py-2 text-white rounded-md"
              disabled={isSubmitting}
            >
              {reviewOfUser ? "Update Review" : "Post Review"}
            </button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ReviewForm;
