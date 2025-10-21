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
        <div className="pedido-header">
          <div className="pedido-imagem"><img className="imagem-mesmo-produtos-carrinho" 
                src={item.image} alt={item.name}/></div>
          <div className="pedido-info">
            <h3 className="pedido-nome">{item.name}</h3>
            <div className="span-pedido-preco">
            <span className="pedido-preco">R$ {item.price}</span>
            <span className="pedido-quantidade">{item.quantidade}</span>
            </div>
            <p>{item.data}</p>
            <p>Número do Pedido: <strong>{item.numero}</strong></p>
            {/* <p>Prazo de devolução: {.devolucao}</p> */}
            <button className="botao-recomprar">Recompra</button>
          </div>
        </div>
      ))};

        <div className="pedido-status">
          <div className="etapa concluida">
            <div className="icone"></div>
            <p>Pedido Confirmado</p>
          </div>
          <div className="linha"></div>
          <div className="etapa concluida">
            <div className="icone"></div>
            <p>Pagamento Confirmado</p>
          </div>
          <div className="linha"></div>
          <div className="etapa atual">
            <div className="icone"></div>
            <p>Pedido Enviado</p>
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
