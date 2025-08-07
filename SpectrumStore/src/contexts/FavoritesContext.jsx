import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Função para adicionar ou remover um produto da lista de favoritos
  const toggleFavorite = (product) => {
    setFavorites(prevFavorites => {
      // Verifica se o produto já está na lista
      const isProductInFavorites = prevFavorites.some(fav => fav.id === product.id);
      
      if (isProductInFavorites) {
        // Se estiver, remove
        return prevFavorites.filter(fav => fav.id !== product.id);
      } else {
        // Se não estiver, adiciona
        return [...prevFavorites, product];
      }
    });
  };

  // Função para verificar se um produto está na lista de favoritos
  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);