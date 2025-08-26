import "./HistoricoDeCompraModal.css";

function HistoricoDeCompraModal({ pedido, onClose }) {
  if (!pedido) return null; // Se não tiver pedido selecionado, não mostra nada

  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <button className="modal-fechar" onClick={onClose}>✕</button>

        <div className="pedido-header">
          <div className="pedido-imagem"></div>
          <div className="pedido-info">
            <h3 className="pedido-nome">{pedido.nome}</h3>
            <span className="pedido-preco">R$ {pedido.preco}</span>
            <span className="pedido-quantidade">{pedido.qtd}</span>
            <p>{pedido.data}</p>
            <p>Número do Pedido: <strong>{pedido.numero}</strong></p>
            <p>Prazo de devolução: {pedido.devolucao}</p>
            <button className="botao-recomprar">Recompra</button>
          </div>
        </div>

        <div className="pedido-status">
          <div className="etapa concluida">
            <div className="icone"></div>
            <p>Pedido Realizado</p>
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
