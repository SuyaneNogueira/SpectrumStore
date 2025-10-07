import React, { createContext, useState, useContext } from 'react';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (product) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(item => item.id === product.id);
      if (isFavorited) {
        // Remove o produto dos favoritos
        return prevFavorites.filter(item => item.id !== product.id);
      } else {
        // Adiciona o produto aos favoritos
        return [...prevFavorites, product];
      }
    });
  };
  
  const isFavorited = (productId) => {
    return favorites.some(item => item.id === productId);
};

  return (
      <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);