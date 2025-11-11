import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const RetiradaContext = createContext();

export function RetiradaProvider({ children }) {
  const [pedidosProntos, setPedidosProntos] = useState([]);
  const [filaRetirada, setFilaRetirada] = useState([]);
  const [statusRetirada, setStatusRetirada] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [codigoRetirada, setCodigoRetirada] = useState(null);
  const [estatisticasLoja, setEstatisticasLoja] = useState({
    pessoasNaFila: 0,
    funcionariosDisponiveis: 2,
    tempoMedioAtendimento: 2.5 // em minutos
  });

  // Função para gerar código único
  const gerarCodigoRetirada = useCallback(() => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RET-${timestamp}${random}`;
  }, []);

  // Calcular tempo de espera baseado na fila
  const calcularTempoEspera = useCallback((fila, funcionarios, tempoMedio) => {
    if (fila.length === 0) return 0;
    return (fila.length / funcionarios) * tempoMedio;
  }, []);

  // Atualizar estatísticas quando a fila mudar
  useEffect(() => {
    const tempoEspera = calcularTempoEspera(
      filaRetirada,
      estatisticasLoja.funcionariosDisponiveis,
      estatisticasLoja.tempoMedioAtendimento
    );

    setEstatisticasLoja(prev => ({
      ...prev,
      pessoasNaFila: filaRetirada.length,
      tempoEsperaFila: tempoEspera
    }));
  }, [filaRetirada, estatisticasLoja.funcionariosDisponiveis, estatisticasLoja.tempoMedioAtendimento, calcularTempoEspera]);

  // Simular chegada de novos pedidos
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% de chance de chegar um novo pedido a cada 30 segundos
      if (Math.random() < 0.2) {
        const novosPedidos = [
          {
            id: `P${Date.now()}`,
            clienteNome: 'Cliente ' + Math.floor(Math.random() * 1000),
            quantidadeItens: Math.floor(Math.random() * 5) + 1,
            valorTotal: Math.random() * 200 + 50
          }
        ];
        
        setPedidosProntos(prev => [...prev, ...novosPedidos]);
      }
    }, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const adicionarNaFila = useCallback((pedidoId) => {
    const novoItemFila = {
      id: `F${Date.now()}`,
      pedidoId: pedidoId,
      horarioEntrada: new Date(),
      tempoEstimado: estatisticasLoja.tempoEsperaFila || 0
    };

    setFilaRetirada(prev => [...prev, novoItemFila]);
    return novoItemFila;
  }, [estatisticasLoja.tempoEsperaFila]);

  const removerDaFila = useCallback((pedidoId) => {
    setFilaRetirada(prev => prev.filter(item => item.pedidoId !== pedidoId));
  }, []);

  const confirmarRetiradaPedido = useCallback(async (pedidoId) => {
    try {
      setLoading(true);
      
      // Gerar novo código
      const novoCodigo = gerarCodigoRetirada();
      setCodigoRetirada(novoCodigo);
      
      // Adicionar na fila de retirada
      adicionarNaFila(pedidoId);
      
      // Simular chamada API
      console.log(`Confirmando retirada do pedido ${pedidoId} com código: ${novoCodigo}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar lista de pedidos
      setPedidosProntos(prev => prev.filter(pedido => pedido.id !== pedidoId));
      
      setError(null);
    } catch (err) {
      setError('Erro ao confirmar retirada');
      setCodigoRetirada(null);
    } finally {
      setLoading(false);
    }
  }, [gerarCodigoRetirada, adicionarNaFila]);

  const cancelarRetiradaPedido = useCallback(async (pedidoId, motivo) => {
    try {
      setLoading(true);
      setCodigoRetirada(null); // Limpar código ao cancelar
      
      // Remover da fila se estiver lá
      removerDaFila(pedidoId);
      
      // Simular chamada API
      console.log(`Cancelando retirada do pedido ${pedidoId}. Motivo: ${motivo}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPedidosProntos(prev => prev.filter(pedido => pedido.id !== pedidoId));
      setError(null);
    } catch (err) {
      setError('Erro ao cancelar retirada');
    } finally {
      setLoading(false);
    }
  }, [removerDaFila]);

  const buscarPedidosProntos = useCallback(async () => {
    try {
      setLoading(true);
      // Simular busca de pedidos
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Dados mockados para exemplo
      const pedidosMock = [
        {
          id: '1001',
          clienteNome: 'João Silva',
          quantidadeItens: 3,
          valorTotal: 149.90
        },
        {
          id: '1002', 
          clienteNome: 'Maria Santos',
          quantidadeItens: 2,
          valorTotal: 89.50
        }
      ];
      setPedidosProntos(pedidosMock);
      setError(null);
    } catch (err) {
      setError('Erro ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para simular atendimento (remover da fila)
  const simularAtendimentoConcluido = useCallback(() => {
    if (filaRetirada.length > 0) {
      setFilaRetirada(prev => prev.slice(1)); // Remove o primeiro da fila
    }
  }, [filaRetirada.length]);

  // Simular atendimento automático
  useEffect(() => {
    if (filaRetirada.length > 0) {
      const interval = setInterval(() => {
        // Tempo de atendimento base + variação aleatória
        const tempoAtendimento = (estatisticasLoja.tempoMedioAtendimento * 60000) + (Math.random() * 60000);
        
        setTimeout(() => {
          simularAtendimentoConcluido();
        }, tempoAtendimento);
      }, 10000); // Verifica a cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [filaRetirada.length, estatisticasLoja.tempoMedioAtendimento, simularAtendimentoConcluido]);

  // Adicionar função para limpar código
  const limparCodigoRetirada = useCallback(() => {
    setCodigoRetirada(null);
  }, []);

  // Função para adicionar pedido de teste
  const adicionarPedidoTeste = useCallback(() => {
    const novoPedido = {
      id: `TEST${Date.now()}`,
      clienteNome: `Cliente Teste ${Math.floor(Math.random() * 1000)}`,
      quantidadeItens: Math.floor(Math.random() * 5) + 1,
      valorTotal: Math.random() * 200 + 50
    };
    
    setPedidosProntos(prev => [...prev, novoPedido]);
  }, []);

  return (
    <RetiradaContext.Provider value={{
      pedidosProntos,
      filaRetirada,
      statusRetirada,
      codigoRetirada,
      estatisticasLoja,
      loading,
      error,
      confirmarRetiradaPedido,
      cancelarRetiradaPedido,
      buscarPedidosProntos,
      limparCodigoRetirada,
      adicionarPedidoTeste,
      simularAtendimentoConcluido
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