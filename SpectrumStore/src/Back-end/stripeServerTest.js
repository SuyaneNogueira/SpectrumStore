// stripeServer.js
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 Coloque aqui a sua SECRET KEY de teste (começa com "sk_test_...")
const stripe = new Stripe("sk_test_SUA_CHAVE_AQUI"); // troque por sua chave real

// ✅ Cria sessão de pagamento Stripe
app.post("/create-checkout-session", async (req, res) => {
  const { cartItems, totalFinal } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"], // PIX disponível no Brasil
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // preço em centavos
        },
        quantity: item.quantidade || 1,
      })),
      // URLs de redirecionamento após pagamento
      success_url: "http://localhost:5173/sucesso",
      cancel_url: "http://localhost:5173/cancelado",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("❌ Erro ao criar sessão Stripe:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("🚀 Servidor Stripe rodando em http://localhost:3001"));
