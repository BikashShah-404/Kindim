import { useSelector } from "react-redux";

const FavouritesCount = () => {
  const favourites = useSelector((state) => state.favourites);
  const favouritesCount = favourites.length;

  return <div className="text-xl">{favouritesCount}</div>;
};

export default FavouritesCount;
