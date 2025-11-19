import React, { useState, useEffect } from "react";
import "./CarrinhoP2.css";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import CartaoCredito from "../imagens/cartao-credito.png";
import CartaoDebito from "../imagens/cartao-debito.png";
import Pix from "../imagens/pix.png";
import Visa from "../imagens/visa.png";
import Nubank from "../imagens/nubank.png";
import Mastercard from "../imagens/mastercard.png";
import Bradesco from "../imagens/bradesco.png";

function CarrinhoP2() {

  const [cartItems, setCartItems] = useState([]); 
  
  useEffect(() => {
    const itensSalvos = localStorage.getItem("itensPagamento");
    if (itensSalvos) {
      const itensParseados = JSON.parse(itensSalvos);
      setCartItems(itensParseados);
      console.log("Itens carregados do localStorage para pagamento:", itensParseados);
    }
  }, []); 

  const [formaPagamento, setFormaPagamento] = useState("");

  const cancelarCompra = () => {
    window.location.href = "/Carrinho";
  };

  const frete = 0.0;
  const desconto = 0.0;

  // (Esta função agora vai usar os 'cartItems' corretos do localStorage)
  const totalProdutos = cartItems.reduce(
    (total, item) => total + item.price * (item.quantidade || 1),
    0
  );

  const totalFinal = totalProdutos + frete - desconto;

  const handlePaymentChange = (event) => {
    setFormaPagamento(event.target.value);
  };

  // (Esta função que você colou agora vai funcionar, pois 'cartItems' está correto)
  const finalizarCompra = async () => {
    if (cartItems.length === 0) {
      alert("O carrinho está vazio.");
      return;
    }

    if (!formaPagamento) {
      alert("Escolha uma forma de pagamento.");
      return;
    }

    // DEBUG: Verifique o que você está prestes a enviar
    console.log("Enviando estes cartItems (do localStorage) para o backend:", JSON.stringify(cartItems, null, 2));

    try {
      
      // O seu bloco 'cartItemsParaStripe' está comentado (ou apagado), o que está CORRETO.

      // Este fetch agora envia os 'cartItems' corretos (com 'customizations')
      const res = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cartItems, // <--- CORRETO
          paymentMethod: formaPagamento,
        }),
      });

    // --- MELHORIA NO TRATAMENTO DE ERRO ---
    const data = await res.json(); 

    if (!res.ok) {
      console.error("❌ Erro retornado pelo backend:", data);
      throw new Error(data.error || data.message || "Erro do servidor");
    }
    // --- FIM DA MELHORIA ---

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("❌ Erro ao criar sessão: URL não recebida.", data);
      alert("Erro ao criar sessão de pagamento.");
    }
    
  } catch (err) {
    console.error("Erro ao enviar pedido:", err);
    alert(`Erro ao processar pagamento: ${err.message}`);
  }
};

return (
    <div className="fundoPagamento">
      <Navbar />
      <div className="div-conteinerDeFora">
        <div className="FundoBanco">
          <div className="Voltar-pagamentos">
            <Link className="Voltar-pagamentos-link" to="/Carrinho">Voltar</Link>
          </div>

          {/* Produtos */}
          <div className="div-conteinerDosProtudos">
            <div className="div-protudos">
              {cartItems &&
                cartItems.map((item, index) => (
                  <div className="Protudos" key={item.cartItemId || index}>
                    <div className="imagem-protudo-pagamento">
                      <img
                        className="imagem-pagamento"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="infomações-protudo-pagamento">
                      <div className="Nome-Protudo-pagamento">
                        <p className="nome-pagamento">{item.name}</p>
                      </div>
                      <div className="valor-briquedo-pagamento">
                        <span className="cor-amarelo-preco-2-pagamento">
                          R$:
                        </span>{" "}
                        <span className="preço-pagamento-protudos">
                          {item.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="quantidade-pagamento">
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
                {/* Cartão de Crédito */}
                <label className="opcao-item">
                  <input
                    type="radio"
                    name="formaPagamento"
                    value="card"
                    onChange={handlePaymentChange}
                    checked={formaPagamento === "card"}
                  />
                  <div className="info-pagamento">
                    <div className="icone-pagamento">
                      <img
                        src={CartaoCredito}
                        alt="Cartão de Crédito"
                        className="img-cartao-credito"
                      />
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

                {/* Cartão de Débito */}
                <label className="opcao-item">
                  <input
                    type="radio"
                    name="formaPagamento"
                    value="card" // Stripe não diferencia crédito/debito no checkout
                    onChange={handlePaymentChange}
                    checked={formaPagamento === "card"}
                  />
                  <div className="info-pagamento">
                    <div className="icone-pagamento">
                      <img
                        src={CartaoDebito}
                        alt="Cartão de Débito"
                        className="img-cartao-debito"
                      />
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

                {/* Pix */}
                <label className="opcao-item">
                  <input
                    type="radio"
                    name="formaPagamento"
                    value="pix"
                    onChange={handlePaymentChange}
                    checked={formaPagamento === "pix"}
                  />
                  <div className="info-pagamento">
                    <div className="icone-pagamento">
                      <img src={Pix} alt="Pix" className="img-pix" />
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
                <button className="botao-cancelar" onClick={cancelarCompra}>
                  Cancelar Compra
                </button>
                <button className="botao-pagar" onClick={finalizarCompra}>
                  Pagar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarrinhoP2;
