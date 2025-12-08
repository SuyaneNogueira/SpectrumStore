import "./HistoricoDeCompraModal.css";
import { useCart } from "../../Carrinho/CartContext";
import { useNavigate } from "react-router-dom";

function HistoricoDeCompraModal({ pedido, onClose }) {
  if (!pedido) return null;

  const navigate = useNavigate();

  // Função para redirecionar para página do produto
  const irTelaProduto = (produtoId) => {
    if (produtoId) {
      navigate(`/produto/${produtoId}`);
    } else {
      navigate('/produtos');
    }
  };

  // Função para copiar código de retirada
  const copiarCodigoRetirada = (codigo) => {
    if (!codigo) return;
    
    navigator.clipboard.writeText(codigo)
      .then(() => {
        alert(`Código ${codigo} copiado para a área de transferência!`);
      })
      .catch(err => {
        console.error('Erro ao copiar código:', err);
      });
  };

  // Formatar data
  const formatarData = (dataString) => {
    if (!dataString) return 'Data não disponível';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Determinar etapa atual do status
  const determinarStatusAtual = (status) => {
    const etapas = {
      'pendente': 0,
      'pago': 1,
      'processando': 2,
      'pronto para retirada': 3,
      'concluido': 4,
      'finalizado': 4
    };
    return etapas[status?.toLowerCase()] || 0;
  };

  // Obter itens do pedido
  const obterItensPedido = () => {
    if (pedido.produtos && Array.isArray(pedido.produtos)) {
      return pedido.produtos;
    }
    if (pedido.itens && Array.isArray(pedido.itens)) {
      return pedido.itens;
    }
    return [];
  };

  const itens = obterItensPedido();
  const statusAtual = determinarStatusAtual(pedido.status);

  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <button className="modal-fechar" onClick={onClose}>✕</button>
        
        {/* Cabeçalho do Pedido */}
        <div className="pedido-cabecalho">
          <h2>Detalhes do Pedido</h2>
          <div className="pedido-info-geral">
            <div className="info-item">
              <span className="info-label">Número do Pedido:</span>
              <span className="info-valor pedido-numero">{pedido.id || pedido.numeroPedido || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data:</span>
              <span className="info-valor">
                {formatarData(pedido.data_pedido || pedido.dataPedido || pedido.data)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`info-valor status-badge status-${pedido.status?.toLowerCase() || 'pendente'}`}>
                {pedido.status || 'Pendente'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total:</span>
              <span className="info-valor total-pedido">
                R$ {(pedido.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="pedido-itens-container">
          <h3>Itens do Pedido</h3>
          
          {itens.length > 0 ? (
            itens.map((produto, index) => (
              <div className="pedido-item" key={produto.id || produto.produto_id || `produto-${index}`}>
                <div className="pedido-item-imagem">
                  <img 
                    src={produto.imagem || produto.image || produto.produto_imagem || '/placeholder-image.jpg'} 
                    alt={produto.nome || produto.name || produto.produto_nome || `Produto ${index + 1}`} 
                  />
                </div>
                <div className="pedido-item-info">
                  <h4 className="pedido-item-nome">
                    {produto.nome || produto.name || produto.produto_nome || `Produto ${index + 1}`}
                  </h4>
                  
                  <div className="pedido-item-detalhes">
                    <div className="detalhe-item">
                      <span className="detalhe-label">Quantidade:</span>
                      <span className="detalhe-valor">{produto.quantidade || produto.quantity || 1}</span>
                    </div>
                    <div className="detalhe-item">
                      <span className="detalhe-label">Preço unitário:</span>
                      <span className="detalhe-valor">
                        R$ {(produto.preco_unitario || produto.price || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="detalhe-item">
                      <span className="detalhe-label">Total item:</span>
                      <span className="detalhe-valor total-item">
                        R$ {((produto.quantidade || produto.quantity || 1) * (produto.preco_unitario || produto.price || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Código de Retirada */}
                  {produto.codigo_retirada && (
                    <div className="codigo-retirada-container">
                      <p className="codigo-label">Código para Retirada:</p>
                      <div className="codigo-display">
                        <span className="codigo-numero">{produto.codigo_retirada}</span>
                        <button 
                          className="botao-copiar-codigo"
                          onClick={() => copiarCodigoRetirada(produto.codigo_retirada)}
                        >
                          📋 Copiar
                        </button>
                      </div>
                      <small className="codigo-instrucao">
                        Use este código de 4 dígitos na área de retirada self-service
                      </small>
                    </div>
                  )}

                  <button 
                    className="botao-recomprar" 
                    onClick={() => irTelaProduto(produto.produto_id || produto.id)}
                  >
                    Recompra
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="sem-itens">
              <p>Nenhum item encontrado neste pedido.</p>
            </div>
          )}
        </div>

        {/* Status do Pedido */}
        <div className="pedido-status-container">
          <h3>Status do Pedido</h3>
          
          <div className="pedido-status-timeline">
            <div className={`etapa ${statusAtual >= 0 ? 'concluida' : ''} ${statusAtual === 0 ? 'atual' : ''}`}>
              <div className="icone"></div>
              <p>Pedido Criado</p>
            </div>
            <div className={`linha ${statusAtual >= 1 ? 'ativa' : ''}`}></div>
            
            <div className={`etapa ${statusAtual >= 1 ? 'concluida' : ''} ${statusAtual === 1 ? 'atual' : ''}`}>
              <div className="icone"></div>
              <p>Pagamento Confirmado</p>
            </div>
            <div className={`linha ${statusAtual >= 2 ? 'ativa' : ''}`}></div>
            
            <div className={`etapa ${statusAtual >= 2 ? 'concluida' : ''} ${statusAtual === 2 ? 'atual' : ''}`}>
              <div className="icone"></div>
              <p>Pedido Em andamento</p>
            </div>
            <div className={`linha ${statusAtual >= 3 ? 'ativa' : ''}`}></div>
            
            <div className={`etapa ${statusAtual >= 3 ? 'concluida' : ''} ${statusAtual === 3 ? 'atual' : ''}`}>
              <div className="icone"></div>
              <p>Pronto para Retirada</p>
            </div>
          </div>
          
          <div className="status-atual-info">
            <p>
              Status atual: <strong>{pedido.status || 'Pendente'}</strong>
            </p>
            {(pedido.status?.toLowerCase() === 'pronto para retirada' || pedido.status?.toLowerCase() === 'concluido') && (
              <div className="aviso-retirada">
                <p>📦 {pedido.status?.toLowerCase() === 'concluido' ? 'Pedido concluído!' : 'Seu pedido está pronto para retirada!'}</p>
                {pedido.status?.toLowerCase() === 'pronto para retirada' && (
                  <p>Use o código acima na área de retirada self-service.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pedido-acoes">
          <button className="botao-secundario" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoricoDeCompraModal;