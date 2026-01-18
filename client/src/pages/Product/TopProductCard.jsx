import StarRating from "@/components/StarRating";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MdFavoriteBorder } from "react-icons/md";

const TopProductCard = ({ product }) => {
  return (
    <div className=" flex flex-col max-w-md p-3 pr-5 bg-black/91 rounded-lg text-white space-y-4 relative hover:shadow-2xl ">
      <div className="w-full h-60 overflow-hidden rounded-xl mt-4">
        <img
          src={product.image}
          alt={`$product.name}.png`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col -space-y-1">
        <div className="font-semibold">{product?.name}</div>
        <div className="truncate">{product.description}</div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-row space-x-1  items-center">
          <div>{product.rating}</div>
          <StarRating rating={product.rating} />
        </div>
        <div>{product.numReviews} reviews...</div>
      </div>
      <div className="flex justify-between">
        <div className=" font-bold text-lg   text-green-500">
          ${product.price}.00
        </div>
        <button className="bg-white/90 px-4 py-2  text-black rounded-xl mt-8 cursor-pointer">
          View Product...
        </button>
      </div>
      <div className="absolute right-1 top-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <MdFavoriteBorder size={30} color="white" className="" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Cart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TopProductCard;
