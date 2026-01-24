import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  addToFavourites,
  setFavourites,
  removeFromFavourites,
} from "@/redux/favourites/favouriteSlice";
import {
  addFavouriteToLocalStorage,
  removeFavouriteFromLocalStorage,
  getFavouritesFromLocalStorage,
} from "@/utils/localStorage";

import { MdFavorite } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "react-toastify";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites) || [];

  const isFavourite = favourites.some(
    (eachFavourite) => eachFavourite._id === product._id,
  );

  useEffect(() => {
    const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
    dispatch(setFavourites(favouritesFromLocalStorage));
  }, [dispatch]);

  const toogleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFromFavourites(product));
      removeFavouriteFromLocalStorage(product._id);
      toast.success("Removed From Favourites...");
    } else {
      dispatch(addToFavourites(product));
      addFavouriteToLocalStorage(product);
      toast.success("Added to Favourites...");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <MdFavorite
            size={30}
            color={isFavourite ? "red" : "white"}
            className=" cursor-pointer"
            onClick={toogleFavourite}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavourite ? "Remove From Favourites" : "Add to Favourites"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeartIcon;
