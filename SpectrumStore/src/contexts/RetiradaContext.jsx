// RetiradaContext.js - Versão Conectada com Backend
import React, { createContext, useState, useContext, useCallback } from 'react';

const RetiradaContext = createContext();

export function RetiradaProvider({ children }) {
  // Estado
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [mostrarEntradaCodigo, setMostrarEntradaCodigo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [slots, setSlots] = useState([]);

  // Buscar produto por código no backend
  const buscarSlotPorCodigo = useCallback(async (codigo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/retirada/codigo/${codigo}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar código');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Código não encontrado');
      }
      
      // Formatar dados para o slot
      const slotEncontrado = {
        id: data.slot,
        status: data.status === 'pronto para retirada' ? 'ocupado' : 
                data.status === 'processando' ? 'reservado' : 'disponivel',
        codigoPedido: data.produto.codigoRetirada,
        pedidoId: data.pedido?.pedidoId,
        produtoNome: data.produto.nome,
        horarioDisponivel: data.horarioRetirada ? new Date(data.horarioRetirada) : null,
        cor: data.status === 'pronto para retirada' ? '#4CAF50' : 
             data.status === 'processando' ? '#2196F3' : '#CCCCCC'
      };
      
      setSlotSelecionado(slotEncontrado);
      setMostrarEntradaCodigo(false);
      return slotEncontrado;
      
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirmar retirada no backend
  const confirmarRetirada = useCallback(async (slotId) => {
    if (!slotSelecionado) return false;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/retirada/confirmar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo: slotSelecionado.codigoPedido,
          pedidoId: slotSelecionado.pedidoId,
          slotId: slotId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao confirmar retirada');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Erro ao confirmar retirada');
      }
      
      // Limpar estado
      setSlotSelecionado(null);
      setMostrarEntradaCodigo(true);
      setCodigoDigitado('');
      setError(null);
      
      return true;
      
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [slotSelecionado]);

  // Buscar status dos slots
  const buscarStatusSlots = useCallback(async () => {
    try {
      const response = await fetch('/api/retirada/slots');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar status dos slots');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSlots(data.slots);
        return data.slots;
      }
      
      return [];
      
    } catch (err) {
      console.error('Erro ao buscar slots:', err);
      return [];
    }
  }, []);

  // Limpar busca
  const limparBusca = useCallback(() => {
    setCodigoDigitado('');
    setSlotSelecionado(null);
    setMostrarEntradaCodigo(true);
    setError(null);
  }, []);

  return (
    <RetiradaContext.Provider value={{
      // Estado
      slotSelecionado,
      codigoDigitado,
      setCodigoDigitado,
      mostrarEntradaCodigo,
      loading,
      error,
      slots,
      
      // Ações
      buscarSlotPorCodigo,
      confirmarRetirada,
      limparBusca,
      buscarStatusSlots,
      
      // Controles
      setError,
      setMostrarEntradaCodigo,
      setSlotSelecionado
    }}>
      {children}
    </RetiradaContext.Provider>
  );
}

export function useRetirada() {
  const context = useContext(RetiradaContext);
  if (!context) {
    throw new Error('useRetirada deve ser usado dentro de um RetiradaProvider');
  }
  return context;
}