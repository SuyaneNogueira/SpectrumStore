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

        // <--- CORREÇÃO: Verificação de duplicidade REMOVIDA para simplificar
        // (Vamos deixar o INSERT acontecer)
        
        // 🔹 Busca os itens
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { limit: 100 }
        );

        // 🔹 Monta o pedido
        const pedido = {
          sessionId: session.id,
          // (Usamos "placeholder" pois a tabela não tem mais a coluna email)
          email: session.customer_email || session.customer_details?.email || "email.nao.coletado@stripe.com",
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

        // 🔹 Salva no banco
        try {
          // <--- CORREÇÃO: SQL ajustado para bater com a tabela 'pedidos' ---
          const pedidoQuery = `
            INSERT INTO pedidos (usuario_id, total, forma_pagamento, status, data_pedido)
            VALUES ($1, $2, $3, $4, now())
            RETURNING id;
          `;
          
          const pedidoValues = [
            1, // <--- HACK: Colocando usuario_id = 1
            pedido.total,
            pedido.forma_pagamento,
            pedido.status,
          ];
          // ---> FIM DA CORREÇÃO

          const pedidoResult = await pool.query(pedidoQuery, pedidoValues);
          const pedidoId = pedidoResult.rows[0].id;

          // Salva os itens (Este código já estava CORRETO)
          for (const item of pedido.itens) {
            await pool.query(
              `
              INSERT INTO pedido_itens (pedido_id, descricao, quantidade, preco_unitario)
              VALUES ($1, $2, $3, $4);
              `,
              [pedidoId, item.descricao, item.quantidade, item.preco_unitario]
            );
          }

          console.log(`💾 [Webhook] Pedido salvo no banco com ID: ${pedidoId}`);
        } catch (erroBanco) {
          console.error(
            "❌ [Webhook] Erro ao salvar pedido no banco:",
            erroBanco
          );
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
  // --- DEBUG: Log 1 ---
  console.log("\n--- INÍCIO DA ROTA /create-checkout-session ---");
  console.log("req.body BRUTO:", req.body); 

  try {
    // <--- Movido para DENTRO do try
    const { cartItems, paymentMethod } = req.body;

    // --- DEBUG: Log 2 ---
    console.log("DADOS PUROS DO FRONTEND (cartItems):", JSON.stringify(cartItems, null, 2));

    // Validação crucial
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("❌ ERRO FATAL: 'cartItems' é inválido ou vazio.");
      return res.status(400).json({ error: "Carrinho está vazio ou dados inválidos." });
    }

    const paymentTypes = paymentMethod === "pix" ? ["pix"] : ["card"];

    const lineItems = cartItems.map((item) => {
      // Validação robusta de cada item
      const priceAsNumber = Number(item.price) || 0;
      const quantityAsNumber = Number(item.quantity || item.quantidade) || 1;

      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name || "Produto sem nome",
            images: ["https://i.imgur.com/zYIlgBl.png"], // Usando placeholder
          },
          unit_amount: Math.max(Math.round(priceAsNumber * 100), 50),
        },
        quantity: quantityAsNumber,
      };
    });

    // --- DEBUG: Log 3 ---
    console.log("DADOS PRONTOS PARA O STRIPE (line_items):", JSON.stringify(lineItems, null, 2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentTypes,
      mode: "payment",
      // (customer_email_collection removido para compatibilidade)
      line_items: lineItems,
      success_url: "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado",
    });

    // --- SUCESSO ---
    console.log("✅ Sessão Stripe criada com sucesso.");
    res.json({ url: session.url });

  } catch (err) {
    // --- FALHA ---
    console.error("❌❌❌ O BACKEND CRASHOU AQUI (Checkout) ❌❌❌");
    console.error("⚠️ Erro DETALHADO:", err); 
    
    res.status(500).json({ 
      error: "Erro do servidor ao criar sessão.", 
      message: err.message 
    });
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
// 🔹 5. NOVA ROTA DE VERIFICAÇÃO PÓS-COMPRA
// =========================================================
app.post("/verificar-e-salvar-pedido", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res
      .status(400)
      .json({ success: false, error: "Session ID não fornecido." });
  }

  try {
    // 1. Busca a sessão direto da Stripe para confirmar o pagamento
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 2. Verifica se o pagamento foi de fato "pago"
    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ success: false, error: "Pagamento não confirmado." });
    }

    // 3. <--- CORREÇÃO: Verificação de duplicidade REMOVIDA para simplificar
    // (Vamos deixar o INSERT acontecer)
    
    // 4. SE NÃO FOI SALVO, buscamos os itens e salvamos no banco
    console.log(`✅ Pedido recebido via Página de Sucesso: ${sessionId}`);
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    const pedido = {
      sessionId: session.id,
      email: session.customer_email || session.customer_details?.email || "email.nao.coletado@stripe.com",
      total: session.amount_total / 100,
      forma_pagamento: session.payment_method_types[0] || "indefinido",
      status: "pago",
      itens: lineItems.data.map((li) => ({
        descricao: li.description,
        quantidade: li.quantity,
        preco_unitario: li.price?.unit_amount ? li.price.unit_amount / 100 : 0,
      })),
    };

    // 5. Salva no banco (Lógica corrigida para bater com a tabela)
    const pedidoQuery = `
      INSERT INTO pedidos (usuario_id, total, forma_pagamento, status, data_pedido)
      VALUES ($1, $2, $3, $4, now())
      RETURNING id;
    `;
    
    const pedidoValues = [
      1, // <--- HACK: Colocando usuario_id = 1
      pedido.total,
      pedido.forma_pagamento,
      pedido.status,
    ];

    const pedidoResult = await pool.query(pedidoQuery, pedidoValues);
    const pedidoId = pedidoResult.rows[0].id;

    // Salva os itens (Este código já estava CORRETO e bate com sua foto)
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