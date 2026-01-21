import { addToCart, removeFromCart } from "@/redux/features/cart/cartSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { MdCancel, MdDelete } from "react-icons/md";

import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  console.log(cartItems);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      toast.info("Please Login...");
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const addToCartHandler = (cartItem, qty) => {
    dispatch(addToCart({ ...cartItem, qty }));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkOutHandler = () => {
    navigate("/shipping");
  };

  return (
    <div className="flex flex-col w-full min-h-screen ">
      {cartItems.length === 0 ? (
        <div className="flex flex-col space-y-10 flex-1 items-center justify-center text-3xl font-semibold">
          <p>Looks Lonely Here...</p>
          <Link to={"/shop"}>
            <button className="bg-gradient-to-br from-black via-gray-700 to-gray-600  px-6 py-2 rounded-lg text-white text-xl hover:bg-gradient-to-tl cursor-pointer">
              Go Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col p-4 md:p-10 space-y-10 bg-gradient-to-l from-black via-gray-700 to-gray-600">
          <div className="text-2xl font-semibold mt-2  ml-4 text-white">
            Shopping Cart
          </div>
          <div className="flex flex-col space-y-8 items-center w-full">
            {cartItems.map((cartItem) => (
              <div
                key={cartItem._id}
                className=" flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-4 bg-white/10 p-4 rounded-xl text-white lg:min-w-4xl "
              >
                <div className="w-full md:w-[10rem] h-[10rem]">
                  <img
                    src={cartItem.image}
                    alt={cartItem.name}
                    className="w-full h-full object-cover rounded-lg  "
                  />
                </div>
                <div className="flex flex-1 ">
                  <div className="flex flex-1 justify-between space-x-6">
                    <div className="flex flex-col space-y-1">
                      <Link
                        className="underline underline-offset-2 "
                        to={`/product/${cartItem._id}`}
                      >
                        {cartItem.name}
                      </Link>
                      <div>{cartItem.brand}</div>
                      <div className="mt-2 text-xl text-green-400 font-semibold">
                        ${cartItem.price}
                      </div>
                    </div>
                    <div className="flex space-x-4  items-center md:items-start">
                      <select
                        id="qty"
                        className="px-6 bg-white/20 py-1.5 rounded-lg h-fit"
                        value={cartItem.qty}
                        onChange={(e) =>
                          addToCartHandler(cartItem, Number(e.target.value))
                        }
                      >
                        {[...Array(cartItem.countInStock).keys()].map((i) => (
                          <option
                            key={i + 1}
                            value={i + 1}
                            className="text-white bg-black scroll-smooth "
                          >
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <div className="">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <MdDelete
                                size={30}
                                color="red"
                                className={`cursor-pointer bg-black rounded-xl p-1 shadow-md shadow-accent-foreground`}
                                onClick={() =>
                                  handleRemoveFromCart(cartItem._id)
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>Remove</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center">
            <div className="mt-8  flex flex-col w-full  lg:w-[80%]  text-white space-y-8 bg-white/10 p-4 rounded-lg ">
              <p className="text-xl font-semibold mt-6 ml-6">Total : </p>
              <div className="flex flex-col space-y-6 w-full items-center">
                {cartItems.map((cartItem) => (
                  <div
                    className="flex bg-black px-4 py-3 rounded-xl justify-between items-center w-[90%] lg:w-[70%]"
                    key={cartItem._id}
                  >
                    <div className="flex flex-col">
                      <span>Product : {cartItem.name}</span>
                      <span className="">Quantity : {cartItem.qty}</span>
                    </div>
                    <div className="text-lg font-semibold text-green-400">
                      ${cartItem.qty * cartItem.price}.00
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center text-xl flex justify-center items-center space-x-3">
                <span>Total Price :</span>
                <p className="text-2xl text-green-400 font-bold">
                  ${" "}
                  {cartItems
                    .reduce(
                      (acc, cartItem) => acc + cartItem.qty * cartItem.price,
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className={`bg-gradient-to-r from-black via-gray-700 to-gray-600 px-14 py-2 text-white rounded-md cursor-pointer flex  items-center space-x-2 w-fit hover:bg-gradient-to-l  `}
                  type="button"
                  onClick={checkOutHandler}
                >
                  <span>Proceed To Checkout</span>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
