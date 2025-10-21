import React, { useState } from 'react';
import './CarrinhoP2.css';
import Navbar from '../Navbar/Navbar';
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

// Importações de Imagens (assumindo que estes paths estão corretos)
import CartaoCredito from '../imagens/cartao-credito.png';
import CartaoDebito from '../imagens/cartao-debito.png';
import Pix from '../imagens/pix.png';
import Visa from '../imagens/visa.png';
import Nubank from '../imagens/nubank.png';
import Mastercard from '../imagens/mastercard.png';
import Bradesco from '../imagens/bradesco.png';


function CarrinhoP2() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  
  // 1. ESTADO para controlar qual forma de pagamento está selecionada
  const [formaPagamento, setFormaPagamento] = useState(''); 

  const cancelarCompra = () => {
  // Redireciona para a página do carrinho
  window.location.href = '/Carrinho';
};

  // Simulação dos valores de desconto e frete
  const frete = 0.00;
  const desconto = 0.00;

  // Total dos produtos selecionados
  const totalProdutos = cartItems.reduce((total, item) => total + (item.price * (item.quantidade || 1)), 0);

  // Total final com frete e desconto
  const totalFinal = totalProdutos + frete - desconto;

  // Função para capturar a mudança na forma de pagamento
  const handlePaymentChange = (event) => {
      setFormaPagamento(event.target.value);
  }

  // Função para enviar pedido ao backend

const stripePromise = loadStripe("pk_test_51SID8yPG8QyczJkkb6grVBHmEOKZDegxspa37FTCnGJAPJKcLrXw8g0SG6I7UaJHGnC8dX9p0YqMVZDzIH1c8OE700HmNMipkn");

const finalizarCompra = async () => {
  if (cartItems.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  try {
    const cartItemsParaStripe = cartItems.map(item => ({
      name: item.name,
      image: item.image?.startsWith("http")
        ? item.image
        : "https://via.placeholder.com/150", // URL válida temporária
      price: Number(item.price),
      quantity: item.quantidade || 1
    }));

    const res = await fetch("http://localhost:3001/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cartItemsParaStripe }),
    });

    const data = await res.json();

    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      console.error("❌ Erro ao criar sessão:", data);
      alert("Erro ao criar sessão de pagamento.");
    }
  } catch (err) {
    console.error("Erro ao enviar pedido:", err);
    alert("Erro ao processar pagamento.");
  }
};

  return (
    <div className='fundoPagamento'>
      <Navbar />
      <div className='div-conteinerDeFora'>
        <div className='FundoBanco'>
          <div className='Voltar'>
            <Link to='/Carrinho'>Voltar</Link>
          </div>

          {/* Produtos */}
          <div className='div-conteinerDosProtudos'>
            <div className='div-protudos'>
              {cartItems && cartItems.map((item, index) => (
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
                      {item.quantidade} unidade(s)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formas de pagamento e resumo */}
          <div className="resumo-e-botoes-compra">

            <div className="forma-pagamento">
              <h2>Formas de Pagamentos</h2>
              <div className="opcoes-pagamento">

                {/* Opção Cartão de Crédito */}
                <label className="opcao-item">
                  <input 
                    type="radio" 
                    name="formaPagamento" 
                    value="credito" 
                    onChange={handlePaymentChange} 
                    checked={formaPagamento === 'credito'}
                  />
                  <div className="info-pagamento">
                    <div className="icone-pagamento">
                      <img src={CartaoCredito} alt="Cartão de Crédito" className='img-cartao-credito' />
                    </div>
                    <div className="texto-pagamento">
                      <h4>Cartões de crédito aceitos</h4>
                      <div className="bandeiras">
                        <img src={Visa} alt="Visa" />
                        <img src={Nubank} alt="Nubank" />
                        <img src={Mastercard} alt="Mastercard" />
                        <img src={Bradesco} alt="Bradesco" />
                      </div>
                    </div>
                  </div>
                </label>

                {/* Opção Cartão de Débito */}
                <label className="opcao-item">
                  <input 
                    type="radio" 
                    name="formaPagamento" 
                    value="debito" 
                    onChange={handlePaymentChange} 
                    checked={formaPagamento === 'debito'}
                  />
                  <div className="info-pagamento">
                    <div className="icone-pagamento">
                      <img src={CartaoDebito} alt="Cartão de Débito" className='img-cartao-debito' />
                    </div>
                    <div className="texto-pagamento">
                      <h4>Cartões de débito aceitos</h4>
                      <div className="bandeiras">
                        <img src={Visa} alt="Visa" />
                        <img src={Nubank} alt="Nubank" />
                        <img src={Mastercard} alt="Mastercard" />
                        <img src={Bradesco} alt="Bradesco" />
                      </div>
                    </div>
                  </div>
                </label>

                {/* Opção Pix */}
                <label className="opcao-item">
                  <input 
                    type="radio" 
                    name="formaPagamento" 
                    value="pix" 
                    onChange={handlePaymentChange} 
                    checked={formaPagamento === 'pix'}
                  />
                  <div className="info-pagamento">
                    <div className="icone-pagamento">
                      <img src={Pix} alt="Pix" className='img-pix' />
                    </div>
                    <div className="texto-pagamento">
                      <h4>Pix</h4>
                    </div>
                  </div>
                </label>

              </div>
            </div>

            <div className="resumo-e-botoes-acoes">
              <div className="total-geral">
                <div className="resumo-valores">
                  <p>Total dos Produtos: R${totalProdutos.toFixed(2)}</p>
                </div>
                <div className="total-final">
                  <p>Total Geral: R${totalFinal.toFixed(2)}</p>
                </div>
              </div>

              <div className="botao-pagar-cancelar-compra">
                <button className='botao-cancelar' onClick={cancelarCompra}>Cancelar Compra</button>
                <button className='botao-pagar' onClick={finalizarCompra}>Pagar Compra</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarrinhoP2;