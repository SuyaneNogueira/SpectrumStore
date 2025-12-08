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
const PORT = process.env.PORT || 3001;
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
  const URL_DA_MAQUINA = "http://52.72.137.244:3000/queue/items";

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
    // 1. RECEBE O USER_ID DO FRONTEND
    const { cartItems, paymentMethod, userId } = req.body;

    console.log(`👤 Usuário ID recebido: ${userId}`);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Carrinho está vazio." });
    }
    
    // Validação de segurança: se não vier ID, não deixa criar
    if (!userId) {
        return res.status(400).json({ error: "Usuário não identificado. Faça login novamente." });
    }

    // 2. BUSCA DADOS DO CLIENTE (Para mandar pra máquina saber quem é)
    let userName = "Cliente";
    let userEmail = "email@teste.com";
    
    try {
        const userResult = await pool.query("SELECT nome, email FROM usuarios_clientes WHERE id = $1", [userId]);
        if (userResult.rows.length > 0) {
            userName = userResult.rows[0].nome;
            userEmail = userResult.rows[0].email;
        }
    } catch (e) {
        console.log("Aviso: Não foi possível buscar nome do usuário, seguindo...");
    }

    // Calcula total
    let totalPedido = 0;
    cartItems.forEach((item) => {
      totalPedido += (Number(item.price) || 0) * (Number(item.quantity || item.quantidade) || 1);
    });

    // 3. INSERE O PEDIDO COM O ID CORRETO
    const pedidoQuery = `
            INSERT INTO pedidos (usuario_id, total, forma_pagamento, status, data_pedido, status_maquina)
            VALUES ($1, $2, $3, $4, now(), 'pendente')
            RETURNING id;
        `;
    const pedidoValues = [
      userId,
      totalPedido,
      paymentMethod || "indefinido",
      "pendente",
    ];
    const pedidoResult = await pool.query(pedidoQuery, pedidoValues);
    const pedidoId = pedidoResult.rows[0].id;

    console.log(`💾 Pedido ${pedidoId} salvo para o Usuário ${userId}.`);

    const lineItemsParaStripe = [];

    for (const item of cartItems) {
      // Traduz para a máquina
      const payloadMaquina = traduzirItemParaPayload(item, pedidoId);

      // INJETA O CLIENTE NO PAYLOAD DA MÁQUINA
      if (payloadMaquina && payloadMaquina.payload) {
          payloadMaquina.payload.client = {
              id: userId,
              name: userName,
              email: userEmail
          };
      }

      // Gera código de retirada para este item (4 dígitos)
      let codigoRetirada;
      let tentativas = 0;
      
      do {
        codigoRetirada = Math.floor(1000 + Math.random() * 9000).toString();
        tentativas++;
        
        // Verifica se o código já existe
        const checkResult = await pool.query(
          'SELECT 1 FROM pedido_itens WHERE codigo_retirada = $1',
          [codigoRetirada]
        );
        
        if (checkResult.rows.length === 0 || tentativas > 10) {
          break;
        }
      } while (true);
      
      if (tentativas > 10) {
        codigoRetirada = Date.now().toString().slice(-4).padStart(4, '0');
      }

      await pool.query(
        `INSERT INTO pedido_itens (pedido_id, descricao, quantidade, preco_unitario, customizacao_json, payload_maquina, codigo_retirada)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          pedidoId,
          item.name || "Produto sem nome",
          Number(item.quantity || item.quantidade) || 1,
          Number(item.price) || 0,
          JSON.stringify(item.customizations || {}),
          JSON.stringify(payloadMaquina || {}),
          codigoRetirada  // Adiciona o código de retirada
        ]
      );

      // Envia código por email (simulação)
      console.log(`📧 Código de retirada gerado para ${item.name}: ${codigoRetirada}`);

      // Lógica da Imagem para o Stripe
      const imagensParaStripe = [];
      if (item.image && (item.image.startsWith("http://") || item.image.startsWith("https://"))) {
         imagensParaStripe.push(item.image);
      }

      lineItemsParaStripe.push({
        price_data: {
          currency: "brl",
          product_data: { 
              name: item.name || "Produto sem nome",
              images: imagensParaStripe
          },
          unit_amount: Math.round((Number(item.price) || 0) * 100),
        },
        quantity: Number(item.quantity || item.quantidade) || 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethod === "pix" ? ["pix"] : ["card"],
      mode: "payment",
      line_items: lineItemsParaStripe,
      success_url: "http://localhost:5173/sucesso?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancelado",
      metadata: {
        pedidoId: pedidoId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌❌❌ FALHA EM /create-checkout-session:", err);
    res.status(500).json({ error: err.message });
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
  
  // Gera código de retirada único
  let codigoRetirada;
  let tentativas = 0;
  
  try {
    do {
      codigoRetirada = Math.floor(1000 + Math.random() * 9000).toString();
      tentativas++;
      
      // Verifica se o código já existe
      const checkResult = await pool.query(
        'SELECT 1 FROM produtos WHERE codigo_retirada = $1',
        [codigoRetirada]
      );
      
      if (checkResult.rows.length === 0 || tentativas > 10) {
        break;
      }
    } while (true);
    
    if (tentativas > 10) {
      // Se não conseguir gerar único, usa timestamp
      codigoRetirada = Date.now().toString().slice(-4).padStart(4, '0');
    }

    const query = `
      INSERT INTO produtos (name, price, description, category, image, personalizacao, codigo_retirada)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *; 
    `;
    const values = [name, price, description, category, image, personalizacaoJson, codigoRetirada];
    const result = await pool.query(query, values);

    console.log(`[API] Produto #${result.rows[0].id} salvo no banco com código: ${codigoRetirada}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erro ao salvar produto:", err);
    res.status(500).json({ error: 'Erro interno ao salvar produto.', details: err.message });
  }
});

// Buscar produto por código de retirada
app.get('/api/produtos/codigo/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    
    console.log(`🔍 Buscando produto por código de retirada: ${codigo}`);
    
    // Verifica se é um código de 4 dígitos
    if (!/^\d{4}$/.test(codigo)) {
      return res.status(400).json({ 
        success: false,
        error: 'Código deve ter 4 dígitos numéricos' 
      });
    }
    
    // Busca o produto pelo código de retirada
    const produtoResult = await pool.query(
      `SELECT * FROM produtos WHERE codigo_retirada = $1`,
      [codigo]
    );
    
    if (produtoResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Produto não encontrado com este código' 
      });
    }
    
    const produto = produtoResult.rows[0];
    res.json(produto);
    
  } catch (error) {
    console.error('❌ Erro ao buscar produto por código:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
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
// 🔹 6. ROTAS DE RETIRADA POR CÓDIGO (SELF-SERVICE)
// =========================================================

// ROTA GET — busca produto por código de retirada (4 dígitos)
app.get('/api/retirada/codigo/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    
    console.log(`🔍 Buscando produto por código de retirada: ${codigo}`);
    
    // Verifica se é um código de 4 dígitos
    if (!/^\d{4}$/.test(codigo)) {
      return res.status(400).json({ 
        success: false,
        error: 'Código deve ter 4 dígitos numéricos' 
      });
    }
    
    // Busca o produto pelo código de retirada
    const produtoResult = await pool.query(
      `SELECT * FROM produtos WHERE codigo_retirada = $1`,
      [codigo]
    );
    
    if (produtoResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Produto não encontrado com este código' 
      });
    }
    
    const produto = produtoResult.rows[0];
    
    // Busca se há algum pedido com este produto pendente de retirada
    const pedidoResult = await pool.query(
      `SELECT 
         pi.pedido_id,
         p.status as pedido_status,
         p.data_pedido,
         u.nome as cliente_nome
       FROM pedido_itens pi
       JOIN pedidos p ON pi.pedido_id = p.id
       JOIN usuario u ON p.usuario_id = u.id
       WHERE pi.codigo_retirada = $1 
       AND p.status IN ('pago', 'processando', 'pronto para retirada')
       ORDER BY p.data_pedido DESC
       LIMIT 1`,
      [codigo]
    );
    
    let infoPedido = null;
    let slotAtribuido = null;
    
    if (pedidoResult.rows.length > 0) {
      const pedido = pedidoResult.rows[0];
      infoPedido = {
        pedidoId: pedido.pedido_id,
        status: pedido.pedido_status,
        dataPedido: pedido.data_pedido,
        clienteNome: pedido.cliente_nome
      };
      
      // Simular atribuição de slot baseado no código
      const slots = ['A1', 'A2', 'A3', 'A4', 'B5', 'B6', 'B7', 'B8', 'C9', 'C10', 'C11', 'C12'];
      const slotIndex = parseInt(codigo.slice(-2)) % slots.length;
      slotAtribuido = slots[slotIndex];
    }
    
    res.json({
      success: true,
      produto: {
        id: produto.id,
        nome: produto.name,
        descricao: produto.description,
        imagem: produto.image,
        codigoRetirada: produto.codigo_retirada,
        categoria: produto.category
      },
      pedido: infoPedido,
      slot: slotAtribuido,
      status: infoPedido ? infoPedido.status : 'disponivel',
      horarioRetirada: infoPedido && infoPedido.status === 'pronto para retirada' 
        ? new Date().toISOString() 
        : null
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar produto por código:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno no servidor' 
    });
  }
});

// ROTA POST — confirmar retirada de produto
app.post('/api/retirada/confirmar', async (req, res) => {
  try {
    const { codigo, pedidoId, slotId } = req.body;
    
    console.log(`✅ Confirmando retirada - Código: ${codigo}, Pedido: ${pedidoId}, Slot: ${slotId}`);
    
    if (!codigo) {
      return res.status(400).json({ 
        success: false,
        error: 'Código é obrigatório' 
      });
    }
    
    // Verifica se o código existe e está pendente de retirada
    const pedidoItemResult = await pool.query(
      `SELECT 
         pi.id,
         p.status,
         pr.name as produto_nome
       FROM pedido_itens pi
       JOIN pedidos p ON pi.pedido_id = p.id
       JOIN produtos pr ON pi.produto_id = pr.id
       WHERE pi.codigo_retirada = $1 
       AND p.id = $2
       AND p.status IN ('pago', 'processando', 'pronto para retirada')`,
      [codigo, pedidoId]
    );
    
    if (pedidoItemResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Produto não encontrado ou já retirado' 
      });
    }
    
    const pedidoItem = pedidoItemResult.rows[0];
    
    // Atualiza o status do item para "retirado"
    await pool.query(
      `UPDATE pedido_itens 
       SET status_retirada = 'retirado', 
           data_retirada = NOW(),
           slot_retirada = $1
       WHERE codigo_retirada = $2`,
      [slotId || null, codigo]
    );
    
    // Verifica se todos os itens do pedido foram retirados
    const itensPendentesResult = await pool.query(
      `SELECT COUNT(*) as pendentes
       FROM pedido_itens
       WHERE pedido_id = $1 
       AND status_retirada IS NULL`,
      [pedidoId]
    );
    
    const itensPendentes = parseInt(itensPendentesResult.rows[0].pendentes);
    
    if (itensPendentes === 0) {
      // Todos os itens foram retirados, atualiza status do pedido
      await pool.query(
        `UPDATE pedidos 
         SET status = 'concluido',
             data_conclusao = NOW()
         WHERE id = $1`,
        [pedidoId]
      );
    }
    
    // Libera o código para reutilização (opcional)
    await pool.query(
      `UPDATE produtos 
       SET codigo_retirada = NULL
       WHERE codigo_retirada = $1`,
      [codigo]
    );
    
    console.log(`✅ Retirada confirmada para código ${codigo}`);
    
    res.json({
      success: true,
      message: 'Retirada confirmada com sucesso!',
      produto: pedidoItem.produto_nome,
      pedidoId: pedidoId,
      slotId: slotId,
      dataRetirada: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro ao confirmar retirada:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao confirmar retirada' 
    });
  }
});

// ROTA GET — histórico de retiradas do usuário
app.get('/api/retirada/historico/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    console.log(`📋 Buscando histórico de retiradas do usuário ${usuarioId}`);
    
    const historicoResult = await pool.query(
      `SELECT 
         pi.codigo_retirada,
         pr.name as produto_nome,
         pr.image as produto_imagem,
         p.id as pedido_id,
         p.total as pedido_total,
         p.data_pedido,
         pi.data_retirada,
         pi.slot_retirada,
         pi.status_retirada
       FROM pedido_itens pi
       JOIN pedidos p ON pi.pedido_id = p.id
       JOIN produtos pr ON pi.produto_id = pr.id
       WHERE p.usuario_id = $1
       AND pi.status_retirada = 'retirado'
       ORDER BY pi.data_retirada DESC
       LIMIT 20`,
      [usuarioId]
    );
    
    res.json({
      success: true,
      historico: historicoResult.rows,
      total: historicoResult.rows.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar histórico de retiradas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao buscar histórico' 
    });
  }
});

// ROTA GET — status dos slots de retirada
app.get('/api/retirada/slots', async (req, res) => {
  try {
    console.log('📊 Buscando status dos slots de retirada');
    
    // Slots fixos conforme especificado
    const slotsFixos = [
      { id: 'A1', status: 'disponivel', produto: null },
      { id: 'A2', status: 'disponivel', produto: null },
      { id: 'A3', status: 'disponivel', produto: null },
      { id: 'A4', status: 'disponivel', produto: null },
      { id: 'B5', status: 'disponivel', produto: null },
      { id: 'B6', status: 'disponivel', produto: null },
      { id: 'B7', status: 'disponivel', produto: null },
      { id: 'B8', status: 'disponivel', produto: null },
      { id: 'C9', status: 'disponivel', produto: null },
      { id: 'C10', status: 'disponivel', produto: null },
      { id: 'C11', status: 'disponivel', produto: null },
      { id: 'C12', status: 'disponivel', produto: null }
    ];
    
    // Busca produtos ocupando slots no momento
    const slotsOcupadosResult = await pool.query(
      `SELECT 
         pi.slot_retirada,
         pr.name as produto_nome,
         pi.codigo_retirada
       FROM pedido_itens pi
       JOIN produtos pr ON pi.produto_id = pr.id
       WHERE pi.slot_retirada IS NOT NULL
       AND pi.status_retirada IS NULL
       AND pi.data_retirada IS NULL`
    );
    
    // Atualiza slots ocupados
    const slotsAtualizados = slotsFixos.map(slot => {
      const ocupado = slotsOcupadosResult.rows.find(s => s.slot_retirada === slot.id);
      if (ocupado) {
        return {
          ...slot,
          status: 'ocupado',
          produto: {
            nome: ocupado.produto_nome,
            codigoRetirada: ocupado.codigo_retirada
          }
        };
      }
      return slot;
    });
    
    res.json({
      success: true,
      slots: slotsAtualizados,
      totalSlots: slotsAtualizados.length,
      slotsDisponiveis: slotsAtualizados.filter(s => s.status === 'disponivel').length,
      slotsOcupados: slotsAtualizados.filter(s => s.status === 'ocupado').length
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar status dos slots:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao buscar status dos slots' 
    });
  }
});

// ROTA POST — atribuir produto a um slot
app.post('/api/retirada/atribuir-slot', async (req, res) => {
  try {
    const { codigo, slotId } = req.body;
    
    console.log(`🎯 Atribuindo código ${codigo} ao slot ${slotId}`);
    
    if (!codigo || !slotId) {
      return res.status(400).json({ 
        success: false,
        error: 'Código e slot são obrigatórios' 
      });
    }
    
    // Verifica se o slot está disponível
    const slotOcupadoResult = await pool.query(
      `SELECT 1 FROM pedido_itens WHERE slot_retirada = $1 AND status_retirada IS NULL`,
      [slotId]
    );
    
    if (slotOcupadoResult.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: `Slot ${slotId} já está ocupado` 
      });
    }
    
    // Atribui o slot ao produto
    const updateResult = await pool.query(
      `UPDATE pedido_itens 
       SET slot_retirada = $1
       WHERE codigo_retirada = $2
       AND status_retirada IS NULL
       RETURNING id`,
      [slotId, codigo]
    );
    
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Código não encontrado ou produto já retirado' 
      });
    }
    
    // Atualiza status do pedido para "pronto para retirada"
    const pedidoResult = await pool.query(
      `UPDATE pedidos p
       SET status = 'pronto para retirada',
           data_pronto = NOW()
       FROM pedido_itens pi
       WHERE p.id = pi.pedido_id
       AND pi.codigo_retirada = $1
       RETURNING p.id`,
      [codigo]
    );
    
    res.json({
      success: true,
      message: `Produto atribuído ao slot ${slotId} com sucesso!`,
      codigo: codigo,
      slotId: slotId,
      pedidoId: pedidoResult.rows[0]?.id || null
    });
    
  } catch (error) {
    console.error('❌ Erro ao atribuir slot:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao atribuir slot' 
    });
  }
});

// =========================================================
// 🔹 7. ROTAS PARA GERAR CÓDIGOS DE RETIRADA (ADMIN)
// =========================================================

// ROTA POST — gerar códigos para produtos existentes
app.post('/api/admin/gerar-codigos-retirada', async (req, res) => {
  try {
    console.log('🔑 Gerando códigos de retirada para produtos...');
    
    // Busca produtos sem código de retirada
    const produtosSemCodigoResult = await pool.query(
      `SELECT id, name FROM produtos WHERE codigo_retirada IS NULL`
    );
    
    let codigosGerados = 0;
    let erros = [];
    
    for (const produto of produtosSemCodigoResult.rows) {
      try {
        // Gera código único de 4 dígitos
        let codigo;
        let tentativas = 0;
        let codigoUnico = false;
        
        while (!codigoUnico && tentativas < 10) {
          codigo = Math.floor(1000 + Math.random() * 9000).toString();
          
          // Verifica se o código já existe
          const checkResult = await pool.query(
            'SELECT 1 FROM produtos WHERE codigo_retirada = $1',
            [codigo]
          );
          
          if (checkResult.rows.length === 0) {
            codigoUnico = true;
          }
          
          tentativas++;
        }
        
        if (!codigoUnico) {
          // Se não conseguir gerar único, usa timestamp
          codigo = Date.now().toString().slice(-4).padStart(4, '0');
        }
        
        // Atualiza o produto com o código
        await pool.query(
          'UPDATE produtos SET codigo_retirada = $1 WHERE id = $2',
          [codigo, produto.id]
        );
        
        codigosGerados++;
        console.log(`✅ Produto "${produto.name}" recebeu código: ${codigo}`);
        
      } catch (error) {
        erros.push({
          produto: produto.name,
          erro: error.message
        });
        console.error(`❌ Erro ao gerar código para ${produto.name}:`, error);
      }
    }
    
    res.json({
      success: true,
      message: `${codigosGerados} códigos gerados com sucesso`,
      totalProdutos: produtosSemCodigoResult.rows.length,
      codigosGerados: codigosGerados,
      erros: erros
    });
    
  } catch (error) {
    console.error('❌ Erro ao gerar códigos de retirada:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno ao gerar códigos' 
    });
  }
});

// =========================================================
// 🔹 8. ROTAS DE PEDIDOS
// =========================================================

// ROTA GET — lista todos os pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         p.*,
         u.nome as usuario_nome,
         u.email as usuario_email
       FROM pedidos p
       JOIN usuario u ON p.usuario_id = u.id
       ORDER BY p.data_pedido DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno no servidor ao listar pedidos.' });
  }
});

// ROTA GET — pedido por ID
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
         p.*,
         json_agg(
           json_build_object(
             'produto_id', pi.produto_id,
             'nome', pr.name,
             'quantidade', pi.quantidade,
             'preco_unitario', pi.preco_unitario,
             'codigo_retirada', pi.codigo_retirada,
             'imagem', pr.image,
             'total_item', (pi.quantidade * pi.preco_unitario)
           )
         ) as produtos
       FROM pedidos p
       JOIN pedido_itens pi ON p.id = pi.pedido_id
       JOIN produtos pr ON pi.produto_id = pr.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

// ROTA GET — histórico de pedidos do usuário
app.get('/api/pedidos/usuario/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    
    const result = await pool.query(
      `SELECT 
         p.id,
         p.total,
         p.status,
         p.data_pedido,
         json_agg(
           json_build_object(
             'produto_id', pi.produto_id,
             'nome', pr.name,
             'quantidade', pi.quantidade,
             'preco_unitario', pi.preco_unitario,
             'codigo_retirada', pi.codigo_retirada,
             'imagem', pr.image
           )
         ) as produtos
       FROM pedidos p
       JOIN pedido_itens pi ON p.id = pi.pedido_id
       JOIN produtos pr ON pi.produto_id = pr.id
       WHERE p.usuario_id = $1
       GROUP BY p.id, p.total, p.status, p.data_pedido
       ORDER BY p.data_pedido DESC`,
      [usuario_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// =========================================================
// 🔹 9. ROTAS DE RETIRADA (MANUTENÇÃO)
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
// 🔹 10. ROTAS ADICIONAIS
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
app.use( (req, res) => {
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
  console.log(`📦 Sistema de Retirada Self-Service: http://localhost:${PORT}/api/retirada/codigo/1234`);
  console.log(`🔑 Gerar códigos: http://localhost:${PORT}/api/admin/gerar-codigos-retirada`);
  console.log(`🛍️  Sistema de Produtos: http://localhost:${PORT}/api/produtos`);
  console.log(`📋 Sistema de Pedidos: http://localhost:${PORT}/api/pedidos`);
});

export default app;