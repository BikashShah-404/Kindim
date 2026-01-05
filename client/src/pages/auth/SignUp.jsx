import { useSignupMutation, useLoginMutation } from "../../redux/api/userSlice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import SignUpSideImg from "../../assets/SignUpSideImg.png";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import Input from "../../components/Input.jsx";

import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { redirect } = location.state || "/";

  const { userInfo } = useSelector((state) => state.auth);

  const [signup] = useSignupMutation();
  const [login] = useLoginMutation();

  const handleSignUp = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error("Password must be confirmed...");
        return;
      }
      const signupResponse = await signup(data).unwrap();
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
        if (loginResponse.status === 200) {
          dispatch(setCredentials(loginResponse.data));
          toast.success(`Good to see u back , ${loginResponse.data.username}`);
        }
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

  return (
    <div className="absolute w-screen h-screen inset-0 backdrop-blur-xs flex items-center justify-center">
      <div className="flex items-center w-3/4 md:w-4/5 lg:2/3 h-4/5 max-h-11/12 max-w-6xl p-2 rounded-2xl shadow-2xl bg-accent">
        <div className=" hidden md:block h-full  md:w-1/2 ">
          <img
            src={SignUpSideImg}
            alt="image.png"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className=" flex flex-col items-center justify-center w-full md:w-1/2 h-full p-4 ">
          <h1 className="text-2xl font-semibold ">SignUp 🥳</h1>
          <form
            className=" w-full flex flex-col items-center space-y-2"
            onSubmit={handleSubmit(handleSignUp)}
          >
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
                <p className="text-red-700 ml-3">{errors.email.message}...</p>
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

            <button
              type="submit"
              className="bg-black px-14 py-2 text-white rounded-md mt-8 "
            >
              {isSubmitting ? "Registering..." : "SignUp"}
            </button>
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
