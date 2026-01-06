import { useSignupMutation, useLoginMutation } from "../../redux/api/userSlice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import SignUpSideImg from "../../assets/SignUpSideImg.png";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import Input from "../../components/Input.jsx";
import { FaUser } from "react-icons/fa6";

import { FaEye, FaFileUpload } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

import { motion, scale } from "motion/react";

// motion-part:
const steps = [{ title: "Step-1" }, { title: "Step-2" }];

const SignUp = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { redirect } = location.state || "/";

  const { userInfo } = useSelector((state) => state.auth);

  const [signup] = useSignupMutation();
  const [login] = useLoginMutation();

  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState(null);
  const profilePicRef = useRef(null);

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

  const handleSignUp = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Password must be confirmed...");
        return;
      }
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.profilePic?.name) formData.append("profilePic", data.profilePic);

      const signupResponse = await signup(formData).unwrap();
      console.log(signupResponse);
      console.log(signupResponse.status === 200);
      if (signupResponse.status === 200) {
        toast.success(
          `Welcome , ${signupResponse.data.username} , Logging you in...`
        );
        const loginResponse = await login({
          email: data.email,
          password: data.password,
        }).unwrap();
        setTimeout(() => {
          if (loginResponse.status === 200) {
            dispatch(setCredentials(loginResponse.data));
            toast.success(
              `Good to see u back , ${loginResponse.data.username}`
            );
          }
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.data.message) || "Something went wrong...";
    }
  };

  useEffect(() => {
    if (!redirect.startsWith("/")) navigate("/");
    if (userInfo) navigate(redirect);
  }, [redirect, userInfo, navigate]);

  // Not a design flaw, i wanna make a single button for hide and show the password and confirm password...
  const [showPassword, setShowPassword] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = async () => {
    const valid = await trigger(); // runs validation
    if (valid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  return (
    <div className="absolute w-screen h-screen inset-0 backdrop-blur-xs flex items-center justify-center">
      <div className="flex items-center md:justify-around w-3/4 md:w-4/5 lg:2/3 h-4/5 max-h-11/12 max-w-6xl p-2 rounded-2xl shadow-2xl bg-accent">
        <div className="w-1/5 flex flex-col items-center justify-around relative h-[20rem] ">
          {
            <motion.div
              className=" absolute w-1 bg-blue-500 ml-[3.7rem] "
              initial={{ height: 0 }}
              animate={{ height: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            />
          }
          {steps.map((step, index) => (
            <div key={index} className="flex items-center relative space-x-2">
              <p
                className={`text-lg font-semibold ${
                  index <= currentStep ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
              <motion.div
                className={`h-10 w-10 flex justify-center items-center rounded-full border-2 ${
                  index <= currentStep ? "bg-blue-500" : "bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {index < currentStep ? "✅" : null}
              </motion.div>
            </div>
          ))}
        </div>
        <div className=" flex flex-col items-center justify-center w-3/5   h-full p-4 ">
          <h1 className="text-2xl font-semibold ">SignUp 🥳</h1>
          <form
            className=" w-full flex flex-col items-center space-y-2"
            onSubmit={handleSubmit(handleSignUp)}
          >
            <motion.div
              className="w-full flex flex-col items-center "
              key={currentStep}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              {currentStep === 0 && (
                <>
                  <div className="w-full flex flex-col  mt-7 -space-y-3">
                    <Input
                      className=""
                      label="Username :"
                      type="username"
                      placeholder="Enter username..."
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />
                    {errors.username && (
                      <p className="text-red-700 ml-3">
                        {errors.username.message}...
                      </p>
                    )}
                  </div>
                  <div className="w-full flex flex-col  -space-y-3">
                    <Input
                      className=""
                      label="Email :"
                      type="email"
                      placeholder="Enter email..."
                      {...register("email", { required: "Email is required" })}
                      //   register("email") returns an object containing name, onChange, onBlur, ref, and other properties.
                      // The spread operator (...register(...)) passes these properties as props into Input.
                    />
                    {errors.email && (
                      <p className="text-red-700 ml-3">
                        {errors.email.message}...
                      </p>
                    )}
                  </div>
                  <div className="w-full flex flex-col -space-y-3">
                    <div className="relative w-full flex flex-col gap-y-2 ">
                      <Input
                        className=""
                        label="Password :"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password..."
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      <span
                        className="absolute bottom-7 right-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <IoIosEyeOff className="" size={25} color="white" />
                        ) : (
                          <FaEye className="" size={25} color="white" />
                        )}
                      </span>
                    </div>
                    {errors.password && (
                      <p className="text-red-700 ml-3 text-start  w-full">
                        {errors.password.message}...
                      </p>
                    )}
                  </div>
                  <div className="w-full flex flex-col -space-y-3">
                    <div className="relative w-full flex flex-col gap-y-2 ">
                      <Input
                        className=""
                        label="Confirm Password :"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm password..."
                        {...register("confirmPassword", {
                          required: "Password needs to be confirmed",
                        })}
                      />
                      <span
                        className="absolute bottom-7 right-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <IoIosEyeOff className="" size={25} color="white" />
                        ) : (
                          <FaEye className="" size={25} color="white" />
                        )}
                      </span>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-700 ml-3 text-start w-full">
                        {errors.confirmPassword.message}...
                      </p>
                    )}
                  </div>
                </>
              )}
              {currentStep === steps.length - 1 && (
                <>
                  <p className="mt-12 text-lg "> ProfilePic : </p>
                  <div className="w-60 h-fit relative rounded-2xl  overflow-hidden flex  items-center justify-center  mt-6 ">
                    {preview && (
                      <img
                        src={preview}
                        alt="image.png"
                        className="object-cover w-[100%] h-[100%] "
                      />
                    )}

                    {!preview && <FaUser size={200} />}

                    <div
                      role="button"
                      onMouseDown={(e) => e.preventDefault()}
                      className="absolute inset-0 hover:bg-gray-600/50  flex rounded-3xl  items-center justify-center"
                      onClick={
                        preview
                          ? handleProfilePicRemove
                          : handleProfilePicInputClick
                      }
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    >
                      {hovered && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                {preview ? (
                                  <MdDeleteForever size={30} color="red" />
                                ) : (
                                  <FaFileUpload size={30} />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {preview
                                    ? "Remove Profile Pic"
                                    : "Upload Profile Picture"}
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
                </>
              )}
            </motion.div>
            <div className="w-full flex items-center justify-around">
              <button
                className={`bg-black px-14 py-2 text-white rounded-md mt-8 ${
                  currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentStep === 0}
                onClick={prevStep}
                type="button"
              >
                Previous
              </button>
              {currentStep === 0 && (
                <button
                  type="button"
                  className="bg-black px-14 py-2 text-white rounded-md mt-8 "
                  onClick={nextStep}
                >
                  Next
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button
                  type="submit"
                  className="bg-black px-14 py-2 text-white rounded-md mt-8 "
                >
                  {isSubmitting
                    ? "Registering..."
                    : preview
                    ? "Upload and Signup"
                    : "Skip and Signup"}
                </button>
              )}
            </div>
            <p className="mt-8">
              Already Have An Account?
              <Link to="/login" state={redirect}>
                <span className="underline ml-0.5"> Login</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
