import React from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';

function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div>
      <h1>Meus Favoritos</h1>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map(product => (
            <li key={product.id}>
              <img src={product.imagem} alt={product.nome} style={{ width: '50px' }} />
              {product.nome} - R${product.preco}
              <button onClick={() => toggleFavorite(product)}>Remover</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não tem nenhum produto favorito.</p>
      )}
    </div>
  );
}

export default FavoritesPage;