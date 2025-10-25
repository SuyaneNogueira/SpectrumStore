import express from "express";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { pool } from "./db.js";
import { defineRoutes } from "./CarrinhoBackT.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =========================================================
// 🔹 1. WEBHOOK STRIPE (vem antes do express.json)
// =========================================================
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      // 🔸 Quando o pagamento for concluído com sucesso
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // 🔹 Busca os itens comprados
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { limit: 100 }
        );

        // 🔹 Monta os dados do pedido
        const pedido = {
          sessionId: session.id,
          email: session.customer_email,
          total: session.amount_total / 100,
          forma_pagamento: session.payment_method_types[0] || "indefinido",
          status: "pago",
          itens: lineItems.data.map((li) => ({
            descricao: li.description,
            quantidade: li.quantity,
            preco_unitario: li.price?.unit_amount
              ? li.price.unit_amount / 100
              : 0,
          })),
        };

        console.log("✅ Pedido recebido via webhook:", pedido);

        // =====================================================
        // 🔹 SALVA O PEDIDO NO BANCO DE DADOS
        // =====================================================
        try {
          // 1️⃣ Cria o pedido principal
          const pedidoQuery = `
            INSERT INTO pedidos (session_id, customer_email, total, forma_pagamento, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
          `;
          const pedidoValues = [
            pedido.sessionId,
            pedido.email,
            pedido.total,
            pedido.forma_pagamento,
            pedido.status,
          ];

          const pedidoResult = await pool.query(pedidoQuery, pedidoValues);
          const pedidoId = pedidoResult.rows[0].id;

          // 2️⃣ Insere os itens do pedido
          for (const item of pedido.itens) {
            await pool.query(
              `
              INSERT INTO pedido_itens (pedido_id, descricao, quantidade, preco_unitario)
              VALUES ($1, $2, $3, $4);
              `,
              [pedidoId, item.descricao, item.quantidade, item.preco_unitario]
            );
          }

          console.log(`💾 Pedido salvo no banco com ID: ${pedidoId}`);
        } catch (erroBanco) {
          console.error("❌ Erro ao salvar pedido no banco:", erroBanco);
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error("⚠️ Erro webhook:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// =========================================================
// 🔹 2. MIDDLEWARES NORMAIS
// =========================================================
app.use(cors());
app.use(express.json());

// =========================================================
// 🔹 3. ROTAS NORMAIS (CRUD)
// =========================================================
defineRoutes(app);

// =========================================================
// 🔹 4. ROTAS STRIPE
// =========================================================
app.post("/create-checkout-session", async (req, res) => {
  const { cartItems, paymentMethod } = req.body;

  try {
    const paymentTypes = paymentMethod === "pix" ? ["pix"] : ["card"];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentTypes,
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || item.quantidade || 1,
      })),
      success_url:
        "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("⚠️ Erro Stripe:", err);
    res.status(500).json({ error: err.message });
  }
});

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

// =========================================================
// 🔹 5. INICIA SERVIDOR
// =========================================================
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
