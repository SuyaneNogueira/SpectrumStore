// server.js
import express from 'express';
import cors from 'cors';
import Stripe from "stripe";
import bodyParser from "body-parser";
import { pool } from './db.js';  // Aqui você importa o pool uma única vez

const app = express();
const PORT = process.env.PORT || 3001;

// Usando o middleware
app.use(cors());
app.use(express.json());

// Importando e passando o app para o CarrinhoBackT.js
import { defineRoutes } from './CarrinhoBackT.js';  // Importa a função de rotas

defineRoutes(app);  // Passa o `app` para a função de rotas

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});



// ///teste apenas

// ✅ Stripe declarado apenas uma vez
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ Webhook vem antes do express.json()
app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      const pedido = {
        sessionId: session.id,
        customer_email: session.customer_email,
        total: session.amount_total,
        items: lineItems.data.map(li => ({
          description: li.description,
          quantity: li.quantity,
          price: li.amount_total ? li.amount_total / 100 : null,
          price_unit: li.price?.unit_amount ? li.price.unit_amount / 100 : null,
          product_id: li.price?.product || null,
        })),
      };

      console.log("✅ Pedido recebido via webhook:", pedido);
      // futuramente: salvar no banco
    }

    res.json({ received: true });
  } catch (err) {
    console.error("⚠️ Erro webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// ⚙️ Middlewares normais (depois do webhook)
app.use(cors());
app.use(express.json());

// 📦 Suas rotas normais
defineRoutes(app);

// 💳 Rota para criar sessão de checkout
app.post("/create-checkout-session", async (req, res) => {
  const { cartItems, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: cartItems.map(item => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
            metadata: { productId: String(item.id || "") },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantidade || 1,
      })),
      metadata: { cartId: String(req.body.cartId || "") },
      success_url: "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("⚠️ Erro Stripe:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Rota para buscar dados de sessão (usada na tela de sucesso)
app.get("/checkout-session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });
    res.json(session);
  } catch (err) {
    console.error("❌ Erro ao buscar sessão:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});