import React, { useState } from "react";
import "./TelaDePerfil.css";
import HistoricoDeCompraModal from "../Historico/HistoricoDeCompraModal";
import EditarPerfil from "../Editar/EditarPerfil"; 
import ExcluirPerfil from "../Excluir/ExcluirPerfil";
import Suporte from "../Suporte/Suporte";

function TelaDePerfil() {
  const [abaAtiva, setAbaAtiva] = useState("historico");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  // estados para abrir os modais
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalSuporte, setModalSuporte] = useState(false);

  const handleInputChange = (event) => {
    console.log("Pesquisa:", event.target.value);
  };

  const pedidos = [
    {
      id: 1,
      nome: "Quebra-cabeça",
      preco: 40.0,
      qtd: 1,
      data: "07 Setembro 2024",
      numero: "GSHNDN49Q0Q2RMF",
      devolucao: "Antes de 15/10/2024",
      descricao:
        "Quebra-cabeça de madeira com 50 peças para estimular a coordenação motora.",
    },
  ];

  return (
    <div className="perfil-container">
      <div className="perfil-topo"></div>

      <div className="perfil-header">
        <img src="https://via.placeholder.com/150" className="foto-perfil" />
        <div className="perfil-info">
          <p><strong>Nome:</strong> Maria Knupp</p>
          <p><strong>Idade:</strong> 23</p>
          <p><strong>Pontos:</strong> 10</p>
        </div>

        {/* Botão de menu (três pontos) */}
        <div className="menu-container">
          <button
            className="menu-icone"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <img className="container-ajustes" src="ajustes.png" alt="ajustes" />
          </button>

          {menuAberto && (
            <div className="menu-ajustes">
  <h4>Ajustes</h4>
  <button className="ajuste-opcao-editar" onClick={() => setModalEditar(true)}>Editar Perfil</button>
  <button className="ajuste-opcao-excluir" onClick={() => setModalExcluir(true)}>Excluir Perfil</button>
  <button className="ajuste-opcao-suporte" onClick={() => setModalSuporte(true)}>Suporte</button>
</div>

          )}
        </div>
      </div>

      {/* Abas */}
      <div className="perfil-abas">
        <button
          className={abaAtiva === "historico" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("historico")}
        >
          Histórico de Compras Realizadas
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
                {/* <p className="container-descricao">{pedido.descricao}</p> */}
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

      {/* Modais */}
      <HistoricoDeCompraModal
        pedido={pedidoSelecionado}
        onClose={() => setPedidoSelecionado(null)}
      />

      {modalEditar && <EditarPerfil onClose={() => setModalEditar(false)} />}
      {modalExcluir && <ExcluirPerfil onClose={() => setModalExcluir(false)} />}
      {modalSuporte && <Suporte onClose={() => setModalSuporte(false)} />}

    </div>
  );
}

export default TelaDePerfil;
