import React from 'react';
import { useRetirada } from '../contexts/RetiradaContext';
import './TelaRetirada.css';

function TelaRetirada() {
  const {
    pedidosProntos,
    statusRetirada,
    loading,
    error,
    confirmarRetiradaPedido,
    cancelarRetiradaPedido,
    buscarPedidosProntos
  } = useRetirada();

  if (loading) return (
    <div className="retirada-loading">
      <div className="loading-spinner"></div>
      <p>Carregando informações de retirada...</p>
    </div>
  );

  if (error) return (
    <div className="retirada-error">
      <p>❌ {error}</p>
      <button onClick={buscarPedidosProntos} className="botao-tentar-novamente">
        Tentar Novamente
      </button>
    </div>
  );

  return (
    <div className='div-tela-retirada-principal'>
      <div className='div-elementos-tela-retirada'>
        
        {/* Header Similar ao Banner de Brinquedos */}
        <div className="div-fundo-retirada-container">
          <div className="conteudo-principal-retirada">
            <h2 className="titulo-retirada">Área de Retirada</h2>
            <p className="subtitulo-retirada">Acompanhe seus pedidos prontos para retirada</p>
          </div>
        </div>

        <div className="separacao-divs-conteudo-retirada">
          
          {/* Status de Confirmação */}
          <div className="container-status-confirmacao">
            <div className="card-retirada confirmacao-card">
              <div className="status-item">
                <div className="checkbox-container">
                  <input type="checkbox" checked readOnly className="checkbox-custom" />
                  <span className="status-texto">Retirada confirmada!</span>
                </div>
                <span className="codigo-status">Código: RET-1762199121185</span>
              </div>
              
              <div className="codigo-retirada-destaque">
                <h3 className="titulo-codigo">🎯 Código de Retirada</h3>
                <div className="codigo-numero">RET-1762199121185</div>
                <p className="instrucao-codigo">Apresente este código no balcão</p>
              </div>
            </div>
          </div>

          {/* Status da Loja */}
          <div className="container-status-loja">
            <h3 className="titulo-secao-retirada">Status da Loja</h3>
            <div className="card-retirada status-loja-card">
              <div className="status-grid">
                <div className="status-item-loja">
                  <span className="label-status">Pessoas para Retirada</span>
                  <span className="valor-status">0</span>
                </div>
                <div className="status-item-loja">
                  <span className="label-status">Previsão na Fila</span>
                  <span className="valor-status">2,5 min</span>
                </div>
                <div className="status-item-loja">
                  <span className="label-status">Funcionários Disponíveis</span>
                  <span className="valor-status">3</span>
                </div>
              </div>
              <div className="tempo-medio">
                <span className="info-tempo">⏱️ Tempo médio de atendimento: 2,5 minutos</span>
              </div>
            </div>
          </div>

          {/* Pedidos Prontos para Retirada */}
          <div className="container-pedidos-prontos">
            <h3 className="titulo-secao-retirada">Pedidos Prontos para Retirada</h3>
            
            {pedidosProntos.length === 0 ? (
              <div className="card-retirada sem-pedidos-card">
                <div className="icone-sem-pedidos">📦</div>
                <p className="texto-sem-pedidos">Nenhum pedido pronto para retirada no momento.</p>
                <p className="texto-informativo">Os pedidos aparecerão aqui quando estiverem prontos.</p>
              </div>
            ) : (
              <div className="lista-pedidos-container">
                {pedidosProntos.map(pedido => (
                  <div key={pedido.id} className="card-retirada pedido-card">
                    <div className="pedido-header">
                      <h4 className="numero-pedido">Pedido #{pedido.id}</h4>
                      <span className="status-pedido">🟢 Pronto</span>
                    </div>
                    <div className="pedido-detalhes">
                      <p className="info-pedido"><strong>Cliente:</strong> {pedido.clienteNome}</p>
                      <p className="info-pedido"><strong>Itens:</strong> {pedido.quantidadeItens} produtos</p>
                      <p className="info-pedido"><strong>Total:</strong> R$ {pedido.valorTotal?.toFixed(2)}</p>
                    </div>
                    <div className="acoes-pedido">
                      <button 
                        onClick={() => confirmarRetiradaPedido(pedido.id)}
                        className="botao-confirmar"
                      >
                        ✅ Confirmar Retirada
                      </button>
                      <button 
                        onClick={() => cancelarRetiradaPedido(pedido.id, 'Cliente solicitou')}
                        className="botao-cancelar"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default TelaRetirada;