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
      <div className='imagem-protudo-pagamento'>
      <img className='imagem-pagamento' src={item.image} alt={item.name} />
      </div>
      <div className='infomações-protudo-pagamento'>
         <div className='Nome-Protudo-pagamento'>
          <p className='nome-pagamento'>{item.name}</p>
        </div>
        <div className='valor-briquedo-pagamento'>
          <span className='cor-amarelo-preco-2-pagamento'>R$:</span> <span className='preço-pagamento-protudos'>{item.price.toFixed(2)}</span>
        </div>
        <div className='quantidade-pagamento'>
          ggggg
        </div>
      </div>
        
      </div>
        )}
     </div>
      </div>
    <div className="Card2-pagamento">
      <div className="forma-pagamento-desistir">
        <div className="forma-pagamento"></div>
        <div className="botao-cancelar-compra">
        <button className='botao-cancelar'>Cancelar Compra</button>
        </div>

      </div>

      <div className="total-geral-desconto-pagar">
        <div className="total-geral"></div>
        <div className="botao-pagar-compra">
         <button className='botao-pagar'>Pagar Compra</button> 
        </div>
        
      </div>

    </div>

    </div>

  </div>


 </div>
  )
}

export default CarrinhoP2