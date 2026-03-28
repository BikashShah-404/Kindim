import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCheckIfAdminQuery } from "@/redux/api/userSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AdminRoute = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data, error, isLoading, isError, refetch } = useCheckIfAdminQuery(
    undefined,
    {
      skip: !userInfo, //  don't call if not logged in
    },
  );

  console.log(data);
  console.log(error);

  return isLoading ? (
    <p>Loading...</p>
  ) : !userInfo ? (
    <Navigate to="/login" replace state={{ redirect: location.pathname }} />
  ) : data?.status === 200 ? (
    <Outlet />
  ) : error?.status === 403 ? (
    <Navigate to="/" replace /> //  not admin, go to home
  ) : (
    <Navigate to="/login" replace state={{ redirect: location.pathname }} />
  );
};

export default AdminRoute;
