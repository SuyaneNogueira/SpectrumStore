import { pool } from "./db.js";
import bcrypt from 'bcrypt';

/**
 * Define todas as rotas da API para pedidos, usuários e produtos.
 * @param {import('express').Application} app Instância do Express.
 */
export const defineRoutes = (app) => {
  // ==========================================================
  // ROTAS DE PEDIDO
  // ==========================================================

  // ROTA POST /api/pedido — cria um novo pedido (espera 4 campos, sem data_pedido)
  app.post("/api/pedido", async (req, res) => {
    const { usuario_id, total, forma_pagamento, status } = req.body;

    // Converte total para número
    const totalNumerico = parseFloat(total);

    // Validação estrita para evitar erro 400 Bad Request
    if (!usuario_id || isNaN(totalNumerico) || !forma_pagamento || !status) {
      console.warn(
        "Tentativa de criar pedido com dados incompletos:",
        req.body
      );
      return res.status(400).json({
        error:
          "Dados incompletos: usuario_id, total, forma_pagamento e status são obrigatórios.",
      });
    }

    try {
      const query = `
 INSERT INTO pedidos (usuario_id, total, forma_pagamento, status) 
 VALUES ($1, $2, $3, $4) RETURNING *;
 `;
      const values = [usuario_id, totalNumerico, forma_pagamento, status];
      const result = await pool.query(query, values);

      // Retorna 201 Created
      res.status(201).json({
        message: "Pedido criado com sucesso",
        pedido: result.rows[0],
      });
    } catch (erro) {
      console.error("❌ Erro ao enviar pedido:", erro);
      res.status(500).json({
        error: "Erro no servidor ao criar pedido.",
        detalhes: erro.message,
      });
    }
  });

  // ROTA GET /api/pedido — lista todos os pedidos
  app.get('/api/pedido', async (req, res) => {
 try {
 const result = await pool.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
   res.json(result.rows);
      res.json(result.rows);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      res
        .status(500)
        .json({ error: "Erro interno no servidor ao listar pedidos." });
    }
  });

  // ==========================================================
  // ROTAS DE USUÁRIO
  // ==========================================================

  app.post("/api/usuarios", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error:
          "Preencha todos os campos: nome, email e senha são obrigatórios.",
      });
    }

    try {
      const query =
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email";
      const values = [nome, email, senha];

      const result = await pool.query(query, values);
      res.status(201).json({
        message: "Usuário criado com sucesso",
        usuario: result.rows[0],
      });
    } catch (error) {
      if (error.code === "23505") {
        return res
          .status(400)
          .json({ error: "Email já cadastrado. Por favor, use outro email." });
      }
      console.error("Erro ao cadastrar usuário:", error);
      res.status(500).json({ error: "Erro no servidor ao cadastrar usuário." });
    }
  });


  app.get("/api/usuarios", async (req, res) => {
  try {
   const result = await pool.query(
        // 👇 "CURA" 3: Adicionei o 'role' para o Admin ver quem é quem 👇
    "SELECT id, nome, email, role, criado_em FROM usuarios ORDER BY id" 
   );
   res.json(result.rows);
  } catch (error) {
   console.error("Erro ao listar usuários:", error);
   res.status(500).json({ error: "Erro no servidor ao listar usuários." });
  }
});

///
//  ROTA USUARIO ADMIN
///
// =========================================================
// 👇👇👇 "CURA" 2: A "Porta dos Fundos" (Cadastro de ADMINS) 👇👇👇
// =========================================================
// ROTA POST /api/admin/criar-usuario — cria um novo usuário (ADMIN)
app.post("/api/cadastro/admin", async (req, res) => {
  const { nome, email, senha, codigoMestre } = req.body; 
    
    // (O "Segurança" da Porta dos Fundos)
    const SENHA_MESTRA_DO_PROJETO = "SPECTRUM_ADMIN_2025"; 
    if (codigoMestre !== SENHA_MESTRA_DO_PROJETO) {
        return res.status(403).json({ error: 'Código Mestre inválido!' });
    }

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  try {
        // (Salva a senha pura na tabela de admins)
   const query = "INSERT INTO usuarios_admins (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email";
   const values = [nome, email, senha]; 

   const result = await pool.query(query, values);
   res.status(201).json({ message: "Usuário ADMIN criado com sucesso", usuario: result.rows[0] });

  } catch (error) {
   if (error.code === "23505") { return res.status(400).json({ error: "Email já cadastrado." }); }
   console.error("Erro ao cadastrar admin:", error);
   res.status(500).json({ error: "Erro no servidor." });
  }
});

/// metodo get admin

app.get('/api/admin/listar-admins', async (req, res) => {
  console.log("[API Admin] Recebida requisição para listar APENAS admins...");
  
  try {
    const query = "SELECT id, nome, email, data_cadastro FROM usuarios_admins ORDER BY nome ASC";
    const result = await pool.query(query);
    res.json(result.rows);

  } catch (err) {
    console.error("❌ Erro ao listar admins:", err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});
// 
// Login Unificado
// =========================================================
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    // 1. O "Segurança" procura na Lista de Admins
    let result = await pool.query("SELECT * FROM usuarios_admins WHERE email = $1", [email]);

    if (result.rowCount > 0) {
      const admin = result.rows[0];
            // 👇 (Verifica a senha pura, ex: "admin123" === "admin123")
      if (senha === admin.senha) { 
        console.log(`[API] Login de ADMIN: ${admin.email}`);
        return res.json({
          message: "Login Admin bem-sucedido!",
          usuario: { id: admin.id, nome: admin.nome, email: admin.email, role: "admin" } // <-- Avisa o React que é "admin"
        });
      }
    }

    // 2. Se não achou Admin, procura na Lista de Clientes
    result = await pool.query("SELECT * FROM usuarios_clientes WHERE email = $1", [email]);

    if (result.rowCount > 0) {
      const cliente = result.rows[0];
            // 👇 (Verifica a senha pura, ex: "senha123" === "senha123")
      if (senha === cliente.senha) {
        console.log(`[API] Login de CLIENTE: ${cliente.email}`);
        return res.json({
          message: "Login Cliente bem-sucedido!",
          usuario: { id: cliente.id, nome: cliente.nome, email: cliente.email, role: "cliente" } // <-- Avisa o React que é "cliente"
        });
      }
    }

    // 3. Se não achou em nenhuma lista (ou a senha estava errada)
    console.warn(`[API] Tentativa de login falhou (Credenciais inválidas): ${email}`);
    return res.status(401).json({ error: "Credenciais inválidas." });

  } catch (err) {
    console.error("Erro fatal no /api/login:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

  // ==========================================================
  // ROTAS DE PRODUTO
  // ==========================================================

  // ROTA POST /api/produtos — cadastra um novo produto
  app.post("/api/produtos", async (req, res) => {
    const { name, price, description, category, image } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({
        error:
          "Preencha todos os campos: name, price, description e category são obrigatórios.",
      });
    }

    try {
      const query = `
                INSERT INTO produtos (name, price, description, category, image)
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
      const values = [name, price, description, category, image || null];
      const result = await pool.query(query, values);
      res.status(201).json({
        message: "Produto criado com sucesso",
        produto: result.rows[0],
      });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      res.status(500).json({ error: "Erro no servidor ao cadastrar produto." });
    }
  });

  // ROTA GET /api/produtos — lista todos os produtos
  app.get("/api/produtos", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM produtos ORDER BY id");
      res.json(result.rows);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      res.status(500).json({ error: "Erro no servidor ao listar produtos." });
    }
  });
};
