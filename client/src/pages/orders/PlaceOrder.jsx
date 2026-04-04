import { useCreateOrderMutation } from "@/redux/api/orderSlice";
import { useInitiatePaymentMutation } from "@/redux/api/paymentSlice";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { redirectToEsewa } from "@/utils/esewaPayment";
import { useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [
    initiatePayment,
    { isLoading: paymentInitiating, error: paymentInitiatizationError },
  ] = useInitiatePaymentMutation();

  const { cartItems } = cart;

  useEffect(() => {
    if (!userInfo) navigate("/login");
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const placedOrder = await createOrder({
        orderItems: cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      console.log(placedOrder);
      if (placedOrder.status === 200) {
        dispatch(clearCart());
        toast.success("Order Placed,Procedding to Checkout...");
        const initiatedPayment = await initiatePayment({
          orderId: placedOrder.data._id,
          totalPrice: placedOrder.data.totalPrice,
        }).unwrap();
        if (initiatedPayment.status === 200) {
          redirectToEsewa(initiatedPayment);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message || "Something went wrong...");
    }
  };

  return (
    <div className="flex flex-col p-2 md:p-10 min-h-screen space-y-10 bg-gradient-to-br from-black via-gray-700 to-gray-600 text-secondary ">
      {cartItems.length === 0 ? (
        <div className="flex flex-col space-y-10 flex-1 items-center justify-center text-3xl font-semibold">
          <p>The Cart is Empty...</p>
        </div>
      ) : (
        <>
          <div className=" text-2xl font-semibold">Order Summary</div>
          <div className="flex flex-col gap-y-4">
            <div className="text-secondary font-semibold text-lg ml-2 ">
              Products Summary
            </div>
            <div className="flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-8 ">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem._id}
                  className=" flex flex-col md:flex-row gap-y-6 md:gap-y-0 md:gap-x-4 bg-black/50 px-6 py-4 rounded-xl text-white   "
                >
                  <div className="w-full md:w-[10rem] h-[10rem]">
                    <img
                      src={cartItem.image}
                      alt={cartItem.name}
                      className="w-full h-full object-cover rounded-lg  "
                    />
                  </div>
                  <div className="flex flex-1 ">
                    <div className="flex flex-1 justify-between space-x-6">
                      <div className="flex flex-col space-y-1 w-full">
                        <Link
                          className="underline underline-offset-2 font-semibold text-lg "
                          to={`/product/${cartItem._id}`}
                        >
                          {cartItem.name}
                        </Link>
                        <div>{cartItem.brand}</div>
                        <div className="mt-2 text-xl text-green-400 font-semibold">
                          ${cartItem.price}
                        </div>
                        <div className="">Quantity : {cartItem.qty}</div>
                        <div className="self-end flex-1 text-xl text-green-400 font-bold ">
                          <span className="text-secondary">Total Price : </span>
                          ${cartItem.qty * cartItem.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className=" flex flex-col gap-y-3 md:space-y-0  bg-black/50 px-6 py-4 rounded-xl text-white w-full sm:max-w-md   ">
              <div className="text-secondary font-semibold ">Cost Summary</div>
              <div className="w-full flex justify-between  mt-4">
                <p>Items Price</p>
                <p className="font-semibold text-green-400">
                  ${cart.itemsPrice}.00
                </p>
              </div>
              <div className="w-full flex justify-between ">
                <p>Shipping Price</p>
                <p className="font-semibold text-green-400">
                  ${cart.shippingPrice}.00
                </p>
              </div>
              <div className="w-full flex justify-between ">
                <p>Tax Price</p>
                <p className="font-semibold text-green-400">${cart.taxPrice}</p>
              </div>
              <div className="w-full flex justify-between ">
                <p>Total Price</p>
                <p className="font-semibold text-green-400">
                  ${cart.totalPrice}
                </p>
              </div>
            </div>

            <div className=" flex flex-col gap-y-3 md:space-y-0  bg-black/50 px-6 py-4 rounded-xl text-white w-full sm:max-w-md     ">
              <div className="text-secondary font-semibold">
                Shipping Details
              </div>
              <div className="w-full flex justify-between mt-4">
                <p>Address</p>
                <p className="font-semibold ">{cart.shippingAddress.address}</p>
              </div>
              <div className="w-full flex justify-between ">
                <p>Country</p>
                <p className="font-semibold ">{cart.shippingAddress.country}</p>
              </div>
              <div className="w-full flex justify-between ">
                <p>City</p>
                <p className="font-semibold ">{cart.shippingAddress.city}</p>
              </div>
              <div className="w-full flex justify-between ">
                <p>Postal-Code</p>
                <p className="font-semibold ">
                  {cart.shippingAddress.postalCode}
                </p>
              </div>
            </div>
            <div className=" flex flex-col space-y-6 md:space-y-0 md:space-x-4 bg-black/50 px-6 py-4 rounded-xl text-white  w-full sm:max-w-xs h-fit   ">
              <div className="text-secondary font-semibold">Payment Method</div>
              <div className="w-full flex justify-between  mt-4">
                <p>Method</p>
                <p className="font-semibold ">{cart.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center my-3 mb-20">
            <button
              className={`bg-gradient-to-r from-black via-gray-700 to-gray-600 px-8 md:px-36 py-2 text-white rounded-md cursor-pointer flex items-center space-x-2  hover:bg-gradient-to-l  `}
              type="button"
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || isLoading}
            >
              <span className="">
                Pay with {new String(cart.paymentMethod).toUpperCase()}
              </span>
              <FaPaperPlane />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaceOrder;
