import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useSubscribeMutation,
  useToogleSubscribtionMutation,
} from "@/redux/api/subscribtionSlice";
import { setSubscribtionState } from "@/redux/features/auth/authSlice";
import { toast } from "react-toastify";

const SubscriptionCard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const displayEmail = userInfo ? userInfo.email : email;

  const [subscribe] = useSubscribeMutation();

  const [toggleSubscription] = useToogleSubscribtionMutation();

  const dispatch = useDispatch();

  const handleSubscribe = async () => {
    try {
      if (!email) {
        toast.error("Email is required");
        return;
      }
      const response = await subscribe({ email }).unwrap();
      if (response.status === 200) {
        toast.success(response.msg);
        setEmail("");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message || "An unknown error occurred");
    }
  };

  const handleToogleSubscribe = async () => {
    try {
      const response = await toggleSubscription({
        email: displayEmail,
      }).unwrap();
      if (response.status === 200) {
        toast.success(response.msg);
        dispatch(setSubscribtionState(response.data.isSubscribed));
        console.log(userInfo);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message || "An unknown error occurred");
    }
  };
  return (
    <div className="w-full min-h-[70vh] bg-gradient-to-br w-[100%] from-black via-gray-700 to-gray-950 flex items-center justify-center ">
      <div className="flex items-center justify-center gap-y-8 flex-col h-full w-full ">
        <span className="font-berkshireswash tracking-[0.3vw] text-xl">
          STAY IN THE <span className="text-amber-600">LOOP</span>
        </span>
        <div className="flex flex-col gap-y-1 font-alegreya text-4xl w-full items-center">
          <span>Get early access to </span>
          <span>new arrivals and offers</span>
        </div>
        <span className="font-alegreya">
          No spam. Unsubscribe anytime. Just the good stuff.
        </span>

        <div className="w-full flex justify-center">
          <div className="flex flex-col items-center gap-y-3 gap-x-1.5 md:flex-row">
            <input
              type="email"
              placeholder="your@email.com"
              value={displayEmail}
              onChange={(e) => !userInfo && setEmail(e.target.value)}
              disabled={userInfo}
              className="bg-black border border-white/50  px-3.5 py-2.5  text-[#e8e4dc] outline-none
               w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw]  placeholder:text-secondary/40 focus:border-white/80 rounded-md "
            />{" "}
            <button
              className="bg-black  px-10 py-2.5 text-white rounded-md cursor-pointer  h-fit w-fit       text-center "
              onClick={userInfo ? handleToogleSubscribe : handleSubscribe}
            >
              {userInfo?.isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        </div>
        <p className="font-semibold font-alegreya text-xl tracking-wide">
          {userInfo?.isSubscribed && (
            <span>Thank u for staying Connected with us.</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCard;
