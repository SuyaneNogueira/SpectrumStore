import React from 'react';
import './CarrinhoP2.css';
import Navbar from '../Navbar/Navbar';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';
import CartaoCredito from '../imagens/cartao-credito.png';
import CartaoDebito from '../imagens/cartao-debito.png';
import Pix from '../imagens/pix.png';
import Visa from '../imagens/visa.png';
import Nubank from '../imagens/nubank.png';
import Mastercard from '../imagens/mastercard.png';
import Bradesco from '../imagens/bradesco.png';

function CarrinhoP2() {
    const { cartItems } = useCart();
    
    // Simulação dos valores de desconto e frete, você pode ajustar
    const frete = 20.00;
    const desconto = 50.00;
    
    // Cálculo do total dos produtos (considera apenas itens com quantidade)
    const totalProdutos = cartItems.reduce((total, item) => total + (item.price * (item.quantidade || 1)), 0);

    // Cálculo do total final
    const totalFinal = totalProdutos + frete - desconto;

    return (
        <div className='fundoPagamento'>
            <Navbar />
            <div className='div-conteinerDeFora'>
                <div className='FundoBanco'>
                    <div className='Voltar'>
                        <Link to='/Carrinho'>Voltar</Link>
                    </div>
                    
                    {/* Container de Produtos */}
                    <div className='div-conteinerDosProtudos'>
                        <div className='div-protudos'>
                            {cartItems && cartItems.map((item, index) =>
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
                            )}
                        </div>
                    </div>

                    {/* Container de Pagamento e Resumo */}
                    <div className="resumo-e-botoes-compra">
                        
                        {/* Seção de Formas de Pagamento */}
                        <div className="forma-pagamento">
                            <h2>Formas de Pagamentos</h2>
                            <div className="opcoes-pagamento">
                                {/* Opção de Cartão de Crédito */}
                                <label className="opcao-item">
                                    <input type="radio" name="formaPagamento" value="credito" />
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

                                {/* Opção de Cartão de Débito */}
                                <label className="opcao-item">
                                    <input type="radio" name="formaPagamento" value="debito" />
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

                                {/* Opção de Pix */}
                                <label className="opcao-item">
                                    <input type="radio" name="formaPagamento" value="pix" />
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
                                    <p>Total de desconto: R${desconto.toFixed(2)}</p>
                                    <p>Frete: R${frete.toFixed(2)}</p>
                                </div>
                                <div className="total-final">
                                    <p>Total Geral: R${totalFinal.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="botao-pagar-cancelar-compra">
                                <button className='botao-cancelar'>Cancelar Compra</button>
                                <button className='botao-pagar'>Pagar Compra</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarrinhoP2;