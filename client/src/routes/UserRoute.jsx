import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";

const UserRoute = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ redirect: location.pathname }} />
  );
};

export default UserRoute;
