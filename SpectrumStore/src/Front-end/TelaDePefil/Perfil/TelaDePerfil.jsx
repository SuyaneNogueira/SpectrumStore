import React, { useState } from "react";
import "./TelaDePerfil.css";
import HistoricoDeCompraModal from "../Historico/HistoricoDeCompraModal";
import EditarPerfil from "../Editar/EditarPerfil"; 
import ExcluirPerfil from "../Excluir/ExcluirPerfil";
import Suporte from "../Suporte/Suporte";
import { useCart } from "../../Carrinho/CartContext";
import StarRating from "../../TelaInicial/StarRating";
import { useFavorites } from '../../TelaFavoritos/FavoriteContext';
import Button from '../../TelaInicial/Button';
import { Link } from "react-router-dom";

function TelaDePerfil() {
  const [abaAtiva, setAbaAtiva] = useState("historico");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();

  // estados para abrir os modais
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalSuporte, setModalSuporte] = useState(false);

  const handleInputChange = (event) => {
    console.log("Pesquisa:", event.target.value);
  };

  const {
    cartItems,
    removeFromCart,
    toggleAllItems,
    toggleItem,
    selectAll,
    totalSelected,
    updateQuantity,
  } = useCart();

// function historicoB() {

//   if (finalizarCompra) {
//     setAbaAtiva("historico")
    
//   } else{
//     <div>
//      <p>Você ainda não fez nenhuma compra.</p>
//     </div>
//   }
  
// }

  return (
    <div className="perfil-container">
      <div className="perfil-topo"><Link to='/TelaInicial'><img src="voltarteladeperfil.png" alt="" className="VoltartelaDePerfil" /></Link></div>

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
          className={abaAtiva === "meucarrinho" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("meucarrinho")}
        >
          Meu Carrinho
        </button>
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
        {abaAtiva === "meucarrinho" && (
          <div className="produtos-grid-perfil-carrinho">
           
            {cartItems && cartItems.map((item, index) => ( 
              <div>
              <div
              key={item.cartItemId || `item-${index}`}
                className="produto-card-perfil-carrinho"
                style={{ cursor: "pointer" }}>
                  <span className="favorito-perfil-carrinho"><Button isFavorited={isFavorited(item.id)} 
                    onClick={() => toggleFavorite(item)}/></span>
                <div className="imagem-produto-perfil-carrinho"><img className="imagem-mesmo-produtos-carrinho" 
                src={item.image} alt={item.name}/></div>
                <span className="preco-perfil-carrinho">R$ {(item.price * (item.quantidade || 1)).toFixed(2)}</span>
                <h4 className="container-descricao-perfil-carrinho">{item.name}</h4>
                <p className="container-descricao">{pedido.descricao}</p>
              
                  <div className="estrela-perfil-usuario"><StarRating rating={item.rating}  /></div>
              </div>
              </div>
            ))}
            
          </div>
        )}

         {abaAtiva === "historico" && (
          <div className="produtos-grid-perfil-historico">
           
            {cartItems && cartItems.map((item, index) => ( 
              <div className="produto-geral-historico-perfil">
              <div
              key={item.cartItemId || `item-${index}`}
                className="produto-card-perfil-historico"
                onClick={() => setPedidoSelecionado(item)}
                style={{ cursor: "pointer" }}>
                  <div className="favorito-e-imagem">
                    <span className="favorito-perfil-historico"><Button isFavorited={isFavorited(item.id)} 
                    onClick={() => toggleFavorite(item)}/></span>
                <div className="imagem-produto-perfil-historico"><img className="imagem-mesmo-produtos-historico" 
                src={item.image} alt={item.name}/></div>
                </div>
                <span className="preco-perfil-historico">R$ {(item.price * (item.quantidade || 1)).toFixed(2)}</span>
                <h4 className="container-descricao-perfil-historico">{item.name}</h4>
                {/* <p className="container-descricao">{pedido.descricao}</p> */}
              
                    <div className="estrela-perfil-usuario"><StarRating rating={item.rating}  /></div>
              </div>
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
