import { Spinner } from "@/components/ui/spinner";
import { useCompletePaymentQuery } from "@/redux/api/paymentSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    data: completePayment,
    isLoading,
    isError,
    isSuccess,
  } = useCompletePaymentQuery({
    data: searchParams.get("data"),
  });
  console.log(completePayment);

  if (isSuccess) {
    toast.success("Payment Successfull ! Redirecting to Orders Page");
    setTimeout(() => {
      navigate(`/orders`, {
        state: { scrollToOrder: completePayment.data.orderId },
      });
    }, 2000);
  }

  return (
    <div className=" h-screen flex items-center justify-center bg-gradient-to-tr from-black via-gray-600 to-gray-500 ">
      {isLoading ? (
        <div className="flex items-center gap-x-4 shadow-2xl bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl ">
          <Spinner className={"h-10 w-10 "} />
          <span className="text-secondary font-semibold">
            Processing Payment
          </span>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-x-4 shadow-2xl bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl ">
          <span className="text-secondary font-semibold text-lg">
            Oops! Something went wrong
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-x-4 shadow-2xl bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl ">
          <span className="text-secondary font-semibold text-lg">
            Thank u for Shopping with us
          </span>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
