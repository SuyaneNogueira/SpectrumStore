import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./Sucesso.css"; // Você precisa ter esse arquivo de CSS

export default function Sucesso() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null); // Para mostrar os dados (seu código)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pedidoId, setPedidoId] = useState(null); // Para mostrar o ID salvo (novo)

  const sessionId = params.get("session_id");

  useEffect(() => {
    // Se não tiver ID na URL, é um erro
    if (!sessionId) {
      setError("ID da Sessão não encontrado.");
      setLoading(false);
      return;
    }

    const salvarEScarregar = async () => {
      try {
        setLoading(true);

        const saveRes = await fetch(`http://localhost:3001/verificar-e-salvar-pedido`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId }),
        });
        
        const saveData = await saveRes.json();
        
        // Se a resposta do "salvar" não for OK, pare aqui
        if (!saveRes.ok || !saveData.success) {
          throw new Error(saveData.error || "Erro ao salvar o pedido no banco.");
        }
        
        // Sucesso! Guardamos o ID do pedido que o backend retornou
        setPedidoId(saveData.pedidoId);

        // =========================================================
        // PASSO 2: BUSCAR DADOS PARA MOSTRAR (O SEU CÓDIGO)
        // =========================================================
        const fetchRes = await fetch(`http://localhost:3001/checkout-session/${sessionId}`);
        const fetchData = await fetchRes.json();
        
        if (!fetchRes.ok) {
            throw new Error(fetchData.error || "Erro ao carregar dados da sessão.");
        }
        
        // Sucesso! Guardamos os dados da sessão para mostrar na tela
        setSession(fetchData); 

      } catch (err) {
        console.error("Erro no processo de sucesso:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Executa a função
    salvarEScarregar();

  }, [sessionId]); // Roda apenas 1 vez quando o sessionId muda

  
  // ==============================================
  // RENDERIZAÇÃO
  // ==============================================

  if (loading) return <p>🔄 Processando seu pedido e salvando no banco...</p>;
  
  if (error) return (
    <div className="sucesso-container-carrinho-compra">
      <h1>❌ Erro ao processar seu pedido</h1>
      <p>{error}</p>
      <button className="btn-voltar-carrinho-compra" onClick={() => navigate("/")}>
        🔙 Voltar à loja
      </button>
    </div>
  );

  // Se chegou aqui, loading=false, error=null e session existe
  return (
    <div className="sucesso-container-carrinho-compra">
      <Confetti numberOfPieces={200} recycle={false} />
      <h1 className="compra-realizada-com-sucesso">🎉 Compra concluída com sucesso!</h1>
      <p>Obrigado, <strong>{session.customer_details?.email}</strong>!</p>
      
      {/* Mostra o ID salvo do banco de dados */}
      <p>Seu pedido (ID: <strong>{pedidoId}</strong>) foi salvo em nosso sistema.</p> 

    {statusMaquina === 'erro' && (
        <div className="aviso-maquina-erro">
          <p><strong>Aviso:</strong> Seu pedido foi confirmado, mas a distribuidora esta com problemas. Em breve tentaremos denovo, não se preocupe, seu pedido esta salvo no banco de dados nosso 😊</p>
        </div>
      )}
      {statusMaquina === 'enviado' && (
        <div className="aviso-maquina-sucesso">
          <p>✅ Seu pedido já foi enviado para a fila de produção!</p>
        </div>
      )}

      <h2>🛒 Itens comprados:</h2>
      <ul className="itens-comprados-carrinho-compra">
        {session.line_items?.data.map((item, i) => (
          <li key={i} className="item-compra-carrinho">
            {/* Garante que a imagem exista antes de tentar mostrar */}
            {item.price.product.images?.[0] && (
              <img src={item.price.product.images[0]} alt={item.description} className="item-img-carrinho-compra" />
            )}
            <span className="item-nome-carrinho-compra">{item.description}</span>
            <span className="item-quantidade-carrinho-compra">{item.quantity}x</span>
            <span className="item-preco-carrinho-compra">R$ {(item.amount_total / 100).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <h3>Total pago: R$ {(session.amount_total / 100).toFixed(2)}</h3>

      <button className="btn-voltar-carrinho-compra" onClick={() => navigate("/telaInicial")}>
        🔙 Voltar à loja
      </button>
    </div>
  );
}