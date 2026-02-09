import Input from "@/components/Input";
import ToolTip from "@/components/Tooltip";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaFileUpload, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CiEdit } from "react-icons/ci";
import { MdCancel, MdDeleteForever } from "react-icons/md";
import { IoIosEyeOff } from "react-icons/io";
import { BsBagCheckFill } from "react-icons/bs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import {
  useChangePasswordMutation,
  useCheckIfAdminQuery,
  useUpdateProfileMutation,
  useUpdateProfilePicMutation,
} from "@/redux/api/userSlice";
import { setCredentials } from "@/redux/features/auth/authSlice";
import store from "@/redux/store";

import { MdDashboard } from "react-icons/md";

import { motion, scale } from "motion/react";
import AdminMenu from "../admin/AdminMenu";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { isSubmitting, dirtyFields },
  } = useForm({
    defaultValues: {
      username: userInfo?.username || "",
      email: userInfo?.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { isSubmitting: isPasswordSubmitting },
  } = useForm();

  useEffect(() => {
    if (!userInfo)
      navigate("/login", { state: { redirect: location.pathname } });
  }, [userInfo, navigate, location]);

  console.log(userInfo);

  useEffect(() => {
    setValue("username", userInfo.username);
  }, [userInfo, setValue]);

  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPasswordChangeClicked, setIsPasswordChangeClicked] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState(null);
  const { data, isLoading, error } = useCheckIfAdminQuery();
  console.log(data);

  const profilePicRef = useRef(null);

  const handleUsernammeEditClick = () => {
    setIsUsernameEditable(true);
    setIsEmailEditable(false);
    setFocus("username");
  };

  const handleEmailEditClick = () => {
    setIsEmailEditable(true);
    setIsUsernameEditable(false);
    setFocus("email");
  };

  const handlePasswordChangeClick = () => {
    setIsPasswordChangeClicked(true);
  };

  const handleProfilePicInputClick = (e) => {
    profilePicRef.current?.click();
    e.preventDefault();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("profilePic", file);
    }
  };

  const handleProfilePicRemove = (e) => {
    setPreview(null);
    setValue("profilePic", null);
    e.preventDefault();
    if (profilePicRef.current) {
      profilePicRef.current.value = ""; // Reset the file input so it can detect new changes
    }
  };

  const [updateProfilePic] = useUpdateProfilePicMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const handleProfileUpdate = async (data) => {
    try {
      console.log(data);
      if (
        !dirtyFields.username &&
        !dirtyFields.email &&
        !data.profilePic?.name
      ) {
        toast.info("Nothing to Update");
        return;
      }
      if (data.profilePic?.name) {
        const formDataForProfilePic = new FormData();
        formDataForProfilePic.append("profilePic", data.profilePic);
        const response = await updateProfilePic(formDataForProfilePic).unwrap();
        console.log(response);
        if (response.status === 200) {
          setPreview(null);
          dispatch(
            setCredentials({
              ...userInfo,
              profilePic: response.data.profilePic,
            }),
          );
          setValue("profilePic", null);
          toast.success("ProfilePic Updated...");
        }
      }

      if (dirtyFields.username && dirtyFields.email) {
        const response = await updateProfile({
          username: data.username,
          email: data.email,
        }).unwrap();
        console.log(response);
        if (response.status === 200) {
          dispatch(
            setCredentials({
              ...store.getState().auth.userInfo,
              username: response.data.username,
              email: response.data.email,
            }),
          );
          setIsUsernameEditable(false);
          setIsEmailEditable(false);
          toast.success("Username and Email Updated...");
        }
      } else if (dirtyFields.username) {
        const response = await updateProfile({
          username: data.username,
        }).unwrap();
        console.log(response);
        if (response.status === 200) {
          dispatch(
            setCredentials({
              ...store.getState().auth.userInfo,
              username: response.data.username,
            }),
          );
          setIsUsernameEditable(false);
          toast.success("Username Updated...");
        }
      } else if (dirtyFields.email) {
        const response = await updateProfile({
          email: data.email,
        }).unwrap();
        console.log(response);
        if (response.status === 200) {
          dispatch(
            setCredentials({
              ...store.getState().auth.userInfo,
              email: response.data.email,
            }),
          );
          setIsEmailEditable(false);
          toast.success("Email Updated...");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong...");
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      const response = await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      if (response.status === 200) {
        toast.success("Password Updated...");
        setIsPasswordChangeClicked(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong...");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col p-10 items-center overflow-y-auto ">
      <div className="w-60 min-h-60 rounded-3xl overflow-hidden mt-10 relative">
        <img
          src={
            preview ? (
              preview
            ) : userInfo?.profilePic ? (
              userInfo.profilePic
            ) : (
              <FaUser size={150} />
            )
          }
          alt="profilePic.png"
          className="object-cover w-full h-full"
        />
        <div
          role="button"
          onMouseDown={(e) => e.preventDefault()}
          className={`absolute inset-0 hover:bg-gray-200/50  flex rounded-3xl  items-center justify-center ${
            isSubmitting ? "cursor-wait" : "cursor-pointer"
          }`}
          onClick={
            preview ? handleProfilePicRemove : handleProfilePicInputClick
          }
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && !isSubmitting && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {preview ? (
                      <MdDeleteForever
                        size={30}
                        color="red"
                        className={`${
                          isSubmitting ? "cursor-wait" : "cursor-pointer"
                        }`}
                      />
                    ) : (
                      <FaFileUpload
                        size={30}
                        className={`${
                          isSubmitting ? "cursor-wait" : "cursor-pointer"
                        }`}
                      />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {preview ? "Discard Change" : "Update Profile Picture"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
        <input
          type="file"
          ref={profilePicRef}
          accept=".png, .jpg, .jpeg, .svg ,.webp"
          name="profilePic"
          onChange={handleProfilePicChange}
          className="hidden"
        />
      </div>
      <div className=" mt-10  w-full flex  items-center justify-center  ">
        <form
          className=" w-full md:w-2/3 flex flex-col space-y-4 items-center max-w-3xl   "
          onSubmit={handleSubmit(handleProfileUpdate)}
        >
          <div className="w-full relative flex ">
            <Input
              label="Username :"
              name="username"
              type="text"
              className=""
              isEditable={isUsernameEditable}
              {...register("username")}
            />
            <div
              className="absolute right-8  top-11.5 "
              onClick={handleUsernammeEditClick}
            >
              <ToolTip
                Icon={<CiEdit size={20} />}
                Text={"Edit Username"}
                type={"button"}
              />
            </div>
          </div>
          <div className="w-full relative flex ">
            <Input
              label="Email :"
              name="email"
              type="text"
              className=""
              isEditable={isEmailEditable}
              {...register("email")}
            />
            <div
              className="absolute right-8  top-11.5 "
              onClick={handleEmailEditClick}
            >
              <ToolTip
                Icon={<CiEdit size={20} />}
                Text={"Edit Username"}
                type={"button"}
              />
            </div>
          </div>
          <div className="w-full sm:w-full  flex flex-col sm:flex-row  justify-around mt-10 gap-y-10 sm:gap-y-0">
            <button
              className={`bg-black px-14 py-2 text-white rounded-md cursor-pointer ${
                isSubmitting ? "cursor-wait" : "cursor-pointer"
              }`}
              type="button"
              onClick={handlePasswordChangeClick}
              disabled={isSubmitting}
            >
              Change Password
            </button>
            <button
              className={`bg-black px-14 py-2 text-white rounded-md cursor-pointer ${
                isSubmitting ? "cursor-wait" : "cursor-pointer"
              } `}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
        {isPasswordChangeClicked && (
          <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-center  backdrop-brightness-50">
            <form
              onSubmit={handlePasswordSubmit(handlePasswordChange)}
              className="md:w-2/3 lg:w-2/5 w-[95%] shadow-2xl max-w-3xl"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Enter your current and new password
                  </CardDescription>
                  <CardAction>
                    <ToolTip
                      Icon={<MdCancel size={28} />}
                      Text={"Cancel"}
                      onClick={() => setIsPasswordChangeClicked(false)}
                      type={"button"}
                    />
                  </CardAction>
                </CardHeader>
                <CardContent className="-space-y-2">
                  <div className="relative w-full flex flex-col gap-y-2 mt-5">
                    <Input
                      className=""
                      label="Current Password :"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password..."
                      {...registerPassword("currentPassword", {
                        required: "Current Password is required",
                      })}
                    />
                    <span
                      className="absolute bottom-7 right-10"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <IoIosEyeOff className="" size={25} color="white" />
                      ) : (
                        <FaEye className="" size={25} color="white" />
                      )}
                    </span>
                  </div>
                  <div className="relative w-full flex flex-col gap-y-2 mt-5">
                    <Input
                      className=""
                      label="New Password :"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter New password..."
                      {...registerPassword("newPassword", {
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
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-black px-14 py-2 text-white rounded-md"
                  >
                    Change Password
                  </button>
                </CardFooter>
              </Card>
            </form>
          </div>
        )}
      </div>
      <Link to="/orders">
        <motion.div
          className=" fixed right-1 bottom-1 sm:right-5 sm:bottom-5 md:right-10 md:bottom-10 z-10 shadow-2xl cursor-pointer w-fit h-fit "
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <BsBagCheckFill
                  size={45}
                  color="black"
                  className={`cursor-pointer bg-white rounded-xl p-2 shadow-md shadow-accent-foreground`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>My Orders</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </Link>
      {data?.status === 200 && <AdminMenu />}
    </div>
  );
};

export default Profile;
