import Logo from "../assets/Logo.png";

import { RiShoppingBag4Fill } from "react-icons/ri";
import { RiSearchLine } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { MdCancel, MdFavorite } from "react-icons/md";
import { FaShop } from "react-icons/fa6";

import { Link, useLocation } from "react-router-dom";

import ToolTipComp from "./Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLogoutMutation } from "@/redux/api/userSlice";
import { logout } from "@/redux/features/auth/authSlice";
import FavouritesCount from "./FavouritesCount";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { TfiMenuAlt } from "react-icons/tfi";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const [isMenuClicked, setIsMenuClicked] = useState(false);

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

  const { cartItems } = useSelector((state) => state.cart);

  return (
    <header className="w-full  h-16 rounded-b-md shadow-2xl pl-8 pr-2 flex items-center sticky z-10 top-0 bg-white">
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
      <div className="">
        <AnimatePresence>
          {!isMenuClicked && (
            <motion.div
              className=" lg:hidden shadow-2xl cursor-pointer w-fit h-fit pr-2"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <TfiMenuAlt
                      size={40}
                      color="black"
                      className={`cursor-pointer bg-white rounded-xl p-2 shadow-md shadow-accent-foreground`}
                      onClick={() => setIsMenuClicked(true)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Menu</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isMenuClicked && (
            <motion.div
              className="bg-gradient-to-t from-black via-gray-600 to-gray-500  p-2 absolute right-3 rounded-lg flex items-center justify-center lg:hidden "
              transition={{ duration: 0.4, ease: "easeInOut" }}
              initial={{ opacity: 0, scale: 0, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 100 }}
            >
              <div className="flex flex-col min-w-[10rem] items-center justify-center  space-y-2 relative">
                <div className="absolute -right-3 -top-8">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <MdCancel
                          size={40}
                          color="white"
                          className={`cursor-pointer bg-black rounded-xl p-1 shadow-md shadow-accent-foreground`}
                          onClick={() => setIsMenuClicked(false)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Link
                  className="cursor-pointer hover:bg-white/20 py-1 rounded-xl  w-full text-center"
                  to={"/shop"}
                >
                  <div className="flex space-x-2 items-center justify-center">
                    <ToolTipComp Icon={<FaShop size={20} />} Text="Shop" />
                    <span className="text-white">Shop</span>
                  </div>
                </Link>
                <Link
                  className=" cursor-pointer hover:bg-white/20 py-1.5 rounded-xl  w-full text-center"
                  to={"/favourites"}
                >
                  <div className="flex space-x-2 items-center justify-center">
                    <ToolTipComp
                      Icon={
                        <div className="relative">
                          <MdFavorite size={25} className="" />
                          <div className="absolute -right-3.5 -top-3.5 ">
                            <FavouritesCount />
                          </div>
                        </div>
                      }
                      Text="Favourites"
                      className={"cursor-pointer "}
                    />
                    <span className="text-white">Favourites</span>
                  </div>
                </Link>
                <Link
                  className="relative cursor-pointer hover:bg-white/20 py-1 rounded-xl  w-full text-center"
                  to={"/cart"}
                >
                  <div className="flex space-x-2 items-center justify-center">
                    <ToolTipComp
                      Icon={
                        <div className="relative">
                          <FaShoppingCart size={20} />
                          <div className="absolute -right-4 -top-4">
                            {cartItems.length > 0 && (
                              <div className="text-sm rounded-full bg-black w-5 h-5 flex items-center justify-center text-white">
                                {cartItems.length}
                              </div>
                            )}
                          </div>
                        </div>
                      }
                      Text="Cart"
                    />
                    <span className="text-white">Cart</span>
                  </div>
                </Link>
                <Link
                  to={"/profile"}
                  className="cursor-pointer hover:bg-white/20 py-1 rounded-xl  w-full text-center"
                >
                  {userInfo ? (
                    <div className="flex space-x-2 items-center justify-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={userInfo.profilePic}
                          alt="profile.png"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-white">Profile</span>
                    </div>
                  ) : (
                    <div className="flex space-x-2 items-center justify-center">
                      <ToolTipComp Icon={<FaUser size={20} />} Text="Profile" />
                      <span className="text-white">Profile</span>
                    </div>
                  )}
                </Link>

                {!userInfo ? (
                  <Link
                    to={"/login"}
                    state={{ redirect: location.pathname }}
                    className="w-full text-center hover:bg-white/20 py-1 rounded-xl  "
                  >
                    <div className="flex space-x-2 items-center justify-center">
                      <ToolTipComp
                        Icon={<IoMdLogIn size={20} />}
                        Text="Login"
                        className={"cursor-pointer "}
                      />
                      <span className="text-white">Login</span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex space-x-2 items-center justify-center">
                    <ToolTipComp
                      Icon={<IoMdLogOut size={20} />}
                      Text="Logout"
                      className={"cursor-pointer"}
                      onClick={() => logoutHandler()}
                    />
                    <span className="text-white">Logout</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="hidden lg:flex min-w-[10rem] items-center justify-center  space-x-3 pr-3 ">
          <Link className=" cursor-pointer  " to={"/shop"}>
            <ToolTipComp
              Icon={<FaShop size={20} />}
              Text="Shop"
              className={"cursor-pointer"}
            />
          </Link>
          <Link className=" cursor-pointer" to={"/favourites"}>
            <ToolTipComp
              Icon={
                <div className="relative">
                  <MdFavorite size={25} className="" />
                  <div className="absolute -right-3.5 -top-3.5">
                    <FavouritesCount />
                  </div>
                </div>
              }
              Text="Favourites"
              className={"cursor-pointer "}
            />
          </Link>
          <Link className=" cursor-pointer" to={"/cart"}>
            <ToolTipComp
              Icon={
                <div className="relative ">
                  <FaShoppingCart size={20} />
                  <div className="absolute -right-4 -top-4">
                    {cartItems.length > 0 && (
                      <div className="text-sm rounded-full bg-black w-5 h-5 flex items-center justify-center text-white">
                        {cartItems.length}
                      </div>
                    )}
                  </div>
                </div>
              }
              Text="Cart"
              className={"bg-red-900"}
            />
          </Link>
          <Link to={"/profile"} className=" cursor-pointer ">
            {userInfo ? (
              <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
                <img
                  src={userInfo.profilePic}
                  alt="profile.png"
                  className="object-cover"
                />
              </div>
            ) : (
              <ToolTipComp
                Icon={<FaUser size={20} />}
                Text="Profile"
                className={"cursor-pointer"}
              />
            )}
          </Link>

          {!userInfo ? (
            <Link
              to={"/login"}
              state={{ redirect: location.pathname }}
              className="w-full text-center hover:bg-white/20 py-1 rounded-xl  "
            >
              <ToolTipComp
                Icon={<IoMdLogIn size={20} />}
                Text="Login"
                className={"cursor-pointer "}
              />
            </Link>
          ) : (
            <ToolTipComp
              Icon={<IoMdLogOut size={20} />}
              Text="Logout"
              className={"cursor-pointer"}
              onClick={() => logoutHandler()}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
