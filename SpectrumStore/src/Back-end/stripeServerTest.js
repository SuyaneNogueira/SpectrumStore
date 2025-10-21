import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config(); // carrega o .env

// ⚠️ Use a SECRET KEY de teste (nunca a pública)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Carrinho inválido ou vazio." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })),
      success_url: "http://localhost:5173/sucesso",
      cancel_url: "http://localhost:5173/cancelado",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("⚠️ Erro Stripe:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () =>
  console.log("🚀 Servidor Stripe rodando em http://localhost:3001")
);