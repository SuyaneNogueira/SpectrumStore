import React, { useState } from 'react';
import './CarrinhoP2.css';
import Navbar from '../Navbar/Navbar';
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
  const finalizarCompra = async () => {
  const usuarioIdFixo = 1;

  if (cartItems.length === 0 || totalFinal <= 0) {
    alert('O carrinho está vazio.');
    return;
  }

  if (!formaPagamento) {
    alert('Por favor, selecione uma forma de pagamento para continuar.');
    return;
  }

  const pedidoBackend = {
    usuario_id: usuarioIdFixo,
    data_pedido: new Date().toISOString(),
    total: totalFinal.toFixed(2),
    forma_pagamento: formaPagamento,
    status: 'Aguardando Pagamento',
  };

  console.log('Dados do Pedido a enviar (verifique se os campos estão preenchidos):', pedidoBackend);

  try {
    const resposta = await fetch('http://localhost:3001/api/pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoBackend),
    });

    const dados = await resposta.json();
    alert(`Pedido #${dados.pedido.id} criado com sucesso!`);

    if (!resposta.ok) {
      const erroDados = await resposta.json().catch(() => null);
      const mensagemErro = erroDados?.error || `Erro desconhecido. Status: ${resposta.status}`;
      throw new Error(mensagemErro);
    }

    // Redirecionamento ou limpeza de carrinho
    // window.location.href = '/';

  }catch (erro) {
  console.error('Erro ao enviar pedido:', erro);
  if (erro.response) {
    // caso você use axios, por exemplo
    alert(`Falha ao enviar pedido. Detalhes: ${erro.response.data.details || erro.message}`);
  } else {
    alert(`Falha ao enviar pedido. Detalhes: ${erro.message}`);
  }
}

};


  // Função para cancelar compra: redirecionar para a tela inicial
  const cancelarCompra = () => {
    window.location.href = '/'; 
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