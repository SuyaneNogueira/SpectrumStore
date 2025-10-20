import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Coloque aqui sua SECRET KEY real do Stripe (sk_test_...)
const stripe = new Stripe("sk_test_51SID8yPG8QyczJkkXBCJmNfTWMg8r7wrBDkZMeH1uzHJiPhaTfvKLZ4tqpDrMERCx6T0FBFmOFMmVyAz5KHbUO8d00hHRRW5Vm");

// ✅ Cria uma sessão de checkout dinâmica
app.post("/create-checkout-session", async (req, res) => {
  const { cartItems } = req.body;

   try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map(item => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name || "Produto sem nome",
            images: [item.image || "https://via.placeholder.com/150"],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: Number(item.quantity) || 1,
      })),
      success_url: "http://localhost:5173/sucesso",
      cancel_url: "http://localhost:5173/cancelado",
    });

    res.json({ url: session.url }); // envia o link do checkout
  } catch (err) {
    console.error("Erro Stripe:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () =>
  console.log("🚀 Servidor Stripe rodando em http://localhost:3001")
);