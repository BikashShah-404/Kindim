import Logo from "../assets/Logo.png";

import { RiShoppingBag4Fill } from "react-icons/ri";
import { RiSearchLine } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";

import { Link, useLocation } from "react-router-dom";

import ToolTip from "./Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLogoutMutation } from "@/redux/api/userSlice";
import { logout } from "@/redux/features/auth/authSlice";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const logoutHandler = async () => {
    try {
      const response = await logoutApiCall().unwrap();
      if (response.status === 200) {
        toast("See u soon...");
        dispatch(logout());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Something went wrong...");
    }
  };

  return (
    <header className="w-full  h-16 rounded-b-md shadow-2xl pl-8 pr-2 flex items-center ">
      <Link to="/" className="h-full w-fit">
        <div className="h-full flex items-center justify-center w-fit ">
          <img src={Logo} alt="logo.png" width={40} />
          <RiShoppingBag4Fill
            size={20}
            className="relative bottom-1 right-3 "
          />
        </div>
      </Link>
      <div className=" flex flex-1  justify-center items-center">
        <div className="hidden md:flex px-10 ">
          <input
            type="text"
            placeholder="Search your buy..."
            className=" flex-1 hidden md:block md:min-w-96 rounded-lg py-2 placeholder:text-center border-2 border-gray-200 outline-0 pl-4 pr-10 transition-all duration-100 focus-within:shadow-xl"
          />
          <div className="relative right-9 bg-black  flex items-center justify-center w-10 rounded-2xl">
            <RiSearchLine className="" size={22} color="white" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 space-x-3">
        <ToolTip Icon={<FaShoppingCart size={20} />} Text="Cart" />
        <Link to={"/profile"}>
          {userInfo ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={userInfo.profilePic}
                alt="profile.png"
                className="object-cover"
              />
            </div>
          ) : (
            <ToolTip Icon={<FaUser size={20} />} Text="Profile" />
          )}
        </Link>

        {!userInfo ? (
          <Link to={"/login"} state={{ redirect: location.pathname }}>
            <ToolTip Icon={<IoMdLogIn size={20} />} Text="Login" />
          </Link>
        ) : (
          <ToolTip
            Icon={<IoMdLogOut size={20} />}
            Text="Logout"
            onClick={() => logoutHandler()}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
