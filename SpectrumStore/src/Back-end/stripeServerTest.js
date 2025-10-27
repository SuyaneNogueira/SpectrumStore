import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config(); // carrega o .env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ Use a SECRET KEY de teste (nunca a pública)
app.post("/create-checkout-session", async (req, res) => {
  const { cartItems, paymentMethod } = req.body;

  // Verifica se o carrinho tem itens
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Carrinho vazio" });
  }

  // Define tipos de pagamento
  const paymentTypes = paymentMethod === "pix" ? ["pix"] : ["card"];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentTypes,
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: item.image?.startsWith("http")
              ? [item.image]
              : ["https://i.imgur.com/zYIlgBl.png"], // fallback
          },
          unit_amount: Math.max(Math.round(item.price * 100), 100), // mínimo 1 BRL
        },
        quantity: item.quantity || item.quantidade || 1,
      })),
      success_url: "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão Stripe:", error);   
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Backend rodando em http://localhost:${PORT}`));