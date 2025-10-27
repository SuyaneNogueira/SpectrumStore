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
// 🔹 1. WEBHOOK STRIPE (vem ANTES do express.json)
// (Deixamos este código aqui para quando você for para produção)
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

      // 🔸 Quando o pagamento for concluído
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // <--- ADICIONADO: Verificação para evitar duplicidade
        // (Caso a página de sucesso já tenha salvado)
        const checkQuery = "SELECT id FROM pedidos WHERE session_id = $1";
        const checkResult = await pool.query(checkQuery, [session.id]);
        
        if (checkResult.rows.length > 0) {
          console.log(`🟡 Webhook: Pedido ${session.id} já foi salvo. Ignorando.`);
          return res.json({ received: true });
        }
        // ---> FIM DA ADIÇÃO

        // 🔹 Busca os itens
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

        // 🔹 Monta o pedido
        const pedido = {
          sessionId: session.id,
          email: session.customer_email || session.customer_details?.email, // <--- MELHORADO
          total: session.amount_total / 100,
          forma_pagamento: session.payment_method_types[0] || "indefinido",
          status: "pago",
          itens: lineItems.data.map((li) => ({
            descricao: li.description,
            quantidade: li.quantity,
            preco_unitario: li.price?.unit_amount ? li.price.unit_amount / 100 : 0,
          })),
        };

        console.log("✅ Pedido recebido via webhook:", pedido);

        // 🔹 Salva no banco
        try {
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
          console.error("❌ Erro ao salvar pedido no banco (webhook):", erroBanco);
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
// 🔹 2. MIDDLEWARES NORMAIS (vem DEPOIS do webhook)
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
      
      // <--- ADICIONADO: Coleta de e-mail obrigatória
      customer_email_collection: { enabled: true },
      // ---> FIM DA ADIÇÃO

      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          // <--- MELHORADO: Garante um valor mínimo (ex: R$ 0,50) para evitar erros
          unit_amount: Math.max(Math.round(item.price * 100), 50),
          // ---> FIM DA MELHORIA
        },
        quantity: item.quantity || item.quantidade || 1,
      })),
      success_url: "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
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
// 🔹 5. NOVA ROTA DE VERIFICAÇÃO PÓS-COMPRA (Alternativa ao Webhook)
// <--- ADICIONADO: Rota inteira
// =========================================================
app.post("/verificar-e-salvar-pedido", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, error: "Session ID não fornecido." });
  }

  try {
    // 1. Busca a sessão direto da Stripe para confirmar o pagamento
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Verifica se o pagamento foi de fato "pago"
    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, error: "Pagamento não confirmado." });
    }

    // 3. (MUITO IMPORTANTE) Verifica se este pedido JÁ FOI SALVO
    // Isso evita salvar o pedido duas vezes (caso o webhook funcione)
    const checkQuery = "SELECT id FROM pedidos WHERE session_id = $1";
    const checkResult = await pool.query(checkQuery, [sessionId]);
    
    if (checkResult.rows.length > 0) {
      console.log(`🟡 Rota de Sucesso: Pedido ${sessionId} já foi salvo. Ignorando.`);
      return res.json({ success: true, pedidoId: checkResult.rows[0].id });
    }

    // 4. SE NÃO FOI SALVO, buscamos os itens e salvamos no banco
    // (Esta é a lógica exata que estava no seu webhook)
    
    console.log(`✅ Pedido recebido via Página de Sucesso: ${sessionId}`);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

    const pedido = {
      sessionId: session.id,
      email: session.customer_email || session.customer_details?.email,
      total: session.amount_total / 100,
      forma_pagamento: session.payment_method_types[0] || "indefinido",
      status: "pago",
      itens: lineItems.data.map((li) => ({
        descricao: li.description,
        quantidade: li.quantity,
        preco_unitario: li.price?.unit_amount ? li.price.unit_amount / 100 : 0,
      })),
    };

    // 5. Salva no banco (Lógica do seu webhook)
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

    for (const item of pedido.itens) {
      await pool.query(
        `INSERT INTO pedido_itens (pedido_id, descricao, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4);`,
        [pedidoId, item.descricao, item.quantidade, item.preco_unitario]
      );
    }

    console.log(`💾 Pedido salvo no banco com ID: ${pedidoId}`);
    // Retorna sucesso e o ID do novo pedido
    res.json({ success: true, pedidoId: pedidoId });

  } catch (err) {
    console.error("❌ Erro ao verificar e salvar pedido:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


// =========================================================
// 🔹 6. INICIA SERVIDOR
// =========================================================
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});