// TelaDePerfil.jsx
import React, { useState, useEffect } from "react";
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
  const [abaAtiva, setAbaAtiva] = useState("meucarrinho");
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const { toggleFavorite, isFavorited } = useFavorites();

  // Estados para os modais
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalSuporte, setModalSuporte] = useState(false);

  // Estado para dados do usuário
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    dataNascimento: "",
    pontos: 10, // Pontos iniciais
    foto: "https://via.placeholder.com/150"
  });

  // Carregar dados do usuário do localStorage ao montar o componente
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = () => {
    try {
      const userData = localStorage.getItem('userData');
      const authToken = localStorage.getItem('authToken');
      
      if (userData && authToken) {
        const usuarioSalvo = JSON.parse(userData);
        setUsuario(prev => ({
          ...prev,
          nome: usuarioSalvo.nome || "",
          email: usuarioSalvo.email || "",
          dataNascimento: usuarioSalvo.dataNascimento || "",
          foto: usuarioSalvo.foto || "https://via.placeholder.com/150"
        }));
        console.log("✅ Dados do usuário carregados:", usuarioSalvo);
      } else {
        console.log("⚠️ Nenhum usuário logado encontrado");
        // Redirecionar para login se não estiver logado
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("❌ Erro ao carregar dados do usuário:", error);
    }
  };

  // Calcular idade a partir da data de nascimento
  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return "Não informada";
    
    try {
      // Converter de DD/MM/AAAA para Date
      let data;
      if (dataNascimento.includes('/')) {
        const [dia, mes, ano] = dataNascimento.split('/');
        data = new Date(ano, mes - 1, dia);
      } else {
        data = new Date(dataNascimento);
      }
      
      const hoje = new Date();
      let idade = hoje.getFullYear() - data.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNascimento = data.getMonth();
      
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < data.getDate())) {
        idade--;
      }
      
      return `${idade} anos`;
    } catch (error) {
      console.error("Erro ao calcular idade:", error);
      return "Não informada";
    }
  };

  // Atualizar dados do usuário (quando editar perfil)
  const atualizarDadosUsuario = (novosDados) => {
    setUsuario(prev => ({
      ...prev,
      ...novosDados
    }));
    
    // Atualizar também no localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const usuarioAtualizado = {
        ...JSON.parse(userData),
        ...novosDados
      };
      localStorage.setItem('userData', JSON.stringify(usuarioAtualizado));
    }
  };

  // Handler para pesquisa
  const handleInputChange = (event) => {
    console.log("Pesquisa:", event.target.value);
  };

  // Dados do carrinho
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
    <div className="perfil-container">
      <div className="perfil-topo">
        <Link to='/TelaInicial'>
          <img src="voltarteladeperfil.png" alt="Voltar" className="VoltartelaDePerfil" />
        </Link>
      </div>

      <div className="perfil-header">
        <img 
          src={usuario.foto} 
          className="foto-perfil" 
          alt={`Foto de perfil de ${usuario.nome}`} 
        />
        <div className="perfil-info">
          <p><strong>Nome:</strong> {usuario.nome || "Não informado"}</p>
          <p><strong>Email:</strong> {usuario.email || "Não informado"}</p>
          <p><strong>Idade:</strong> {calcularIdade(usuario.dataNascimento)}</p>
          <p><strong>Pontos:</strong> {usuario.pontos}</p>
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
              <button 
                className="ajuste-opcao-editar" 
                onClick={() => {
                  setModalEditar(true);
                  setMenuAberto(false);
                }}
              >
                Editar Perfil
              </button>
              <button 
                className="ajuste-opcao-excluir" 
                onClick={() => {
                  setModalExcluir(true);
                  setMenuAberto(false);
                }}
              >
                Excluir Perfil
              </button>
              <button 
                className="ajuste-opcao-suporte" 
                onClick={() => {
                  setModalSuporte(true);
                  setMenuAberto(false);
                }}
              >
                Suporte
              </button>
              <button 
                className="ajuste-opcao-sair"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('userData');
                  window.location.href = "/login";
                }}
              >
                Sair
              </button>
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
          Histórico de Compras
        </button>
        <button
          className={abaAtiva === "avaliacoes" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("avaliacoes")}
        >
          Avaliações
        </button>
        <input
          placeholder="Pesquisar produtos..."
          type="search"
          className="perfil-pesquisa"
          onChange={handleInputChange}
        />
      </div>

      {/* Conteúdo */}
      <div className="perfil-conteudo">
        {abaAtiva === "meucarrinho" && (
          <div className="produtos-grid-perfil-carrinho">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => ( 
                <div className="produto-card-perfil-carrinho" key={index}>
                  <span className="favorito-perfil-carrinho">
                    <Button 
                      isFavorited={isFavorited(item.id)} 
                      onClick={() => toggleFavorite(item)}
                    />
                  </span>
                  <div className="produto-imagem-container">
                    <img 
                      className="imagem-mesmo-produtos-carrinho" 
                      src={item.image} 
                      alt={item.name}
                    />
                    <span className="preco-perfil-carrinho">
                      <span className="cor-amarela-preco">R$</span> 
                      {(item.price * (item.quantidade || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="produto-detalhes-perfil">
                    <h4 className="titulo-produto-perfil">{item.name}</h4>
                    <div className="estrela-perfil-usuario">
                      <StarRating rating={item.rating} />
                      <div className="quantidade-estrela">
                        <span>Quantidade: {item.quantidade || 1}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-remover-carrinho"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="carrinho-vazio">
                <p>Seu carrinho está vazio.</p>
                <Link to="/TelaInicial" className="btn-continuar-comprando">
                  Continuar Comprando
                </Link>
              </div>
            )}
          </div>
        )}

        {abaAtiva === "historico" && (
          <div className="produtos-grid-perfil-historico">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => ( 
                <div 
                  className="produto-card-perfil-historico"
                  key={index}
                  onClick={() => setPedidoSelecionado(item)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="favorito-perfil-historico">
                    <Button 
                      isFavorited={isFavorited(item.id)} 
                      onClick={() => toggleFavorite(item)}
                    />
                  </span>
                  <div className="produto-imagem-container">
                    <img 
                      className="imagem-mesmo-produtos-historico" 
                      src={item.image} 
                      alt={item.name}
                    />
                    <span className="preco-perfil-historico">
                      <span className="cor-amarela-preco">R$</span> 
                      {(item.price * (item.quantidade || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="produto-detalhes-perfil">
                    <h4 className="titulo-produto-perfil">{item.name}</h4>
                    <p className="descricao-produto-perfil">{item.description}</p>
                    <div className="estrela-perfil-usuario">
                      <StarRating rating={item.rating} />
                    </div>
                    <div className="info-compra">
                      <span>Comprado em: {new Date().toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="historico-vazio">
                <p>Você ainda não fez nenhuma compra.</p>
                <Link to="/TelaInicial" className="btn-descobrir-produtos">
                  Descobrir Produtos
                </Link>
              </div>
            )}
          </div>
        )}

        {abaAtiva === "avaliacoes" && (
          <div className="avaliacoes-container">
            <div className="avaliacoes-vazias">
              <p>Você ainda não fez nenhuma avaliação.</p>
              <p>Compre produtos e compartilhe sua experiência!</p>
              <Link to="/TelaInicial" className="btn-explorar-produtos">
                Explorar Produtos
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modais */}
      <HistoricoDeCompraModal
        pedido={pedidoSelecionado}
        onClose={() => setPedidoSelecionado(null)}
      />

      {modalEditar && (
        <EditarPerfil 
          onClose={() => setModalEditar(false)}
          usuario={usuario}
          onSalvar={atualizarDadosUsuario}
        />
      )}
      
      {modalExcluir && (
        <ExcluirPerfil 
          onClose={() => setModalExcluir(false)}
          onExcluir={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = "/";
          }}
        />
      )}
      
      {modalSuporte && (
        <Suporte 
          onClose={() => setModalSuporte(false)}
          usuario={usuario}
        />
      )}
    </div>
  );
}

export default TelaDePerfil;