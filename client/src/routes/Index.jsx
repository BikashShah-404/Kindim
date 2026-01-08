import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "../App.jsx";
import Home from "../pages/users/Home.jsx";
import Profile from "../pages/users/Profile.jsx";

import AdminRoute from "@/pages/admin/AdminRoute.jsx";

import Login from "../pages/auth/Login.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import ForgotPassword from "@/pages/auth/ForgotPassword.jsx";
import Orders from "@/pages/users/Orders.jsx";

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route path="/login" element={<Login />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/orders" element={<Orders />} />

    {/* Admin Routes */}
    <Route path="/admin" element={<AdminRoute />} />
  </Route>
);

const router = createBrowserRouter(routes);

export default router;
