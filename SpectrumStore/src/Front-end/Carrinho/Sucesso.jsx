import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./Sucesso.css"; 

export default function Sucesso() {
 const [params] = useSearchParams();
 const navigate = useNavigate();
 const [session, setSession] = useState(null); 
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [pedidoId, setPedidoId] = useState(null); 
 const [statusMaquina, setStatusMaquina] = useState(null);
 const sessionId = params.get("session_id");

 useEffect(() => {
  if (!sessionId) {
   setError("ID da Sessão não encontrado.");
   setLoading(false);
   return;
  }

  const salvarEScarregar = async () => {
   try {
    setLoading(true);
    const saveRes = await fetch(`http://localhost:3001/verificar-e-salvar-pedido-bloqueante`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId }),
    });
    const saveData = await saveRes.json();
    if (!saveRes.ok || !saveData.success) {
     throw new Error(saveData.error || "Erro ao salvar o pedido no banco.");
    }
    setPedidoId(saveData.pedidoId); 
    setStatusMaquina(saveData.maquinaStatus);

    const fetchRes = await fetch(`http://localhost:3001/checkout-session/${sessionId}`);
    const fetchData = await fetchRes.json();
    if (!fetchRes.ok) {
     throw new Error(fetchData.error || "Erro ao carregar dados da sessão.");
    }
    setSession(fetchData);
   } catch (err) {
    console.error("Erro no processo de sucesso:", err);
    setError(err.message);
   } finally {
    setLoading(false);
   }
  };
  salvarEScarregar();
 }, [sessionId]);

 if (loading) return <p>🔄 Processando seu pedido e salvando no banco...</p>;

 if (error) return (
   <div className="sucesso-container-carrinho-compra">
    <h1>❌ Erro ao processar seu pedido</h1>
    <p>{error}</p>
    <button className="btn-voltar-carrinho-compra" onClick={() => navigate("/")}>
     Voltar à loja
    </button>
   </div>
  );

 return (
  <div className="correcão-alinhamento-sucesso">
  <div className="sucesso-container-carrinho-compra">
   <Confetti numberOfPieces={200} recycle={false} />
   <h1 className="compra-realizada-com-sucesso">
    🎉 Compra concluída com sucesso!
   </h1>
   <p>
    Obrigado, <strong>{session.customer_details?.email}</strong>!
   </p>

   <p>
    Seu pedido (ID: <strong>{pedidoId}</strong>) foi salvo em nosso sistema.
   </p>


   {statusMaquina === "erro" ? (
        // CASO 1: ERRO NA MÁQUINA (Mostra o aviso amarelo)
    <div className="aviso-maquina-erro">
     <p>
      <strong>Aviso:</strong> Seu pedido foi confirmado, mas a
      distribuidora esta com problemas. Em breve tentaremos novamente, não se
      preocupe, seu pedido esta salvo no nosso banco de dados. 😊
     </p>
    </div>
   ) : (
       
        <div className="aviso-maquina-sucesso">
          <p>
            Parabéns, o pedido foi realizado com sucesso! Fique de olho no seu rastreio. 
            Agradecemos a preferência! 😊
          </p>
        </div>
      )}
      {/* 👆👆👆 FIM DA "CURA" 👆👆👆 */}

   <h2>🛒 Itens comprados:</h2>
   <ul className="itens-comprados-carrinho-compra">
    {session.line_items?.data.map((item, i) => (
     <li key={i} className="item-compra-carrinho">
      {item.price.product.images?.[0] && (
       <img
        src={item.price.product.images[0]}
        alt={item.description}
        className="item-img-carrinho-compra"
       />
      )}
      <span className="item-nome-carrinho-compra">
       {item.description}
      </span>
      <span className="item-quantidade-carrinho-compra">
       {item.quantity}x
      </span>
      <span className="item-preco-carrinho-compra">
       R$ {(item.amount_total / 100).toFixed(2)}
      </span>
     </li>
    ))}
   </ul>

   <h3>Total pago: R$ {(session.amount_total / 100).toFixed(2)}</h3>

   <button
    className="btn-voltar-carrinho-compra"
    onClick={() => navigate("/telaInicial")}
   >
    Voltar à loja
   </button>
  </div>
  </div>
 );
}