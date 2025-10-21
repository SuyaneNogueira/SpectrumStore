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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { cartItems, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: cartItems.map(item => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            description: item.description || undefined,
            images: item.image ? [item.image] : [], // imagem: precisa ser URL pública
            metadata: {
              productId: String(item.id || ""), // id do seu produto no seu DB
            }
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantidade || 1,
        // metadata no nível do line_item não é suportado em todas as versões;
        // prefer usar product_data.metadata ou session.metadata
      })),
      metadata: {
        cartId: String(req.body.cartId || ""), // id do carrinho no seu sistema
      },
      success_url: "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado"
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// webhook (raw body)
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Recupera os line items completos (quantidade, produto, price)
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

      // Exemplo: salvar pedido no DB
      const pedido = {
        sessionId: session.id,
        customer_email: session.customer_email,
        total: session.amount_total, // em centavos
        items: lineItems.data.map(li => ({
          description: li.description,
          quantity: li.quantity,
          price: li.amount_total ? li.amount_total / 100 : null,
          price_unit: li.price?.unit_amount ? li.price.unit_amount / 100 : null,
          price_id: li.price?.id || null,
          product_id: li.price?.product || li.price?.product_data?.id || null,
          // Se você colocou product_data.metadata.productId, é preciso recuperar expandindo price.product
        }))
      };

      console.log('Pedido recebido via webhook:', pedido);
      // TODO: salvar pedido no DB, enviar e-mail, etc.
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Erro webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.listen(3001, () => console.log('Server rodando na porta 3001'));
// 
