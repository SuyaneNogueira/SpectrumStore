import React, { useContext } from 'react';
import './CarrinhoP2.css';
import Navbar from '../Navbar/Navbar';
import StarRating from '../TelaInicial/StarRating';
import { CartContext } from './CartContext'; 
import TrashIcon from '../imagens/trash-icon.png'; 
import { Link } from 'react-router-dom';

function CarrinhoP2() {
    const { cartItems, removeFromCart, toggleAllItems, toggleItem, selectAll, totalSelected } = useContext(CartContext);
  return (
 <div className='fundoPagamento'>
  <Navbar/>
  <div className='div-conteinerDeFora'>
    <div className='FundoBanco'> 
      <div className='Voltar'><Link to='/Carrinho'>dd</Link></div>
      <div className='div-conteinerDosProtudos'>
     <div className='div-protudos'>
      {cartItems && cartItems.map((item, index)=> 
      <div className='Protudos' key={item.cartItemId || index}>
      <div classname='imagem-protudo'>
      <img classname='imagem' src={item.image} alt={item.name} />
      </div>
         <div classname='Nome-Protudo-pagamento'>
          <p>{item.name}</p>
        </div>
        <div classname='valor-briquedo-pagamento'>
          <span className='cor-amarelo-preco-2'>R$:</span> {item.price.toFixed(2)}
        </div>
      </div>
        )}
     </div>
      </div>

    </div>

  </div>


 </div>
  )
}

export default CarrinhoP2