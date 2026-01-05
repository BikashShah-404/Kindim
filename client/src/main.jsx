import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Provider } from "react-redux";
import store from "./redux/store";
import Toast from "./components/Toast";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toast />
    <RouterProvider router={router} />
  </Provider>
);
