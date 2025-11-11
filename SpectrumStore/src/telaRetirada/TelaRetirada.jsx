import React from 'react';
import { useRetirada } from '../contexts/RetiradaContext';
import './TelaRetirada.css';

function TelaRetirada() {
  const {
    pedidosProntos,
    filaRetirada,
    codigoRetirada,
    estatisticasLoja,
    loading,
    error,
    confirmarRetiradaPedido,
    cancelarRetiradaPedido,
    buscarPedidosProntos,
    limparCodigoRetirada,
    adicionarPedidoTeste
  } = useRetirada();

  // Formatar tempo para exibição
  const formatarTempo = (minutos) => {
    if (minutos < 1) return 'Menos de 1 min';
    if (minutos === 1) return '1 min';
    return `${minutos.toFixed(1)} min`;
  };

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
            
            {/* Botão para teste - pode remover em produção */}
            <button 
              onClick={adicionarPedidoTeste}
              className="botao-adicionar-teste"
            >
              + Adicionar Pedido Teste
            </button>
          </div>
        </div>

        <div className="separacao-divs-conteudo-retirada">
          
          {/* Status de Confirmação - Só mostra quando tem código */}
          {codigoRetirada && (
            <div className="container-status-confirmacao">
              <div className="card-retirada confirmacao-card">
                <div className="status-item">
                  <div className="checkbox-container">
                    <input type="checkbox" checked readOnly className="checkbox-custom" />
                    <span className="status-texto">Retirada confirmada!</span>
                  </div>
                  <span className="codigo-status">Código: {codigoRetirada}</span>
                </div>
                
                <div className="codigo-retirada-destaque">
                  <h3 className="titulo-codigo">🎯 Código de Retirada</h3>
                  <div className="codigo-numero">{codigoRetirada}</div>
                  <p className="instrucao-codigo">Apresente este código no balcão</p>
                  <p className="info-fila">
                    Sua posição na fila: <strong>#{filaRetirada.findIndex(item => item.pedidoId === codigoRetirada?.split('-')[1]) + 1}</strong>
                  </p>
                  <button 
                    onClick={limparCodigoRetirada}
                    className="botao-fechar-codigo"
                  >
                    ✕ Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status da Loja */}
          <div className="container-status-loja">
            <h3 className="titulo-secao-retirada">Status da Loja</h3>
            <div className="card-retirada status-loja-card">
              <div className="status-grid">
                <div className="status-item-loja">
                  <span className="label-status">Pessoas para Retirada</span>
                  <span className="valor-status">{filaRetirada.length}</span>
                </div>
                <div className="status-item-loja">
                  <span className="label-status">Previsão na Fila</span>
                  <span className="valor-status">
                    {formatarTempo(estatisticasLoja.tempoEsperaFila || 0)}
                  </span>
                </div>
                <div className="status-item-loja">
                  <span className="label-status">Funcionários Disponíveis</span>
                  <span className="valor-status">{estatisticasLoja.funcionariosDisponiveis}</span>
                </div>
              </div>
              <div className="tempo-medio">
                <span className="info-tempo">
                  ⏱️ Tempo médio de atendimento: {estatisticasLoja.tempoMedioAtendimento} minutos
                </span>
              </div>
              
              {/* Informações da Fila em Tempo Real */}
              <div className="info-fila-tempo-real">
                <div className="fila-header">
                  <h4>📊 Fila de Retirada</h4>
                  <span className="total-fila">{filaRetirada.length} pessoa(s)</span>
                </div>
                {filaRetirada.length > 0 && (
                  <div className="itens-fila">
                    {filaRetirada.map((item, index) => (
                      <div key={item.id} className="item-fila">
                        <span className="posicao-fila">#{index + 1}</span>
                        <span className="pedido-fila">Pedido {item.pedidoId}</span>
                        <span className="tempo-fila">
                          ~{formatarTempo((index + 1) * estatisticasLoja.tempoMedioAtendimento)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pedidos Prontos para Retirada */}
          <div className="container-pedidos-prontos">
            <div className="header-pedidos-prontos">
              <h3 className="titulo-secao-retirada">Pedidos Prontos para Retirada</h3>
              <span className="contador-pedidos">{pedidosProntos.length} pedido(s) disponível(is)</span>
            </div>
            
            {pedidosProntos.length === 0 ? (
              <div className="card-retirada sem-pedidos-card">
                <div className="icone-sem-pedidos">📦</div>
                <p className="texto-sem-pedidos">Nenhum pedido pronto para retirada no momento.</p>
                <p className="texto-informativo">Os pedidos aparecerão aqui quando estiverem prontos.</p>
                <button onClick={buscarPedidosProntos} className="botao-tentar-novamente">
                  Atualizar Lista
                </button>
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
                    <div className="info-tempo-espera">
                      <span className="tempo-estimado">
                        ⏱️ Tempo estimado na fila: {formatarTempo(
                          (filaRetirada.length + 1) * estatisticasLoja.tempoMedioAtendimento
                        )}
                      </span>
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