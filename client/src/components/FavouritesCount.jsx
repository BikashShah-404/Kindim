import { useSelector } from "react-redux";

const FavouritesCount = () => {
  const favourites = useSelector((state) => state.favourites);
  const favouritesCount = favourites.length;

  return (
    <div className="text-sm rounded-full bg-black w-5 h-5 flex items-center justify-center text-white">
      {favouritesCount}
    </div>
  );
};

export default FavouritesCount;
