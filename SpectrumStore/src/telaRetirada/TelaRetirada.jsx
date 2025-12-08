// TelaRetirada.js - Versão Conectada
import React, { useState, useEffect } from 'react';
import { useRetirada } from '../contexts/RetiradaContext';
import './TelaRetirada.css';

function TelaRetirada() {
  const {
    slotSelecionado,
    codigoDigitado,
    setCodigoDigitado,
    mostrarEntradaCodigo,
    loading,
    error,
    buscarSlotPorCodigo,
    confirmarRetirada,
    limparBusca,
    buscarStatusSlots,
    setError
  } = useRetirada();

  const [mensagemValidacao, setMensagemValidacao] = useState('');

  // Buscar status dos slots ao carregar
  useEffect(() => {
    buscarStatusSlots();
  }, [buscarStatusSlots]);

  const handleBuscarPedido = () => {
    if (!codigoDigitado.trim()) {
      setMensagemValidacao('Por favor, digite o código do seu pedido');
      return;
    }

    if (!/^\d{4}$/.test(codigoDigitado)) {
      setMensagemValidacao('O código deve ter exatamente 4 dígitos');
      return;
    }

    buscarSlotPorCodigo(codigoDigitado);
  };

  const handleConfirmarRetirada = async () => {
    if (slotSelecionado) {
      const sucesso = await confirmarRetirada(slotSelecionado.id);
      if (sucesso) {
        alert('✅ Retirada confirmada! Obrigado pela compra!');
        // Recarregar status dos slots
        buscarStatusSlots();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBuscarPedido();
    }
  };

  if (loading) return (
    <div className="retirada-loading">
      <div className="loading-spinner"></div>
      <p>Localizando seu pedido...</p>
    </div>
  );

  return (
    <div className='div-tela-retirada-principal'>
      <div className='div-elementos-tela-retirada'>
        
        {/* Header */}
        <div className="div-fundo-retirada-container">
          <div className="conteudo-principal-retirada">
            <h1 className="titulo-retirada">📦 Retirada Self-Service</h1>
            <p className="subtitulo-retirada">Digite o código do pedido para localizar seu pacote</p>
          </div>
        </div>

        <div className="separacao-divs-conteudo-retirada">
          
          {/* Mensagem de erro */}
          {error && (
            <div className="mensagem-erro-retirada">
              <div className="icone-erro">⚠️</div>
              <div className="texto-erro">{error}</div>
              <button 
                onClick={() => setError(null)}
                className="botao-fechar-erro"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tela de entrada de código */}
          {mostrarEntradaCodigo && (
            <div className="container-entrada-codigo">
              <div className="card-retirada entrada-codigo-card">
                <div className="icone-busca">🔍</div>
                <h2 className="titulo-busca">Digite o código do pedido</h2>
                <p className="instrucao-busca">
                  Insira o código de 4 dígitos recebido na confirmação da compra
                </p>
                
                <div className="grupo-input-codigo">
                  <input
                    type="text"
                    value={codigoDigitado}
                    onChange={(e) => {
                      setCodigoDigitado(e.target.value.replace(/\D/g, '').slice(0, 4));
                      setMensagemValidacao('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="0000"
                    className="input-codigo"
                    maxLength="4"
                    autoFocus
                  />
                  
                  {mensagemValidacao && (
                    <div className="mensagem-validacao erro">
                      ⚠️ {mensagemValidacao}
                    </div>
                  )}
                  
                  <button 
                    onClick={handleBuscarPedido}
                    className="botao-buscar-pedido"
                    disabled={codigoDigitado.length !== 4}
                  >
                    Buscar Pedido
                  </button>
                </div>

                <div className="dica-codigo">
                  <p>📍 Encontre seu código:</p>
                  <ul>
                    <li>📧 No e-mail de confirmação</li>
                    <li>📱 No aplicativo - "Meus Pedidos"</li>
                    <li>🖨️ No comprovante impresso</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tela de localização do slot */}
          {slotSelecionado && (
            <div className="container-info-slot">
              <div className="card-retirada info-slot-card">
                <div className="cabecalho-slot">
                  <button 
                    onClick={limparBusca}
                    className="botao-voltar-slot"
                  >
                    ← Voltar
                  </button>
                  <h2 className="titulo-slot-encontrado">Pedido Localizado!</h2>
                </div>

                <div className="detalhes-slot">
                  {/* Status */}
                  <div className="status-container">
                    <div className="slot-marcador-grande" style={{ backgroundColor: slotSelecionado.cor }}>
                      <span className="slot-id-grande">{slotSelecionado.id}</span>
                      <span className="slot-localizacao">SLOT {slotSelecionado.id}</span>
                    </div>
                    
                    <div className="info-status">
                      <div className={`status-badge ${slotSelecionado.status}`}>
                        {slotSelecionado.status === 'ocupado' ? '🟢 PRONTO PARA RETIRADA' :
                         slotSelecionado.status === 'reservado' ? '🟡 EM PREPARAÇÃO' : '🔵 DISPONÍVEL'}
                      </div>
                      
                      {slotSelecionado.produtoNome && (
                        <p className="instrucao-status">Produto: {slotSelecionado.produtoNome}</p>
                      )}
                      
                      {slotSelecionado.codigoPedido && (
                        <p className="codigo-status">Código: {slotSelecionado.codigoPedido}</p>
                      )}
                    </div>
                  </div>

                  {/* Mapa de Localização */}
                  <div className="mapa-localizacao">
                    <h3 className="titulo-mapa">📍 Localize o Slot {slotSelecionado.id}</h3>
                    
                    <div className="planta-baixa">
                      {/* Linha A */}
                      <div className="linha-slots">
                        <div className="rotulo-linha">Linha A</div>
                        <div className="slots-linha">
                          {['A1', 'A2', 'A3', 'A4'].map(slotId => (
                            <div 
                              key={slotId}
                              className={`slot-mapa ${slotId === slotSelecionado.id ? 'slot-seu' : 'slot-outro'}`}
                            >
                              {slotId}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Linha B */}
                      <div className="linha-slots">
                        <div className="rotulo-linha">Linha B</div>
                        <div className="slots-linha">
                          {['B5', 'B6', 'B7', 'B8'].map(slotId => (
                            <div 
                              key={slotId}
                              className={`slot-mapa ${slotId === slotSelecionado.id ? 'slot-seu' : 'slot-outro'}`}
                            >
                              {slotId}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Linha C */}
                      <div className="linha-slots">
                        <div className="rotulo-linha">Linha C</div>
                        <div className="slots-linha">
                          {['C9', 'C10', 'C11', 'C12'].map(slotId => (
                            <div 
                              key={slotId}
                              className={`slot-mapa ${slotId === slotSelecionado.id ? 'slot-seu' : 'slot-outro'}`}
                            >
                              {slotId}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="instrucoes">
                      <h4>Instruções:</h4>
                      <ol>
                        <li>Dirija-se à <strong>Área de Retirada Self-Service</strong></li>
                        <li>Encontre o slot <strong>{slotSelecionado.id}</strong></li>
                        <li>Verifique se a luz do slot está verde</li>
                        <li>Abra a porta e retire seu pedido</li>
                        <li>Feche a porta após a retirada</li>
                      </ol>
                    </div>
                  </div>

                  {/* Botão de Confirmação */}
                  {slotSelecionado.status === 'ocupado' && (
                    <div className="acoes-container">
                      <button 
                        onClick={handleConfirmarRetirada}
                        className="botao-confirmar"
                      >
                        ✅ CONFIRMAR RETIRADA
                      </button>
                      <p className="texto-ajuda">
                        Clique aqui após retirar todos os itens do slot
                      </p>
                    </div>
                  )}

                  {/* Aviso de preparação */}
                  {slotSelecionado.status === 'reservado' && (
                    <div className="aviso-preparacao">
                      <div className="icone-aviso">⏳</div>
                      <div className="texto-aviso">
                        <h4>Pedido em Preparação</h4>
                        <p>Seu pedido ainda está sendo preparado. Retorne ao horário indicado para retirada.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default TelaRetirada;