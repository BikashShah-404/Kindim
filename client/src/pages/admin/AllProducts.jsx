import { useGetAllProductsQuery } from "@/redux/api/productSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { Spinner } from "@/components/ui/spinner";
import PaginationComp from "@/components/Pagination";

// TODO:MAke better design and all
const AllProducts = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useGetAllProductsQuery({ page, limit });
  const products = data?.data?.products || [];

  return (
    <div className="flex flex-col p-10 w-[100%] items-center bg-gradient-to-br from-black via-gray-600 to-gray-500 ">
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="flex items-center gap-x-4 h-fit  shadow-2xl w-fit bg-gradient-to-tl from-black via-gray-600 to-gray-500 py-2 px-6 rounded-2xl  ">
            <Spinner className={"h-10 w-10 "} />
            <span className="text-secondary font-semibold">
              Fetching Products.
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row space-y-8 md:space-x-8 md:justify-center flex-wrap text-white ">
            {products &&
              products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col items-center  md:items-start md:flex-row relative bg-gray-900/90 p-2 rounded-xl"
                >
                  <div className="w-full sm:w-[60vw] md:w-50 md:h-50  rounded-md overflow-hidden">
                    <img
                      src={product.image}
                      alt=""
                      className=" w-full  h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col w-full sm:w-lg md:w-md  space-y-2 pl-4 ">
                    <div className="absolute mt-2 md:mt-0  right-5 ">
                      {new Date(product.createdAt).toDateString()}
                    </div>
                    <div className="flex flex-col ">
                      <div className="text-xl mt-4">{product.name} </div>
                      <div className=" text-sm truncate w-xs">
                        {product.description}
                      </div>
                    </div>
                    <div className="font-semibold text-lg">
                      ${product.price}
                    </div>
                    <div className="flex flex-1 items-center justify-center  ">
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
          <div className="my-20">
            <PaginationComp
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              total={data?.data?.totalPages}
            />
          </div>
          <div>
            <AdminMenu />
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
