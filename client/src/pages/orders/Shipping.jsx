import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import {
  saveShippingAddress,
  savePaymentMethod,
} from "@/redux/features/cart/cartSlice";
import { useForm } from "react-hook-form";
import Input from "@/components/Input";

const Shipping = () => {
  const paymentMethods = ["esewa"];

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      address: shippingAddress?.address,
      city: shippingAddress?.city,
      postalCode: shippingAddress?.postalCode,
      country: shippingAddress.country,
    },
  });

  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("esewa");

  useEffect(() => {
    if (!userInfo) navigate("/login");
  }, [userInfo, navigate]);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const handlePayment = (data) => {
    const payload = { ...data, paymentMethod };
    console.log(payload);
    dispatch(
      saveShippingAddress({
        address: payload.address,
        city: payload.city,
        postalCode: payload.postalCode,
        country: payload.country,
      }),
      dispatch(savePaymentMethod(payload.paymentMethod)),
    );
    navigate("/placeorder");
  };

  return (
    <div className=" h-screen  flex items-center justify-center">
      <div className="flex flex-col  items-center justify-around  md:justify-around w-[90%] md:w-[95%] h-fit md:h-[80%]  max-w-6xl p-2 rounded-2xl shadow-2xl bg-accent overflow-y-scroll overflow-x-hidden sm:overflow-y-auto bg-gradient-to-br from-black via-gray-700 to-gray-600 text-secondary">
        <div className=" flex flex-col items-center justify-center w-full  p-4   ">
          <h1 className="text-2xl font-semibold mt-4 md:mt-0">
            Enter the Shipping Details
          </h1>
          <form
            className=" w-full flex flex-col  items-center space-y-2"
            onSubmit={handleSubmit(handlePayment)}
          >
            <motion.div
              className="w-full flex flex-col items-center  "
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              <div className=" w-full md:w-4/5 lg:3/5 ">
                <div className="w-full flex flex-col  mt-7 -space-y-3">
                  <Input
                    className=""
                    label="Address :"
                    type="text"
                    placeholder="Enter Address..."
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                  {errors.address && (
                    <p className="text-red-700 ml-3">
                      {errors.address.message}...
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col  -space-y-3">
                  <Input
                    className=""
                    label="City :"
                    type="text"
                    placeholder="Enter City..."
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && (
                    <p className="text-red-700 ml-3">
                      {errors.city.message}...
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col -space-y-3">
                  <div className="relative w-full flex flex-col gap-y-2 ">
                    <Input
                      className=""
                      label="Postal Code :"
                      placeholder="Enter postal code..."
                      {...register("postalCode", {
                        required: "postalCode is required",
                      })}
                    />
                  </div>
                  {errors.postalCode && (
                    <p className="text-red-700 ml-3 text-start  w-full">
                      {errors.postalCode.message}...
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col -space-y-3 ">
                  <div className="relative w-full flex flex-col gap-y-2 ">
                    <Input
                      className=""
                      label="Country :"
                      placeholder="Enter Country..."
                      {...register("country", {
                        required: "Country is required",
                      })}
                    />
                  </div>
                  {errors.country && (
                    <p className="text-red-700 ml-3 text-start w-full">
                      {errors.country.message}...
                    </p>
                  )}
                </div>
                <div className="w-full flex justify-between px-8 mt-2 items-center">
                  <label htmlFor="paymentMethod" className="font-semibold">
                    Select Method :
                  </label>
                  <select
                    name="paymentMethod"
                    id="paymentMethod"
                    defaultValue="esewa"
                    className="bg-gray-800 w-fit rounded-xl px-10 py-1.5 text-white"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {paymentMethods.map((paymentMethod, index) => (
                      <option key={index}>{paymentMethod}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
            <div className="w-full mt-6  flex flex-col md:flex-row items-center space-y-4 md:space-y-0   md:justify-center md:space-x-30  ">
              <button
                type="submit"
                className="bg-black px-14 py-2 text-white rounded-md  "
              >
                {isSubmitting ? "Registering..." : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
