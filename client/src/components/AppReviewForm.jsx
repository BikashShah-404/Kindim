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
  useAddAppReviewMutation,
  useUpdateAppReviewMutation,
} from "@/redux/api/reviewSlice";
import { toast } from "react-toastify";

const ReviewForm = ({ toogle, appReviewOfUser }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
  } = useForm({
    defaultValues: {
      review: appReviewOfUser?.review || null,
      rating: appReviewOfUser?.rating || null,
    },
  });

  const [postReview] = useAddAppReviewMutation();
  const [updateReview] = useUpdateAppReviewMutation();
  const handleReviewPost = async (data) => {
    if (appReviewOfUser) {
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
          reviewId: appReviewOfUser._id,
          data: payload,
        }).unwrap();

        if (response.status === 200) {
          toast.success("App Review Updated...");
          toogle(false);
        }
      }
    } else {
      // postReview:
      const response = await postReview({ data }).unwrap();
      console.log(response);
      if (response.status === 200) {
        toast.success("App Review Posted...");
        toogle(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-35  overflow-hidden z-10">
      <form onSubmit={handleSubmit(handleReviewPost)} className="w-2/4 ">
        <Card
          className={
            "bg-linear-to-r text-secondary  from-black via-gray-800 to-gray-900"
          }
        >
          <CardHeader>
            <CardTitle>
              {appReviewOfUser ? "Update Review" : "Post Review"}
            </CardTitle>
            <CardDescription>How was your Kindim Experience?</CardDescription>
            <CardAction>
              <ToolTip
                Icon={<MdCancel size={28} />}
                Text={"Cancel"}
                onClick={() => toogle(false)}
                type={"button"}
                className={"text-black"}
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
              className="bg-black px-14 py-2 text-white rounded-md cursor-pointer"
              disabled={isSubmitting}
            >
              {appReviewOfUser ? "Update Review" : "Post Review"}
            </button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ReviewForm;
