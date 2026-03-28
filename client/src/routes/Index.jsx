import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Profile from "../pages/users/Profile.jsx";

import AdminRoute from "@/routes/AdminRoute.jsx";

import Login from "../pages/auth/Login.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import ForgotPassword from "@/pages/auth/ForgotPassword.jsx";
import Orders from "@/pages/users/Orders.jsx";
import UserList from "@/pages/admin/UserList.jsx";
import Dashboard from "@/pages/admin/dashboard/Dashboard.jsx";
import CategoryList from "@/pages/admin/CategoryList.jsx";
import ProductCreate from "@/pages/admin/ProductCreate.jsx";
import ProductUpdate from "@/pages/admin/ProductUpdate.jsx";
import AllProducts from "@/pages/admin/AllProducts.jsx";
import ProductDetail from "@/pages/Product/ProductDetail.jsx";
import Favourites from "@/pages/Product/Favourites.jsx";
import ProductAllReview from "@/pages/review/ProductAllReview.jsx";
import Cart from "@/pages/users/Cart.jsx";
import Shop from "@/pages/Shop.jsx";
import Shipping from "@/pages/orders/Shipping.jsx";
import PlaceOrder from "@/pages/orders/PlaceOrder.jsx";
import PaymentSuccess from "@/pages/Payment/PaymentSuccess.jsx";
import PaymentFailure from "@/pages/Payment/PaymentFailure.jsx";
import AllOrders from "@/pages/admin/AllOrders.jsx";
import UserRoute from "./UserRoute.jsx";

const routes = createRoutesFromElements(
  <Route
    path="/"
    element={<App />}
    errorElement={
      <div className="w-[100%] h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-700 to-gray-900">
        <h1 className="text-4xl text-secondary font-alegreya">
          Something Went Wrong! Try Again.
        </h1>
      </div>
    }
  >
    <Route path="/login" element={<Login />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/favourites" element={<Favourites />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/product-review/:id" element={<ProductAllReview />} />
    <Route path="/payment/complete" element={<PaymentSuccess />} />
    <Route path="/payment/failed" element={<PaymentFailure />} />

    {/* User Routes */}
    <Route element={<UserRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/placeorder" element={<PlaceOrder />} />
    </Route>

    {/* Admin Routes */}
    <Route path="/admin" element={<AdminRoute />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="userlist" element={<UserList />} />
      <Route path="category-list" element={<CategoryList />} />
      <Route path="product-create" element={<ProductCreate />} />
      <Route path="product-all" element={<AllProducts />} />
      <Route path="product/update/:_id" element={<ProductUpdate />} />
      <Route path="orderlist" element={<AllOrders />} />
    </Route>
  </Route>,
);

const router = createBrowserRouter(routes);

export default router;
