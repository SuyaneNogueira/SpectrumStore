import React, { useState } from "react";
import "./PerfilAdm.css";
import HistoricoDeCompraModal from "../../Front-End/TelaDePefil/Historico/HistoricoDeCompraModal";
// import EditarPerfil from "../Editar/EditarPerfil"; 
// import ExcluirPerfil from "../Excluir/ExcluirPerfil";
// import Suporte from "../Suporte/Suporte";
import { useCart } from "../../Front-End/Carrinho/CartContext";
// import StarRating from "../../TelaInicial/StarRating";
import { useFavorites } from '../../Front-end/TelaFavoritos/FavoriteContext';
// import Button from '../../TelaInicial/Button';
import { Link } from "react-router-dom";


function PerfilAdm() {
  const [abaAtiva, setAbaAtiva] = useState("meucarrinho");
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

  return (
    <div className="perfil-container-adm">
      <div className="perfil-topo-adm">
        <Link to='/LayoutAdm/Produtos'>
          <img src="voltarteladeperfil.png" alt="Voltar" className="VoltartelaDePerfil-adm" />
        </Link>
      </div>

      <div className="perfil-header-adm">
        <img src="https://via.placeholder.com/150" className="foto-perfil-adm" alt="Foto de perfil" />
        <div className="perfil-info-adm">
          <p><strong>Nome:</strong> Maria Knupp</p>
          <p><strong>Idade:</strong> 23</p>
          <p><strong>Pontos:</strong> 10</p>
        </div>

        {/* Botão de menu (três pontos) */}
        <div className="menu-container-adm">
          <button
            className="menu-icone-adm"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            <img className="container-ajustes-adm" src="ajustes.png" alt="ajustes" />
          </button>

          {menuAberto && (
            <div className="menu-ajustes-adm">
              <h4>Ajustes</h4>
              <button className="ajuste-opcao-editar-adm" onClick={() => setModalEditar(true)}>Editar Perfil</button>
              <button className="ajuste-opcao-excluir-adm" onClick={() => setModalExcluir(true)}>Excluir Perfil</button>
              <button className="ajuste-opcao-suporte-adm" onClick={() => setModalSuporte(true)}>Suporte</button>
            </div>
          )}
        </div>
      </div>

      {/* Abas */}
      <div className="perfil-abas-adm">
        <button
          className={abaAtiva === "meucarrinho" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("meucarrinho")}
        >
          Ultimas Mensagens
        </button>
        <button
          className={abaAtiva === "historico" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("historico")}
        >
      Denuncias
        </button>
        <input
          placeholder="Pesquisa"
          type="search"
          className="perfil-pesquisa"
          onChange={handleInputChange}
        />
      </div>

      {/* Conteúdo */}
      <div className="perfil-conteudo-adm">
        {abaAtiva === "meucarrinho" && (
          <div className="produtos-grid-perfil-carrinho-adm">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => ( 
                <div className="produto-card-perfil-carrinho-adm" key={index}>
                  <span className="favorito-perfil-carrinho-adm">
                    <Button 
                      isFavorited={isFavorited(item.id)} 
                      onClick={() => toggleFavorite(item)}
                    />
                  </span>
                  <div className="produto-imagem-container-adm">
                    <img 
                      className="imagem-mesmo-produtos-carrinho-adm" 
                      src={item.image} 
                      alt={item.name}
                    />
                    <span className="preco-perfil-carrinho-adm">
                      <span className="cor-amarela-preco-adm">R$</span> 
                      {(item.price * (item.quantidade || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="produto-detalhes-perfil-adm">
                    <h4 className="titulo-produto-perfil-adm">{item.name}</h4>
                    <div className="estrela-perfil-usuario-adm">
                      <StarRating rating={item.rating} />
                      <div className="quantidade-estrela-adm">
                        <span>{(item.quantidade)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Seu carrinho está vazio.</p>
            )}
          </div>
        )}

        {abaAtiva === "historico" && (
          <div className="produtos-grid-perfil-historico-adm">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => ( 
                <div 
                  className="produto-card-perfil-historico-adm"
                  key={index}
                  onClick={() => setPedidoSelecionado(item)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="favorito-perfil-historico-adm">
                    <Button 
                      isFavorited={isFavorited(item.id)} 
                      onClick={() => toggleFavorite(item)}
                    />
                  </span>
                  <div className="produto-imagem-container-adm">
                    <img 
                      className="imagem-mesmo-produtos-historico-adm" 
                      src={item.image} 
                      alt={item.name}
                    />
                    <span className="preco-perfil-historico-adm">
                      <span className="cor-amarela-preco-adm">R$</span> 
                      {(item.price * (item.quantidade || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="produto-detalhes-perfil-adm">
                    <h4 className="titulo-produto-perfil-adm">{item.name}</h4>
                    <p className="descricao-produto-perfil-adm">{item.description}</p>
                    <div className="estrela-perfil-usuario-adm">
                      <StarRating rating={item.rating} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Você ainda não fez nenhuma compra.</p>
            )}
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

export default PerfilAdm;