import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getPedidosProntos, 
  confirmarRetirada, 
  cancelarRetirada, 
  getStatusRetirada,
  getStatusPedido 
} from '../services/RetiradaService';

const RetiradaContext = createContext();

export const useRetirada = () => {
  const context = useContext(RetiradaContext);
  console.log('RetiradaContext value:', context);
  if (!context) {
    throw new Error('useRetirada deve ser usado dentro de RetiradaProvider');
  }
  return context;
};

export const RetiradaProvider = ({ children }) => {
  const [pedidosProntos, setPedidosProntos] = useState([]);
  const [statusRetirada, setStatusRetirada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar pedidos prontos para retirada
  const buscarPedidosProntos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPedidosProntos();
      setPedidosProntos(response.pedidos || []);
      return response;
    } catch (err) {
      setError('Erro ao buscar pedidos prontos');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Confirmar retirada
  const confirmarRetiradaPedido = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await confirmarRetirada(orderId);
      
      // Atualizar lista local
      setPedidosProntos(prev => 
        prev.filter(pedido => pedido.orderId !== orderId)
      );
      
      return response;
    } catch (err) {
      setError('Erro ao confirmar retirada');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar retirada
  const cancelarRetiradaPedido = async (orderId, motivo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelarRetirada(orderId, motivo);
      
      // Atualizar lista local
      setPedidosProntos(prev => 
        prev.filter(pedido => pedido.orderId !== orderId)
      );
      
      return response;
    } catch (err) {
      setError('Erro ao cancelar retirada');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar status da área de retirada
  const buscarStatusRetirada = async () => {
    try {
      const response = await getStatusRetirada();
      setStatusRetirada(response);
      return response;
    } catch (err) {
      setError('Erro ao buscar status da retirada');
      console.error(err);
      throw err;
    }
  };

  // Verificar status de um pedido específico
  const verificarStatusPedido = async (pedidoId) => {
    try {
      const response = await getStatusPedido(pedidoId);
      return response;
    } catch (err) {
      console.error('Erro ao verificar status do pedido:', err);
      throw err;
    }
  };

  // Atualizar automaticamente a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      buscarPedidosProntos();
      buscarStatusRetirada();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Buscar dados iniciais
  useEffect(() => {
    buscarPedidosProntos();
    buscarStatusRetirada();
  }, []);

  const value = {
    pedidosProntos,
    statusRetirada,
    loading,
    error,
    buscarPedidosProntos,
    confirmarRetiradaPedido,
    cancelarRetiradaPedido,
    buscarStatusRetirada,
    verificarStatusPedido
  };

  return (
    <RetiradaContext.Provider value={value}>
      {children}
    </RetiradaContext.Provider>
  );
};