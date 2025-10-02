// src/TelaFavoritos/TelaFavoritos.jsx
import React from 'react';
import Navbar from '../Navbar/Navbar';
import { useFavorites } from '../TelaFavoritos/FavoriteContext';
import { Link } from 'react-router-dom';
import StarRating from '../TelaInicial/StarRating';
import Button from '../TelaInicial/Button';
import './TelaFavoritos.css'; // Crie este arquivo CSS para estilizar

function TelaFavoritos() {
  const { favorites, toggleFavorite, isFavorited } = useFavorites();

  return (
    <div>
      <Navbar/>
      <div className="div-favoritos-principal">
        <div className="container-favoritos">
        <h2 className='titulo-fav'>Meus Favoritos</h2>
        {favorites.length === 0 ? (
          <p>Você ainda não tem nenhum produto favorito. Adicione alguns!</p>
        ) : (
          <div className="lista-favoritos">
            {favorites.map(produto => (
              <div className="produto-favorito" key={produto.id}>
                <div className="icone-favorito">
                  <Button 
                    isFavorited={isFavorited(produto.id)} 
                    onClick={() => toggleFavorite(produto)} 
                  />
                </div>
                <Link to={`/produto/${produto.id}`} className="link-produto-card">
                  <div className='produto-imagem-container'>
                    <img className='foto-produtos' src={produto.image} alt={produto.name} />
                  </div>
                  <div className='produto-detalhes'>
                    <h3 className='titulo-produto-store'>{produto.name}</h3>
                    <p className='descricao-produto'>{produto.description}</p>
                    <p className="preco-produto-favorito"><span className='cor-amarela-preco-favorito'>R$</span>{produto.price.toFixed(2)}</p>
                    <div className="produto-avaliacao">
                      <StarRating rating={produto.rating} />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default TelaFavoritos;