import { Spinner } from "@/components/ui/spinner";
import { useGetOwnOrdersQuery } from "@/redux/api/orderSlice";
import { useInitiatePaymentMutation } from "@/redux/api/paymentSlice";
import { redirectToEsewa } from "@/utils/esewaPayment";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Orders = () => {
  const { data: orders, isLoading, isError } = useGetOwnOrdersQuery();
  const [initiatePayment] = useInitiatePaymentMutation();

  const location = useLocation();
  const scrollToOrder = location.state?.scrollToOrder;

  console.log(orders);
  console.log(scrollToOrder);

  useEffect(() => {
    if (scrollToOrder) {
      const element = document.getElementById(`order-${scrollToOrder}`);
      console.log(element);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [scrollToOrder, orders]);

  const handlePayNow = async (placedOrder) => {
    try {
      const initiatedPayment = await initiatePayment({
        orderId: placedOrder._id,
        totalPrice: placedOrder.totalPrice,
      }).unwrap();
      if (initiatedPayment.status === 200) {
        redirectToEsewa(initiatedPayment);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message || "Something went wrong...");
    }
  };

  return (
    <motion.div
      className="min-h-[93.5vh]  bg-gradient-to-tr from-black via-gray-600 to-gray-500"
      initial={{
        scale: 0,
        opacity: 0,
        transformOrigin: "bottom right",
      }}
      animate={{
        scale: 1,
        opacity: 1,
        transformOrigin: "bottom right",
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transformOrigin: "bottom right",
      }}
      transition={{ duration: 0.6 }}
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center gap-x-4">
          <Spinner className={"h-8 w-8 "} />
          <span className="text-secondary text-lg animate-pulse">
            Loading Orders...
          </span>
        </div>
      ) : isError ? (
        <div className="h-full flex items-center justify-center gap-x-4">
          Something went wrong!
        </div>
      ) : (
        <div className=" flex flex-col  py-14 px-8 text-secondary text-2xl font-semibold">
          <span>Orders</span>
          <div className=" flex    flex-col items-center justify-center py-10 gap-y-5 ">
            {orders.data.length === 0 ? (
              <div className="  flex flex-col gap-y-4 items-center justify-center w-full mt-60">
                No Orders Found
                <Link to={"/shop"}>
                  <button className="bg-gradient-to-br from-black via-gray-700 to-gray-600  px-6 py-2 rounded-lg text-white text-xl hover:bg-gradient-to-tl cursor-pointer">
                    Go Shopping
                  </button>
                </Link>
              </div>
            ) : (
              orders.data.map((eachOrder) => (
                <div
                  key={eachOrder._id}
                  id={`order-${eachOrder._id}`}
                  className=" bg-white/80 shadow-2xl flex gap-8 px-8 pt-10 pb-4 rounded-xl relative flex-wrap justify-center"
                >
                  <span className="absolute top-1 right-2 text-sm text-primary">
                    {new Date(eachOrder.createdAt).toDateString()}
                  </span>
                  <div className="flex flex-col text-primary bg-gray-500 p-2  h-fit  gap-y-3 rounded-lg">
                    <span className=" text-xl">Order-Items</span>
                    <div className=" p-2 rounded-xl flex flex-col gap-y-4">
                      {eachOrder.orderItems.map((eachOrderItem) => (
                        <div key={eachOrderItem._id} className="flex gap-x-4">
                          <div className="h-40 w-40  ">
                            <img
                              src={eachOrderItem.image}
                              alt={`${eachOrderItem.name}.png`}
                              className=" h-full w-full object-cover overflow-hidden rounded-xl"
                            />
                          </div>
                          <div className="flex flex-col text-lg">
                            <span>{eachOrderItem.name}</span>
                            <span className="text-green-400 text-xl">
                              ${eachOrderItem.price}.00
                            </span>
                            <span className="text-base">
                              Quantity : {eachOrderItem.qty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col text-primary bg-gray-500 p-2  gap-y-3 rounded-lg text-base h-fit ">
                    <span className="text-xl">Details : </span>
                    <div className="flex flex-col gap-y-2">
                      <span>
                        Shipping Address :{" "}
                        {`${eachOrder.shippingAddress.address}, ${eachOrder.shippingAddress.city}, ${eachOrder.shippingAddress.country}`}
                      </span>
                      <span>Payment Method : {eachOrder.paymentMethod}</span>
                      <span>
                        Items Price :{" "}
                        <span className="text-green-400">
                          ${eachOrder.itemsPrice}.00
                        </span>
                      </span>
                      <span>
                        Shipping Price :{" "}
                        <span className="text-green-400">
                          ${eachOrder.shippingPrice}.00
                        </span>
                      </span>
                      <span>
                        Tax Price :{" "}
                        <span className="text-green-400">
                          ${eachOrder.taxPrice}
                        </span>
                      </span>
                      <span>
                        Total Price :{" "}
                        <span className="text-green-400">
                          ${eachOrder.totalPrice}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col text-primary h-fit bg-gray-500 p-2  gap-y-3 rounded-lg text-base ">
                    <span className="text-xl">Order Status : </span>
                    <div className="flex flex-col gap-y-2">
                      <span>
                        Delivered :{" "}
                        {eachOrder.isDelivered ? "Already" : "Not Yet"}
                      </span>
                      <span>
                        Paid :{" "}
                        {eachOrder.isPaid ? (
                          "Yes"
                        ) : (
                          <button
                            className="bg-gradient-to-tr from-black via-gray-700 to-gray-600 text-white px-10 py-2 text-black rounded-md cursor-pointer font-bold"
                            onClick={() => handlePayNow(eachOrder)}
                          >
                            Pay Now
                          </button>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Orders;
