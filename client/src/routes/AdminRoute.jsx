import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCheckIfAdminQuery } from "@/redux/api/userSlice";
import { toast } from "react-toastify";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data, error, isLoading } = useCheckIfAdminQuery();
  console.log(data);

  return isLoading ? (
    <p>Loading...</p>
  ) : userInfo && data?.status === 200 ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace />
  );
};

export default AdminRoute;
