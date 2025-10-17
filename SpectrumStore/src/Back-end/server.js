// server.js
import express from 'express';
import cors from 'cors';
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

