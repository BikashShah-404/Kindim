import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import App from "../App.jsx";
import Home from "../pages/users/Home.jsx";
import Profile from "../pages/users/Profile.jsx";

import Login from "../pages/auth/Login.jsx";
import SignUp from "../pages/auth/SignUp.jsx";

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route path="/login" element={<Login />} />
    <Route path="/sign-up" element={<SignUp />} />
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
  </Route>
);

const router = createBrowserRouter(routes);

export default router;
