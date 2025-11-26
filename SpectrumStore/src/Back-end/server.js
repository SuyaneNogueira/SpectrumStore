import express from "express";
import cors from "cors";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pkg from "pg";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import { defineRoutes } from "./CarrinhoBackT.js";
import { traduzirItemParaPayload } from "./tradutorMaquina.js";
import adminRoutes from './AdminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { Pool } = pkg;

// =========================================================
// 🔹 CONFIGURAÇÕES GERAIS
// =========================================================

// Configuração para __dirname no ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TesteSpectrum',
  password: 'senai',
  port: 5432,
});

// =========================================================
// 🔹 CONFIGURAÇÃO MULTER PARA UPLOAD DE FOTOS
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'fotos');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.params.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `foto-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

// =========================================================
// 🔹 MIDDLEWARES
// =========================================================

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// 🔹 2. WEBHOOK STRIPE
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
        const pedidoId = session.metadata.pedidoId;

        if (!pedidoId) {
          console.error(
            "❌ [Webhook] FATAL: Pagamento recebido sem 'pedidoId' no metadata!"
          );
          return res.json({ received: true, error: "Missing pedidoId" });
        }

        console.log(`[Webhook] Recebido pagamento para Pedido ID: ${pedidoId}`);

        try {
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

          const itensResult = await pool.query(
            `SELECT payload_maquina FROM pedido_itens WHERE pedido_id = $1`,
            [pedidoId]
          );

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
              enviarPedidoParaMaquina(payload, pedidoId);
            } else {
              console.log(
                `[Webhook] Pedido ${pedidoId} não tem payload, pulando.`
              );
            }
          }
        } catch (erroBanco) {
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
// 🔹 3. ROTAS DE USUÁRIOS (Sistema de Autenticação)
// =========================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor Spectrum Store está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Listar todos os usuários
app.get('/api/usuarios', async (req, res) => {
  try {
    console.log('📋 Listando todos os usuários...');
    
    const result = await pool.query(
      `SELECT id, nome, email, data_nascimento as "dataNascimento", 
              data_cadastro as "dataCadastro", ativo, foto_url as "fotoUrl"
       FROM usuario 
       ORDER BY id`
    );

    console.log(`✅ Encontrados ${result.rows.length} usuários`);
    
    res.json({
      success: true,
      usuarios: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Cadastrar usuário
app.post('/api/usuarios', async (req, res) => {
  console.log('🎯 Recebendo requisição de cadastro');
  
  try {
    const { nome, email, dataNascimento, senha, termosAceitos } = req.body;

    console.log('📥 Dados:', { nome, email, dataNascimento: dataNascimento || 'não informado' });

    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        success: false,
        message: 'Nome, email e senha são obrigatórios' 
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    const usuarioExistente = await pool.query(
      'SELECT id FROM usuario WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Este email já está cadastrado' 
      });
    }

    const query = `
      INSERT INTO usuario (nome, email, senha, data_nascimento, termos_aceitos, ativo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nome, email, data_nascimento as "dataNascimento", termos_aceitos as "termosAceitos", data_cadastro as "dataCadastro", ativo, foto_url as "fotoUrl"
    `;
    
    const values = [
      nome.trim(),
      email.toLowerCase().trim(),
      senha,
      dataNascimento || null,
      termosAceitos || false,
      true
    ];

    console.log('💾 Executando INSERT...');
    const result = await pool.query(query, values);
    const novoUsuario = result.rows[0];

    const token = jwt.sign(
      { 
        userId: novoUsuario.id, 
        email: novoUsuario.email 
      },
      'secret-key-spectrum-store',
      { expiresIn: '24h' }
    );

    console.log('✅ Usuário criado com sucesso! ID:', novoUsuario.id);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      usuario: novoUsuario,
      token
    });

  } catch (error) {
    console.error('❌ Erro no cadastro:', error.message);
    
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Login
app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    const result = await pool.query(
      'SELECT * FROM usuario WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const usuario = result.rows[0];

    if (senha !== usuario.senha) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const token = jwt.sign(
      { 
        userId: usuario.id, 
        email: usuario.email 
      },
      'secret-key-spectrum-store',
      { expiresIn: '24h' }
    );

    const { senha: _, ...usuarioSemSenha } = usuario;
    
    const usuarioFormatado = {
      id: usuarioSemSenha.id,
      nome: usuarioSemSenha.nome,
      email: usuarioSemSenha.email,
      dataNascimento: usuarioSemSenha.data_nascimento,
      termosAceitos: usuarioSemSenha.termos_aceitos,
      dataCadastro: usuarioSemSenha.data_cadastro,
      ativo: usuarioSemSenha.ativo,
      fotoUrl: usuarioSemSenha.foto_url
    };

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      usuario: usuarioFormatado,
      token
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando usuário ID:', id);

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const result = await pool.query(
      `SELECT id, nome, email, data_nascimento as "dataNascimento", 
              termos_aceitos as "termosAceitos", data_cadastro as "dataCadastro", ativo, foto_url as "fotoUrl"
       FROM usuario 
       WHERE id = $1 AND ativo = true`,
      [userId]
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado ID:', userId);
      
      const usuarioInativo = await pool.query(
        'SELECT id, ativo FROM usuario WHERE id = $1',
        [userId]
      );
      
      if (usuarioInativo.rows.length > 0) {
        console.log('⚠️ Usuário existe mas está inativo:', userId);
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado (está inativo)'
        });
      }
      
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const usuario = result.rows[0];
    console.log('✅ Usuário encontrado:', usuario);

    res.json({
      success: true,
      usuario: usuario
    });

  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Atualizar usuário
app.put('/api/usuarios/:id', async (req, res) => {
  console.log('🎯 Recebendo requisição PUT para atualização');
  console.log('📝 ID:', req.params.id);
  console.log('📦 Body:', { ...req.body, fotoUrl: req.body.fotoUrl ? 'presente' : 'não enviada' });
  
  try {
    const { id } = req.params;
    const { nome, email, dataNascimento, senha, fotoUrl } = req.body;

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID inválido' 
      });
    }

    if (!nome || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Nome e email são obrigatórios' 
      });
    }

    const usuarioExistente = await pool.query(
      'SELECT id, email FROM usuario WHERE id = $1 AND ativo = true',
      [userId]
    );

    if (usuarioExistente.rows.length === 0) {
      console.log('❌ Usuário não encontrado para atualização ID:', userId);
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    const emailExistente = await pool.query(
      'SELECT id FROM usuario WHERE email = $1 AND id != $2 AND ativo = true',
      [email.toLowerCase(), userId]
    );

    if (emailExistente.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Este email já está em uso por outro usuário' 
      });
    }

    let query;
    let values;

    if (senha) {
      query = `
        UPDATE usuario 
        SET nome = $1, email = $2, data_nascimento = $3, senha = $4, data_atualizacao = CURRENT_TIMESTAMP 
        WHERE id = $5 
        RETURNING id, nome, email, data_nascimento as "dataNascimento", data_cadastro as "dataCadastro", ativo, foto_url as "fotoUrl"
      `;
      values = [
        nome.trim(), 
        email.toLowerCase().trim(), 
        dataNascimento || null, 
        senha, 
        userId
      ];
    } else {
      query = `
        UPDATE usuario 
        SET nome = $1, email = $2, data_nascimento = $3, data_atualizacao = CURRENT_TIMESTAMP 
        WHERE id = $4 
        RETURNING id, nome, email, data_nascimento as "dataNascimento", data_cadastro as "dataCadastro", ativo, foto_url as "fotoUrl"
      `;
      values = [
        nome.trim(), 
        email.toLowerCase().trim(), 
        dataNascimento || null, 
        userId
      ];
    }

    console.log('💾 Executando UPDATE...');
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nenhum usuário foi atualizado'
      });
    }

    const usuarioAtualizado = result.rows[0];

    console.log('✅ Usuário atualizado com sucesso! ID:', usuarioAtualizado.id);

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      usuario: usuarioAtualizado
    });

  } catch (error) {
    console.error('❌ Erro na atualização PUT:', error.message);
    
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Upload de foto
app.post('/api/usuarios/:id/foto', upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📸 Recebendo upload de foto para usuário ID:', id);
    console.log('📁 Arquivo:', req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID inválido' 
      });
    }

    const usuarioExistente = await pool.query(
      'SELECT id FROM usuario WHERE id = $1 AND ativo = true',
      [userId]
    );

    if (usuarioExistente.rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    const fotoUrl = `/uploads/fotos/${req.file.filename}`;
    const fullFotoUrl = `http://localhost:${PORT}${fotoUrl}`;

    console.log('🖼️ URL da foto:', fullFotoUrl);

    const result = await pool.query(
      `UPDATE usuario 
       SET foto_url = $1, data_atualizacao = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, nome, email, foto_url as "fotoUrl"`,
      [fullFotoUrl, userId]
    );

    const usuarioAtualizado = result.rows[0];

    console.log('✅ Foto atualizada com sucesso para usuário ID:', userId);

    res.json({
      success: true,
      message: 'Foto atualizada com sucesso',
      fotoUrl: fullFotoUrl,
      usuario: usuarioAtualizado
    });

  } catch (error) {
    console.error('❌ Erro no upload da foto:', error);
    
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Deletar usuário
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Recebendo requisição DELETE para usuário ID:', id);

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const usuarioExistente = await pool.query(
      'SELECT id, nome, email, foto_url FROM usuario WHERE id = $1 AND ativo = true',
      [userId]
    );

    if (usuarioExistente.rows.length === 0) {
      console.log('❌ Usuário não encontrado para exclusão ID:', userId);
      
      const usuarioInativo = await pool.query(
        'SELECT id, nome, ativo FROM usuario WHERE id = $1',
        [userId]
      );
      
      if (usuarioInativo.rows.length > 0) {
        console.log('⚠️ Usuário já está inativo ID:', userId);
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado (já está excluído)'
        });
      }
      
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const usuario = usuarioExistente.rows[0];
    console.log('👤 Usuário a ser excluído:', { id: usuario.id, nome: usuario.nome, email: usuario.email });

    if (usuario.foto_url) {
      try {
        const fotoPath = path.join(__dirname, 'uploads', 'fotos', path.basename(usuario.foto_url));
        if (fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
          console.log('🗑️ Foto deletada:', fotoPath);
        }
      } catch (fotoError) {
        console.warn('⚠️ Erro ao deletar foto:', fotoError.message);
      }
    }

    const result = await pool.query(
      'UPDATE usuario SET ativo = false, data_atualizacao = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [userId]
    );

    console.log('✅ Usuário deletado (soft delete). ID:', userId);

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso',
      usuarioId: userId
    });

  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// =========================================================
// 🔹 4. ROTAS DO CARRINHO E PAGAMENTOS
// =========================================================

// Rota para criar sessão de checkout
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

    let totalPedido = 0;
    cartItems.forEach((item) => {
      totalPedido +=
        (Number(item.price) || 0) *
        (Number(item.quantity || item.quantidade) || 1);
    });

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
    const pedidoId = pedidoResult.rows[0].id;

    console.log(`💾 Pedido ${pedidoId} salvo como 'pendente'.`);

    const lineItemsParaStripe = [];

    for (const item of cartItems) {
      const payloadMaquina = traduzirItemParaPayload(item, pedidoId);

      await pool.query(
        `INSERT INTO pedido_itens (pedido_id, descricao, quantidade, preco_unitario, customizacao_json, payload_maquina)
                 VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          pedidoId,
          item.name || "Produto sem nome",
          Number(item.quantity || item.quantidade) || 1,
          Number(item.price) || 0,
          JSON.stringify(item.customizations || {}),
          JSON.stringify(payloadMaquina || {}),
        ]
      );

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethod === "pix" ? ["pix"] : ["card"],
      mode: "payment",
      line_items: lineItemsParaStripe,
      success_url:
        "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado",
      metadata: {
        pedidoId: pedidoId,
      },
    });

    console.log(`✅ Sessão Stripe criada para Pedido ${pedidoId}.`);
    res.json({ url: session.url });
  } catch (err) {
    console.error("❌❌❌ FALHA EM /create-checkout-session:", err);
    res.status(500).json({ error: err.message, message: err.message });
  }
});

// Verificar sessão de checkout
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

// Verificar e salvar pedido (backup)
app.post("/verificar-e-salvar-pedido", async (req, res) => {
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

    const updateResult = await pool.query(
      `UPDATE pedidos SET status = 'pago' WHERE id = $1 AND status = 'pendente'`,
      [pedidoId]
    );

    if (updateResult.rowCount > 0) {
      console.log(`💾 [Verificar] Pedido ${pedidoId} atualizado para PAGO.`);
      const itensResult = await pool.query(
        `SELECT payload_maquina FROM pedido_itens WHERE pedido_id = $1`,
        [pedidoId]
      );

      console.log(
        `[Máquina] Disparando envio (via Página de Sucesso) para ${itensResult.rowCount} item(ns)...`
      );
      for (const item of itensResult.rows) {
        if (
          item.payload_maquina &&
          item.payload_maquina !== "null" &&
          item.payload_maquina !== "{}"
        ) {
          const payload = JSON.parse(item.payload_maquina);
          enviarPedidoParaMaquina(payload, pedidoId);
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
// 🔹 5. ROTAS DE PRODUTOS
// =========================================================

// Listar produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erro ao buscar produtos:", err);
    res.status(500).json({ error: 'Erro interno ao buscar produtos.' });
  }
});

// Criar produto
app.post('/api/produtos', async (req, res) => {
  console.log("[API] Recebida requisição para criar novo produto...");
  const { name, price, description, category, image, personalizacao } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Nome, Preço e Categoria são obrigatórios.' });
  }
  
  const personalizacaoJson = JSON.stringify(personalizacao || {});

  try {
    const query = `
      INSERT INTO produtos (name, price, description, category, image, personalizacao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *; 
    `;
    const values = [name, price, description, category, image, personalizacaoJson];
    const result = await pool.query(query, values);

    console.log(`[API] Produto #${result.rows[0].id} salvo no banco.`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erro ao salvar produto:", err);
    res.status(500).json({ error: 'Erro interno ao salvar produto.', details: err.message });
  }
});

// Editar produto
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, image, personalizacao } = req.body;
  const personalizacaoJson = JSON.stringify(personalizacao || {});
  
  try {
    const query = `
      UPDATE produtos 
      SET name = $1, price = $2, description = $3, category = $4, image = $5, personalizacao = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [name, price, description, category, image, personalizacaoJson, id];
    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`❌ Erro ao atualizar produto #${id}:`, err);
    res.status(500).json({ error: 'Erro interno ao atualizar produto.' });
  }
});

// Excluir produto
app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(`❌ Erro ao excluir produto #${id}:`, err);
    res.status(500).json({ error: 'Erro interno ao excluir produto.' });
  }
});

// =========================================================
// 🔹 6. ROTAS DE RETIRADA
// =========================================================

// Listar pedidos prontos para retirada
app.get('/retirada/pedidos-prontos', (req, res) => {
  console.log('📦 Buscando pedidos prontos para retirada...');

  res.json({
    pedidos: [
      {
        id: '671a5b8c9d0e1f2a3b4c5d6e',
        orderId: 'PED-TESTE-001',
        sku: 'KIT-01',
        cor: 'azul',
        estoquePos: 5,
        callbackUrl: '',
        createdAt: new Date().toISOString(),
        prontoDesde: new Date().toISOString(),
        payload: { 
          orderId: 'PED-TESTE-001', 
          sku: 'KIT-01', 
          cor: 'azul',
          categoria: 'BrinquedosSensoriais'
        }
      }
    ],
    total: 1,
    timestamp: new Date().toISOString()
  });
});

// Confirmar retirada
app.post('/retirada/:orderId/confirmar', (req, res) => {
  const { orderId } = req.params;

  console.log(`✅ Confirmando retirada do pedido: ${orderId}`);

  res.json({
    message: 'Retirada confirmada com sucesso',
    orderId: orderId,
    pedidoId: '671a5b8c9d0e1f2a3b4c5d6e',
    confirmacao: {
      confirmadoEm: new Date().toISOString(),
      localRetirada: 'Loja Principal - Balcão 1',
      funcionario: `Func-${Math.floor(Math.random() * 100)}`,
      codigoConfirmacao: `RET-${Date.now()}`,
      metodoVerificacao: 'Código do pedido'
    },
    timestamp: new Date().toISOString()
  });
});

// Status da área de retirada
app.get('/retirada/status', (req, res) => {
  res.json({
    resumo: {
      prontosParaRetirada: 1,
      retiradosHoje: 5,
      totalProcessado: 6
    },
    areaRetirada: {
      balcoesAtivos: 2,
      tempoMedioRetirada: '2-5 minutos',
      filaRetirada: Math.floor(Math.random() * 5),
      funcionariosDisponiveis: Math.floor(Math.random() * 3) + 1,
      horarioFuncionamento: '08:00 - 22:00'
    },
    timestamp: new Date().toISOString()
  });
});

// Cancelar retirada
app.post('/retirada/:orderId/cancelar', (req, res) => {
  const { orderId } = req.params;
  const { motivo } = req.body;

  console.log(`❌ Cancelando retirada do pedido: ${orderId} - Motivo: ${motivo}`);

  res.json({
    message: 'Retirada cancelada com sucesso',
    orderId: orderId,
    timestamp: new Date().toISOString()
  });
});

// Status de um pedido específico
app.get('/queue/items/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    _id: id,
    payload: { 
      orderId: 'PED-TESTE-001', 
      sku: 'KIT-01', 
      cor: 'azul',
      categoria: 'BrinquedosSensoriais'
    },
    status: 'COMPLETED',
    stage: 'PRONTO_RETIRADA',
    progress: 100,
    estoquePos: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

// =========================================================
// 🔹 7. ROTAS ADICIONAIS E ADMIN
// =========================================================

// Rota de teste simples
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend SpectrumStore funcionando! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Integrar rotas do carrinho e admin
defineRoutes(app);
app.use(adminRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
});

// =========================================================
// 🔹 INICIAR SERVIDOR
// =========================================================

app.listen(PORT, () => {
  console.log(`🎉 Backend SpectrumStore rodando em http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Sistema de Usuários: http://localhost:${PORT}/api/usuarios`);
  console.log(`🛒 Sistema de Carrinho: http://localhost:${PORT}/create-checkout-session`);
  console.log(`📦 Sistema de Retirada: http://localhost:${Port}/retirada/pedidos-prontos`);
  console.log(`🛍️  Sistema de Produtos: http://localhost:${PORT}/api/produtos`);
  console.log('==============================================');
});

export default app;