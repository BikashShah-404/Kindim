import { useGetAllProductsQuery } from "@/redux/api/productSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";

// TODO:MAke better design and all
const AllProducts = () => {
  const { data, isLoading } = useGetAllProductsQuery();
  const products = data?.data?.products || [];

  return (
    <div className="flex flex-col p-10 w-screen items-center  ">
      <div className="flex flex-col space-y-6 text-white">
        {products &&
          products.map((product) => (
            <div
              key={product._id}
              className="flex md:flex-row relative bg-gray-900/90 p-2 rounded-xl"
            >
              <div className="w-50 h-50 rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt=""
                  className=" w-full  h-full object-cover"
                />
              </div>
              <div className="flex flex-col w-md pl-4 space-y-2 ">
                <div className="absolute right-5 ">
                  {new Date(product.createdAt).toDateString()}
                </div>
                <div className="flex flex-col ">
                  <div className="text-xl mt-4">{product.name} </div>
                  <div className=" text-sm truncate">{product.description}</div>
                </div>
                <div className="font-semibold text-lg">${product.price}</div>
                <div className="flex flex-1 items-center justify-center ">
                  <Link
                    to={`/admin/product/update/${product._id}`}
                    className=" "
                  >
                    <button
                      type="button"
                      className="bg-black px-14 py-2 text-white rounded-md cursor-pointer  "
                    >
                      Update Product
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div>
        <AdminMenu />
      </div>
    </div>
  );
};

export default AllProducts;
