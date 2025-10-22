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

  const sessionId = params.get("session_id");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`http://localhost:3001/checkout-session/${sessionId}`);
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error("Erro ao carregar sessão:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  if (loading) return <p>🔄 Carregando informações do pagamento...</p>;
  if (error) return <p>❌ Erro ao carregar dados: {error}</p>;

  return (
    <div className="sucesso-container">
      <Confetti numberOfPieces={200} recycle={false} />
      <h1>🎉 Compra concluída com sucesso!</h1>
      <p>Obrigado, <strong>{session.customer_details?.email}</strong>!</p>

      <h2>🛒 Itens comprados:</h2>
      <ul className="itens-comprados">
        {session.line_items?.data.map((item, i) => (
          <li key={i} className="item-compra">
            <img src={item.price.product.images[0]} alt={item.description} className="item-img" />
            <span className="item-nome">{item.description}</span>
            <span className="item-quantidade">{item.quantity}x</span>
            <span className="item-preco">R$ {(item.amount_total / 100).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <h3>Total pago: R$ {(session.amount_total / 100).toFixed(2)}</h3>

      <button className="btn-voltar" onClick={() => navigate("/")}>
        🔙 Voltar à loja
      </button>
    </div>
  );
}
