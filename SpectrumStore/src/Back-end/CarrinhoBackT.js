// CarrinhoBackT.js
import { pool } from './db.js';  // Importando o pool de conexões com o PostgreSQL

// Definindo todas as rotas no arquivo CarrinhoBackT.js
export const defineRoutes = (app) => {
  // ROTA POST /pedido — cria um pedido no banco
  app.post('/pedido', async (req, res) => {
    const { usuario_id, data_pedido, total, forma_pagamento, status } = req.body;

    if (!usuario_id || !data_pedido || !total || !forma_pagamento || !status) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    try {
      const query = `
        INSERT INTO pedidos (usuario_id, data_pedido, total, forma_pagamento, status)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const values = [usuario_id, data_pedido, total, forma_pagamento, status];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  });

  // ROTA GET /pedidos — lista todos os pedidos
  app.get('/pedidos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  });

  // ROTA POST /api/cadastro-usuario — cria um novo usuário
  app.post('/api/cadastro-usuario', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    try {
      const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email';
      const values = [nome, email, senha];

      const result = await pool.query(query, values);
      res.status(201).json({ message: 'Usuário criado', usuario: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') { // email duplicado
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  // ROTA GET /api/lista-usuario — lista todos os usuários
  app.get('/api/lista-usuario', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, nome, email, criado_em FROM usuarios ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  // ROTA GET /api/lista-produto — lista todos os produtos
  app.get('/api/lista-produto', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM produtos ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  // ROTA POST /api/cadastro-produto — cadastra um novo produto
  app.post('/api/cadastro-produto', async (req, res) => {
    const { name, price, description, category, image } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    try {
      const query = `
        INSERT INTO produtos (name, price, description, category, image)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const values = [name, price, description, category, image || null];
      const result = await pool.query(query, values);
      res.status(201).json({ message: 'Produto criado', produto: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  });

  // ROTA POST /api/criar-pedido — cria um novo pedido
  app.post('/api/criar-pedido', async (req, res) => {
    const { usuario_id, data_pedido, total, forma_pagamento, status } = req.body;

    if (!usuario_id || !data_pedido || !total || !forma_pagamento || !status) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    try {
      const query = `
        INSERT INTO pedidos (usuario_id, data_pedido, total, forma_pagamento, status)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const values = [usuario_id, data_pedido, total, forma_pagamento, status];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  });

  // ROTA GET /api/lista-pedido — lista todos os pedidos
  app.get('/api/lista-pedido', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pedidos ORDER BY data_pedido DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  });
};
