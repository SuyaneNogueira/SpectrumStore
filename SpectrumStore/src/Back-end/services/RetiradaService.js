const API_BASE_URL = 'http://localhost:3030';

/**
 * Função auxiliar para fazer requisições
 */
const fazerRequisicao = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

/**
 * Busca pedidos prontos para retirada
 */
export const getPedidosProntos = async () => {
  return await fazerRequisicao('/retirada/pedidos-prontos');
};

/**
 * Confirma retirada de um pedido
 */
export const confirmarRetirada = async (orderId) => {
  return await fazerRequisicao(`/retirada/${orderId}/confirmar`, {
    method: 'POST',
  });
};

/**
 * Cancela retirada de um pedido
 */
export const cancelarRetirada = async (orderId, motivo) => {
  return await fazerRequisicao(`/retirada/${orderId}/cancelar`, {
    method: 'POST',
    body: JSON.stringify({ motivo }),
  });
};

/**
 * Busca status da área de retirada
 */
export const getStatusRetirada = async () => {
  return await fazerRequisicao('/retirada/status');
};

/**
 * Verifica status de um pedido específico
 */
export const getStatusPedido = async (pedidoId) => {
  return await fazerRequisicao(`/queue/items/${pedidoId}`);
};

export default {
  getPedidosProntos,
  confirmarRetirada,
  cancelarRetirada,
  getStatusRetirada,
  getStatusPedido,
};