import React, { useState } from "react";
import "./TelaDePerfil.css";
import HistoricoDeCompraModal from "./HistoricoDeCompraModal";

function TelaDePerfil() {
  const [abaAtiva, setAbaAtiva] = useState("historico");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const handleInputChange = (event) => {
    
    console.log("Pesquisa:", event.target.value);
  };


  const pedidos = [
    {
      id: 1,
      nome: "Quebra-cabeça",
      preco: 40.00,
      qtd: 1,
      data: "07 Setembro 2024",
      numero: "GSHNDN49Q0Q2RMF",
      devolucao: "Antes de 15/10/2024",
      descricao: "Quebra-cabeça de madeira com 50 peças para estimular a coordenação motora.",
    },
  ];

  return (
    <div className="perfil-container">
      <div className="perfil-topo"></div>
      <div className="perfil-container">
        <div className="perfil-header">
          <img
            src="https://via.placeholder.com/150"
            className="foto-perfil"
          />
          <div className="perfil-info">
            <p><strong>Nome:</strong> Maria Knupp</p>
            <p><strong>CPF:</strong> 110100100010</p>
            <p><strong>Idade:</strong> 23</p>
          </div>
        </div>

        {/* Abas */}
        <div className="perfil-abas">
          <button
            className={abaAtiva === "historico" ? "aba ativa" : "aba"}
            onClick={() => setAbaAtiva("historico")}
          >
            Histórico de compras realizadas
          </button>
          <button
            className={abaAtiva === "avaliacoes" ? "aba ativa" : "aba"}
            onClick={() => setAbaAtiva("avaliacoes")}
          >
            Avaliações
          </button>
          <input
            placeholder="Pesquisa"
            type="search"
            className="perfil-pesquisa"
            onChange={handleInputChange}
          />
        </div>

        {/* Conteúdo */}
        <div className="perfil-conteudo">
          {abaAtiva === "historico" && (
            <div className="produtos-grid">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="produto-card"
                  onClick={() => setPedidoSelecionado(pedido)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="imagem-produto"></div>
                  <span className="preco">R$ {pedido.preco}</span>
                  <h4>{pedido.nome}</h4>
                  <p>{pedido.descricao}</p>
                  <span className="favorito">♥</span>
                </div>
              ))}
            </div>
          )}

          {abaAtiva === "avaliacoes" && (
            <div>
              <p>Você ainda não fez nenhuma avaliação.</p>
            </div>
          )}
        </div>
      </div>
      <HistoricoDeCompraModal pedido={pedidoSelecionado} onClose={() => setPedidoSelecionado(null)} />
    </div>
  );
}

export default TelaDePerfil;
