export const addFavouriteToLocalStorage = (product) => {
  const favourites = getFavouritesFromLocalStorage();
  if (
    !favourites.some(
      (eachFavouriteproduct) => eachFavouriteproduct._id === product._id
    )
  ) {
    favourites.push(product);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }
};

export const removeFavouriteFromLocalStorage = (productId) => {
  const favourites = getFavouritesFromLocalStorage();
  const updatedFavourites = favourites.filter(
    (eachFavouriteproduct) => eachFavouriteproduct._id !== productId
  );
  localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
};

export const getFavouritesFromLocalStorage = () => {
  const favouritesJSON = localStorage.getItem("favourites");
  return favouritesJSON ? JSON.parse(favouritesJSON) : [];
};
