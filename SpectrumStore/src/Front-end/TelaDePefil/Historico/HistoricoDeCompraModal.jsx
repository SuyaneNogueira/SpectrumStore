import "./HistoricoDeCompraModal.css";
import { useCart } from "../../Carrinho/CartContext";
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
  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <button className="modal-fechar" onClick={onClose}>✕</button>
        {cartItems && cartItems.map((item, index) => (
        <div className="pedido-header"  key={item.cartItemId || `item-${index}`}>
          <div className="pedido-imagem"><img className="imagem-mesmo-produtos-carrinho" 
                src={item.image} alt={item.name}/></div>
          <div className="pedido-info">
            <h3 className="pedido-nome">{item.name}</h3>
            <div className="span-pedido-preco">
            <span className="pedido-preco">R$ {(item.price * (item.quantidade || 1)).toFixed(2)}</span>
            <span className="pedido-quantidade">{item.quantidade}</span>
            </div>
            <p>{item.data}</p>
            <p>Número do Pedido: <strong>{item.numero}</strong></p>
            <button className="botao-recomprar">Recompra</button>
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
