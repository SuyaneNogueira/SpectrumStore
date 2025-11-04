import express from "express";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { pool } from "./db.js"; // Você já tinha isso
import { defineRoutes } from "./CarrinhoBackT.js"; // Você já tinha isso
import axios from "axios"; // <--- IMPORTANTE (para a máquina)
import { traduzirItemParaPayload } from "./tradutorMaquina.js"; // <--- A MÁGICA
import adminRoutes from './AdminRoutes.js'; // 👈 1. IMPORTE O NOVO ARQUIVO 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =========================================================
// 🔹 1. FUNÇÃO DE ENVIO PARA A BANCADA (MÁQUINA)
// =========================================================
async function enviarPedidoParaMaquina(payloadCompleto, idDoPedido) {
  const URL_DA_MAQUINA = "http://52.1.197.112:3000/queue/items";

  if (!payloadCompleto || !payloadCompleto.payload) {
    console.log(
      `[Máquina] Pedido ${idDoPedido} sem payload (item não customizável). Pulando.`
    );
    return;
  }

  console.log(
    `[Máquina] Enviando pedido ${idDoPedido} para ${URL_DA_MAQUINA}...`
  );
  console.log(`[Máquina] Payload:`, JSON.stringify(payloadCompleto, null, 2));

  try {
    const response = await axios.post(URL_DA_MAQUINA, payloadCompleto);
    console.log(`[Máquina] Pedido ${idDoPedido} enviado com SUCESSO.`);
    await pool.query(
      "UPDATE pedidos SET status_maquina = 'enviado' WHERE id = $1",
      [idDoPedido]
    );
  } catch (error) {
    console.error(
      `[Máquina] ❌ FALHA ao enviar pedido ${idDoPedido}:`,
      error.message
    );
    await pool.query(
      "UPDATE pedidos SET status_maquina = 'erro' WHERE id = $1",
      [idDoPedido]
    );
  }
}

// =========================================================
// 🔹 2. WEBHOOK STRIPE (LÓGICA CORRIGIDA)
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

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const pedidoId = session.metadata.pedidoId; // <--- PEGA O ID DO NOSSO BANCO

        if (!pedidoId) {
          console.error(
            "❌ [Webhook] FATAL: Pagamento recebido sem 'pedidoId' no metadata!"
          );
          return res.json({ received: true, error: "Missing pedidoId" });
        }

        console.log(`[Webhook] Recebido pagamento para Pedido ID: ${pedidoId}`);

        try {
          // ATUALIZA o status do pedido para 'pago'
          const updateResult = await pool.query(
            `UPDATE pedidos 
                 SET status = 'pago', forma_pagamento = $1 
                 WHERE id = $2 AND status = 'pendente'`,
            [session.payment_method_types[0] || "indefinido", pedidoId]
          );

          if (updateResult.rowCount === 0) {
            console.warn(
              `[Webhook] Pedido ${pedidoId} já estava pago ou não foi encontrado.`
            );
          } else {
            console.log(
              `💾 [Webhook] Pedido ${pedidoId} atualizado para PAGO.`
            );
          }

          // BUSCA os payloads da máquina que JÁ salvamos
          const itensResult = await pool.query(
            `SELECT payload_maquina FROM pedido_itens WHERE pedido_id = $1`,
            [pedidoId]
          );

          // ENVIA CADA ITEM PARA A MÁQUINA
          console.log(
            `[Máquina] Disparando envio para ${itensResult.rowCount} item(ns) do pedido ${pedidoId}.`
          );
          for (const item of itensResult.rows) {
            if (
              item.payload_maquina &&
              item.payload_maquina !== "null" &&
              item.payload_maquina !== "{}"
            ) {
              const payload = JSON.parse(item.payload_maquina);
              enviarPedidoParaMaquina(payload, pedidoId); // (Sem 'await')
            } else {
              console.log(
                `[Webhook] Pedido ${pedidoId} não tem payload, pulando.`
              );
            }
          }
        } 
        
        catch (erroBanco) {
          console.error(
            `❌ [Webhook] Erro ao processar pedido ${pedidoId}:`,
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
// 🔹 3. MIDDLEWARES NORMAIS
// =========================================================
app.use(cors());
app.use(express.json());

// =========================================================
// 🔹 4. ROTAS NORMAIS (CRUD)
// =========================================================
defineRoutes(app);

// =========================================================
// 🔹 5. ROTA DE CHECKOUT (LÓGICA CORRIGIDA)
// =========================================================
app.post("/create-checkout-session", async (req, res) => {
  console.log("\n--- INÍCIO DA ROTA /create-checkout-session ---");

  try {
    const { cartItems, paymentMethod } = req.body;
    console.log(
      "DADOS PUROS DO FRONTEND (cartItems):",
      JSON.stringify(cartItems, null, 2)
    );

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Carrinho está vazio." });
    }

    // --- INÍCIO DA NOVA LÓGICA DE PRÉ-SALVAMENTO ---

    let totalPedido = 0;
    cartItems.forEach((item) => {
      totalPedido +=
        (Number(item.price) || 0) *
        (Number(item.quantity || item.quantidade) || 1);
    });

    // 1. Salva o pedido "Pai" como 'pendente'
    const pedidoQuery = `
            INSERT INTO pedidos (usuario_id, total, forma_pagamento, status, data_pedido, status_maquina)
            VALUES ($1, $2, $3, $4, now(), 'pendente')
            RETURNING id;
        `;
    const pedidoValues = [
      1,
      totalPedido,
      paymentMethod || "indefinido",
      "pendente",
    ];
    const pedidoResult = await pool.query(pedidoQuery, pedidoValues);
    const pedidoId = pedidoResult.rows[0].id; // <--- PEGAMOS O NOVO ID

    console.log(`💾 Pedido ${pedidoId} salvo como 'pendente'.`);

    // 2. Salva os itens E TRADUZ
    const lineItemsParaStripe = [];

    for (const item of cartItems) {
      // 2a. TRADUZIR o item
      const payloadMaquina = traduzirItemParaPayload(item, pedidoId); // <--- CHAMA O TRADUTOR

      // 2b. Salvar o item no BD com a tradução
      // (Verifique se sua tabela pedido_itens tem essas colunas!)
      await pool.query(
        `INSERT INTO pedido_itens (pedido_id, descricao, quantidade, preco_unitario, customizacao_json, payload_maquina)
                 VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          pedidoId,
          item.name || "Produto sem nome",
          Number(item.quantity || item.quantidade) || 1,
          Number(item.price) || 0,
          JSON.stringify(item.customizations || {}), // Salva a "versão humana"
          JSON.stringify(payloadMaquina || {}), // Salva a "versão máquina"
        ]
      );

      // 2c. Preparar o item para o Stripe (SEM customizações)
      lineItemsParaStripe.push({
        price_data: {
          currency: "brl",
          product_data: { name: item.name || "Produto sem nome" },
          unit_amount: Math.round((Number(item.price) || 0) * 100),
        },
        quantity: Number(item.quantity || item.quantidade) || 1,
      });
    }

    console.log(`💾 Itens do Pedido ${pedidoId} salvos e traduzidos.`);
    // --- FIM DA NOVA LÓGICA ---

    // 3. Criar a sessão Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethod === "pix" ? ["pix"] : ["card"],
      mode: "payment",
      line_items: lineItemsParaStripe,
      success_url:
        "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado",
      metadata: {
        pedidoId: pedidoId, // <--- ENVIANDO NOSSO ID PARA O STRIPE
      },
    });

    console.log(`✅ Sessão Stripe criada para Pedido ${pedidoId}.`);
    res.json({ url: session.url });
  } catch (err) {
    console.error("❌❌❌ FALHA EM /create-checkout-session:", err);
    res.status(500).json({ error: err.message, message: err.message });
  }
});

// =========================================================
// 🔹 6. OUTRAS ROTAS (Ajustadas ou Mantidas)
// =========================================================
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

app.post("/verificar-e-salvar-pedido-bloqueante", async (req, res) => {
 const { sessionId } = req.body;
 if (!sessionId) { /* ... (erro) ... */ }

 try {
 const session = await stripe.checkout.sessions.retrieve(sessionId);
 if (session.payment_status !== "paid") { /* ... (erro) ... */ }
 const pedidoId = session.metadata.pedidoId;
 if (!pedidoId) { /* ... (erro) ... */ }

 console.log(`[Verificar-Bloqueante] Página de Sucesso acessada para Pedido ID: ${pedidoId}`);

 // Tenta atualizar para "pago"
 await pool.query(
 `UPDATE pedidos SET status = 'pago' WHERE id = $1 AND status = 'pendente'`,
 [pedidoId]
);

// Busca os itens
 const itensResult = await pool.query(
 `SELECT payload_maquina FROM pedido_itens WHERE pedido_id = $1`,
 [pedidoId]
 );
 
        let statusFinalMaquina = 'nenhum_item'; // Padrão

 for (const item of itensResult.rows) {
 if (item.payload_maquina && item.payload_maquina !== 'null' && item.payload_maquina !== '{}') {
 const payload = JSON.parse(item.payload_maquina); 
                
                // CHAMA A FUNÇÃO DE ENVIO E ESPERA (com await)
 const sucesso = await enviarPedidoParaMaquina(payload, pedidoId); 
                statusFinalMaquina = sucesso ? 'enviado' : 'erro';
 }
 }

 // Responde ao frontend com o status final
 res.json({ 
            success: true, 
            pedidoId: pedidoId,
            maquinaStatus: statusFinalMaquina // Retorna 'enviado', 'erro', ou 'nenhum_item'
        });

 } catch (err) {
 console.error("❌ Erro ao verificar e salvar pedido (bloqueante):", err.message);
 res.status(500).json({ success: false, error: err.message });
 }
});

app.post("/verificar-e-salvar-pedido", async (req, res) => {
  // Esta rota é um "backup" se o webhook falhar.
  // Vamos corrigir a lógica dela também.
  const { sessionId } = req.body;
  if (!sessionId) {
    return res
      .status(400)
      .json({ success: false, error: "Session ID não fornecido." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ success: false, error: "Pagamento não confirmado." });
    }

    const pedidoId = session.metadata.pedidoId;
    if (!pedidoId) {
      return res
        .status(400)
        .json({ success: false, error: "Pedido ID não encontrado." });
    }

    console.log(
      `[Verificar] Página de Sucesso acessada para Pedido ID: ${pedidoId}`
    );

    // Roda a mesma lógica do webhook
    const updateResult = await pool.query(
      `UPDATE pedidos SET status = 'pago' WHERE id = $1 AND status = 'pendente'`,
      [pedidoId]
    );

    if (updateResult.rowCount > 0) {
      console.log(`💾 [Verificar] Pedido ${pedidoId} atualizado para PAGO.`);
      // (Nós sempre tentamos enviar, não importa quem atualizou o status)
      const itensResult = await pool.query(
        `SELECT payload_maquina FROM pedido_itens WHERE pedido_id = $1`,
        [pedidoId]
      );

      console.log(
        `[Máquina] Disparando envio (via Página de Sucesso) para ${itensResult.rowCount} item(ns)...`
      );
      for (const item of itensResult.rows) {
        // 👇👇👇 COMEÇO DA CORREÇÃO 👇👇👇
        if (
          item.payload_maquina &&
          item.payload_maquina !== "null" &&
          item.payload_maquina !== "{}"
        ) {
          const payload = JSON.parse(item.payload_maquina);
          enviarPedidoParaMaquina(payload, pedidoId); // (Sem 'await')
        } else {
          console.log(
            `[Verificar] Pedido ${pedidoId} não tem payload, pulando.`
          );
        }
      }
    } else {
      console.log(`[Verificar] Pedido ${pedidoId} já estava pago.`);
    }

    res.json({ success: true, pedidoId: pedidoId });
  } catch (err) {
    console.error("❌ Erro ao verificar e salvar pedido:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================
// 🔹 7. INICIA SERVIDOR
// =========================================================
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
