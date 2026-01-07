import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import ToolTip from "@/components/Tooltip";
import { MdCancel } from "react-icons/md";
import Input from "@/components/Input";

import { IoChevronBackOutline } from "react-icons/io5";
import {
  useGetFPTokenMutation,
  useResetPasswordMutation,
  useSendFPTokenMutation,
} from "@/redux/api/userSlice";
import { toast } from "react-toastify";
import { IoIosEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";

import { motion, AnimatePresence } from "motion/react";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const {
    register: registerFPToken,
    handleSubmit: handleTokenSubmit,
    reset: resetToken,
    formState: { isSubmitting: isFPTokenSubmitting, errors: tokenError },
  } = useForm();

  const {
    register: registerNewPassword,
    handleSubmit: handleNewPasswordSubmit,
    reset: resetNewPassword,
    formState: {
      isSubmitting: isNewPasswordSubmitting,
      errors: newPasswordError,
    },
  } = useForm();

  const [resetPasswordData, setResetPasswordData] = useState({});

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isFPTokenVerified, setIsFPTokenVerified] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [getFPToken] = useGetFPTokenMutation();
  const handleEmailSubmit = async (data) => {
    const response = await getFPToken(data).unwrap();
    if (response.status === 200) {
      toast.success("Please check your email for the recovery token");
      setResetPasswordData({ ...resetPasswordData, email: data.email });
      setIsEmailSent(true);
      reset();
    }
  };

  const [sendFPToken] = useSendFPTokenMutation();
  const handleFPTokenSubmit = async (data) => {
    const response = await sendFPToken({
      ...resetPasswordData,
      ...data,
    }).unwrap();
    if (response.status === 200) {
      setResetPasswordData({ ...resetPasswordData, token: data.token });
      setIsFPTokenVerified(true);
      resetToken();
    }
  };

  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const handleResetPassword = async (data) => {
    const response = await resetPassword({
      ...resetPasswordData,
      ...data,
    }).unwrap();
    if (response.status === 200) {
      setIsFPTokenVerified(true);
      toast.success("Password Reset Successful. Please Log in...");
      navigate("/login");
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-center  backdrop-brightness-50">
      <AnimatePresence mode="wait">
        {!isEmailSent ? (
          <motion.div
            key="emailForm"
            className="md:w-2/3 lg:w-2/5 w-[95%] shadow-2xl max-w-3xl"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(handleEmailSubmit)} className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Forgot Password</CardTitle>
                  <CardDescription>
                    A Token will be sent to your email...
                  </CardDescription>
                  <CardAction>
                    <Link to="/login">
                      <ToolTip
                        Icon={<MdCancel size={28} />}
                        Text={"Cancel"}
                        type={"button"}
                      />
                    </Link>
                  </CardAction>
                </CardHeader>
                <CardContent className="-space-y-2">
                  <div className="relative w-full flex flex-col -space-y-2 mt-5">
                    <Input
                      className=""
                      label="Email :"
                      type="email"
                      placeholder="Enter your email..."
                      {...register("email", {
                        required: "Email is required",
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-700 ml-6">
                        {errors.email.message}...
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <button
                    type="submit"
                    className={`bg-black px-14 py-2 text-white rounded-md ${
                      isSubmitting ? "cursor-wait" : "cursor-pointer"
                    }`}
                    disabled={isSubmitting}
                  >
                    Next
                  </button>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
        ) : !isFPTokenVerified ? (
          <motion.div
            key="tokenForm"
            className="md:w-2/3 lg:w-2/5 w-[95%] shadow-2xl max-w-3xl"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form
              onSubmit={handleTokenSubmit(handleFPTokenSubmit)}
              className="w-full"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Forgot Password</CardTitle>
                  <CardDescription>Enter The Token</CardDescription>
                  <CardAction>
                    <ToolTip
                      Icon={<IoChevronBackOutline size={25} />}
                      Text={"Go Back"}
                      type={"button"}
                      onClick={() => setIsEmailSent(false)}
                    />
                  </CardAction>
                </CardHeader>
                <CardContent className="-space-y-2">
                  <div className="relative w-full flex flex-col -space-y-2 mt-5">
                    <Input
                      className=""
                      label="Token :"
                      type="text"
                      placeholder="Enter Token..."
                      {...registerFPToken("token", {
                        required: "Token is required",
                      })}
                    />
                    {tokenError.token && (
                      <p className="text-red-700 ml-6">
                        {tokenError.token.message}...
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <button
                    type="submit"
                    className={`bg-black px-14 py-2 text-white rounded-md ${
                      isSubmitting ? "cursor-wait" : "cursor-pointer"
                    }`}
                    disabled={isFPTokenSubmitting}
                  >
                    Next
                  </button>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="resetPasswordForm"
            className="md:w-2/3 lg:w-2/5 w-[95%] shadow-2xl max-w-3xl"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form
              onSubmit={handleNewPasswordSubmit(handleResetPassword)}
              className="w-full"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Forgot Password</CardTitle>
                  <CardDescription>Enter New Password</CardDescription>
                  <CardAction>
                    <ToolTip
                      Icon={<IoChevronBackOutline size={25} />}
                      Text={"Go Back"}
                      type={"button"}
                      onClick={() => setIsFPTokenVerified(false)}
                    />
                  </CardAction>
                </CardHeader>
                <CardContent className="-space-y-2">
                  <div className="relative w-full flex flex-col gap-y-2 mt-5">
                    <Input
                      className=""
                      label="New Password :"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password..."
                      {...registerNewPassword("newPassword", {
                        required: "New Password is required",
                      })}
                    />
                    <span
                      className="absolute bottom-7 right-10"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <IoIosEyeOff className="" size={25} color="white" />
                      ) : (
                        <FaEye className="" size={25} color="white" />
                      )}
                    </span>
                    {newPasswordError.newPassword && (
                      <p className="text-red-700 ml-6">
                        {newPasswordError.newPassword.message}...
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <button
                    type="submit"
                    className={`bg-black px-14 py-2 text-white rounded-md ${
                      isSubmitting ? "cursor-wait" : "cursor-pointer"
                    }`}
                    disabled={isNewPasswordSubmitting}
                  >
                    Reset Password
                  </button>
                </CardFooter>
              </Card>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
