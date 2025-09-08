import React, { useContext } from 'react';
import './CarrinhoP1.css';
import Navbar from '../Navbar/Navbar';
import StarRating from '../TelaInicial/StarRating';
import { CartContext } from './CartContext';
import TrashIcon from '../imagens/trash-icon.png'; 

function CarrnhoP1() {
  const { cartItems, removeFromCart, toggleAllItems, toggleItem, selectAll, totalSelected } = useContext(CartContext);

  return (
    <div className='fundoCarrinho'>
      <Navbar/>
      <div className='sssssss'>
        <div className='CoisaBrancaCarrinho'>
          <div className='Comprar-tudo'>
            <div className="content">
             <label className="checkBox">
               <input 
                 id="ch-tudo" 
                 type="checkbox" 
                 checked={selectAll}
                 onChange={(e) => toggleAllItems(e.target.checked)}
               />
               <div className="transition" />
             </label>
            </div>
            <span className='comprar-tudo-div'>Comprar tudo</span>
          </div>
          <div className="lista-produtos-scroll">
          {cartItems && cartItems.map((item, index) => (
            <div className='Card1' key={item.cartItemId || `item-${index}`}>
              <div className='div-checkbox-e-imagem'>
                <div className="content">
                  <label className="checkBox">
                    <input 
                      id={`ch-${item.cartItemId}`} 
                      type="checkbox" 
                      checked={item.isSelected}
                      onChange={() => toggleItem(item.cartItemId)}
                    />
                    <div className="transition" />
                  </label>
                </div>
                <div className='div-imagem-produto-carrinho'>
                  <div className='imagem-carrinho-logo'>
                    <img className='imagem-mesmo-produtos-carrinho' src={item.image} alt={item.name} />
                  </div>
                </div> 
                <div className='Descrição-estrela'> 
                  <div className='estrela'>
                    <StarRating rating={item.rating} />
                  </div>
                  <div className='descrição'>
                    <p>{item.name}</p>
                    {item.personalizacoes && Object.entries(item.personalizacoes).length > 0 && (
                      <div className="personalizacoes-carrinho">
                        {Object.entries(item.personalizacoes).map(([key, value]) => (
                          <div key={key} className="personalizacao-item-carrinho">
                            <span className="personalizacao-chave">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                            {key === 'cor' || key === 'corFundo' || key === 'corPrincipal' ? (
                              <div 
                                className="cor-carrinho" 
                                style={{ backgroundColor: value.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e') }}
                                title={value}
                              />
                            ) : (
                              <span className="personalizacao-valor">{value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className='div-valor-brinquedo-carrinho'>
                      <span className='cor-amarelo-preco-2'>R$:</span> {item.price.toFixed(2)}
                  </div>
                </div>
                <div className='div-trash-icon'>
                  <button onClick={() => removeFromCart(item.cartItemId)}>
                    <img src={TrashIcon} alt="Remover" className="trash-icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
          <div className='div-button-carrinho'>
              <div className='div-total'>
                  Total: {totalSelected.toFixed(2)}
              </div>
            <div>
              <button>Comprar itens</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarrnhoP1;