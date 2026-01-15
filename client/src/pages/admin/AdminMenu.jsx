import { useState } from "react";
import { TfiMenuAlt } from "react-icons/tfi";
import { MdCancel } from "react-icons/md";

import { AnimatePresence, motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, NavLink } from "react-router-dom";

const AdminMenu = () => {
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  return (
    <div className="">
      <AnimatePresence>
        {!isMenuClicked && (
          <motion.div
            className=" fixed right-1 top-20 sm:right-5 sm:top-20 md:right-10 md:top-25 z-10 shadow-2xl cursor-pointer w-fit h-fit"
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
            className=" fixed right-1 top-20 sm:right-5 sm:top-20 md:right-10 md:top-25 z-10 shadow- shadow-2xl cursor-pointer  bg-gray-800 rounded-md text-white"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            initial={{ opacity: 0, scale: 0, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 100 }}
          >
            <div className="absolute -right-3 -top-3">
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
                  <TooltipContent>Collapse</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-col space-y-2 py-4 pl-4 pr-12 ">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `${isActive ? "border-l-2 rounded-l-xs border-l-white" : ""}`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="py-2 pr-10 pl-3  rounded-r-lg rounded-b-lg rounded-t-lg   hover:shadow-2xl hover:shadow-blue-600  "
                >
                  Dashboard
                </motion.div>
              </NavLink>
              <NavLink
                to="/admin/category-list"
                className={({ isActive }) =>
                  ` ${
                    isActive ? "border-l-2 rounded-l-xs border-l-white" : " "
                  }`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="py-2 pr-10 pl-3  rounded-r-lg rounded-b-lg rounded-t-lg   hover:shadow-2xl hover:shadow-blue-600"
                >
                  Manage Categories
                </motion.div>
              </NavLink>
              <NavLink
                to="/admin/product-create"
                className={({ isActive }) =>
                  `${isActive ? "border-l-2 rounded-l-xs border-l-white" : " "}`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="py-2 pr-10 pl-3  rounded-r-lg rounded-b-lg rounded-t-lg   hover:shadow-2xl hover:shadow-blue-600 "
                >
                  Create Product
                </motion.div>
              </NavLink>
              <NavLink
                to="/admin/user-list"
                className={({ isActive }) =>
                  `   ${
                    isActive ? "border-l-2 rounded-l-xs border-l-white" : " "
                  }`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="py-2 pr-10 pl-3  rounded-r-lg rounded-b-lg rounded-t-lg   hover:shadow-2xl hover:shadow-blue-600 "
                >
                  Manage Users
                </motion.div>
              </NavLink>
              <NavLink
                to="/admin/product/allproducts"
                className={({ isActive }) =>
                  `  ${
                    isActive ? "border-l-2 rounded-l-xs border-l-white" : " "
                  }`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="py-2 pr-10 pl-3  rounded-r-lg rounded-b-lg rounded-t-lg   hover:shadow-2xl hover:shadow-blue-600 "
                >
                  All Products
                </motion.div>
              </NavLink>
              <NavLink
                to="/admin/orderlist"
                className={({ isActive }) =>
                  `   ${
                    isActive ? "border-l-2 rounded-l-xs border-l-white" : " "
                  }`
                }
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="py-2 pr-10 pl-3  rounded-r-lg rounded-b-lg rounded-t-lg   hover:shadow-2xl hover:shadow-blue-600 "
                >
                  Manage Order
                </motion.div>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMenu;
