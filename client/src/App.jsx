import { Outlet, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";

const App = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)]   bg-gradient-to-tr from-black via-gray-700 to-gray-600 text-secondary">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
