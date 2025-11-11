import "./HistoricoDeCompraModal.css";
import { useCart } from "../../Carrinho/CartContext";
import { Link, useNavigate } from "react-router-dom";
import '../../../Front-end/TelaFavoritos/TelaFavoritos'
function HistoricoDeCompraModal({ pedido, onClose }) {
  if (!pedido) return null; // Se não tiver pedido selecionado, não mostra nada

  const {
    cartItems,
    removeFromCart,
    toggleAllItems,
    toggleItem,
    selectAll,
    totalSelected,
    updateQuantity,
  } = useCart();

  const navigate = useNavigate()

  const irTelaProduto =() => {


    navigate('/produto/:id')

  }



  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <button className="modal-fechar" onClick={onClose}>✕</button>
        {cartItems && cartItems.map((produto, index) => (
        <div className="pedido-header"  key={produto.cartItemId || `produto-${index}`}>
          <div className="pedido-imagem"><img className="imagem-mesmo-produtos-carrinho" 
                src={produto.image} alt={produto.name}/></div>
          <div className="pedido-info">
            <h3 className="pedido-nome">{produto.name}</h3>
            <div className="span-pedido-preco">
            <span className="pedido-preco">R$ {(produto.price * (produto.quantidade || 1)).toFixed(2)}</span>
            <span className="pedido-quantidade">{produto.quantidade}</span>
            </div>
            <p>{produto.data}</p>
            <p>Número do Pedido: <strong>{produto.numero}</strong></p>
           <button className="botao-recomprar" onClick={irTelaProduto}>Recompra</button> 
          </div>
        </div>
      ))}

        <div className="pedido-status">
          <div className="etapa concluida">
            <div className="icone"></div>
            <p>Pedido Criado</p>
          </div>
          <div className="linha"></div>
          <div className="etapa concluida">
            <div className="icone"></div>
            <p>Pagamento Confirmado</p>
          </div>
          <div className="linha"></div>
          <div className="etapa atual">
            <div className="icone"></div>
            <p>Pedido Em andamento</p>
          </div>
          <div className="linha"></div>
          <div className="etapa">
            <div className="icone"></div>
            <p>Pronto para Retirada</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoricoDeCompraModal;
