import { useState, useEffect } from "react";

import LoginSideImg from "../../assets/LoginSideImg.png";
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { toast } from "react-toastify";
import Input from "../../components/Input.jsx";

import { setCredentials } from "../../redux/features/auth/authSlice.js";
import { useLoginMutation } from "../../redux/api/userSlice.js";

import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const location = useLocation();
  console.log(location);

  const redirect = location.state?.redirect || "/";

  useEffect(() => {
    // This is because since we r uisng redirect hadn't it been checked whether it startsWith "/" then we can basically inject any url in the /login?redirect="https://myPhisingWebsite.com" and would have risked security so we check this so that we cannot go to any external url.
    if (!redirect?.startsWith("/")) {
      navigate("/"); // Prevents external redirects
    }
    if (userInfo) navigate(redirect);
  }, [userInfo, navigate, redirect]);

  const handleLogin = async (data) => {
    try {
      const response = await login(data).unwrap();
      console.log(response);

      if (response.status === 200) {
        dispatch(setCredentials(response.data));
        toast.success(`Good to see u back , ${response.data.username}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "An unknown error occurred");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-[100vw] h-[100vh] absolute inset-0 backdrop-blur-xs flex items-center justify-center">
      <div className="flex items-center w-3/4 md:w-4/5 lg:2/3 h-4/5 max-w-6xl p-2 rounded-2xl shadow-2xl bg-accent">
        <div className=" hidden md:block h-full md:w-1/2 ">
          <img
            src={LoginSideImg}
            alt="image.png"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className=" flex flex-col items-center justify-center w-full md:w-1/2 h-full p-4 ">
          <h1 className="text-2xl font-semibold ">Login 👋</h1>
          <form
            className=" w-full flex flex-col items-center"
            onSubmit={handleSubmit(handleLogin)}
          >
            <div className="w-full flex flex-col gap-y-2 mt-7">
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
                <p className="text-red-700 ml-3">{errors.email.message}...</p>
              )}
            </div>
            <div className="relative w-full flex flex-col gap-y-2 mt-5">
              <Input
                className=""
                label="Password :"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                {...register("password", { required: "Password is required" })}
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
            <div className=" w-full text-end mt-1 ">
              <Link to="/forgot-password">
                <span className=" underline  hover:text-blue-600 ">
                  Forgot Password?
                </span>
              </Link>
            </div>
            <button
              type="submit"
              className={`bg-black px-14 py-2 text-white rounded-md mt-8 
                ${isSubmitting ? "cursor-wait" : "cursor-pointer"}
                    }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging In..." : "Login"}
            </button>
            <p className="mt-8">
              Don't Have An Account?
              <Link to="/sign-up" state={{ redirect }}>
                <span className="underline ml-0.5"> SignUp</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
