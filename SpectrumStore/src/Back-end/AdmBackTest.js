// routes.js
import { pool } from './db.js';

/**
 * Define todas as rotas da API.
 * @param {import('express').Application} app Instância do Express.
 */
export const defineRoutes = (app) => {

  // ==========================================================
  // ROTAS DE PEDIDO
  // ==========================================================

  app.post('/api/pedido', async (req, res) => {
    const { usuario_id, total, forma_pagamento, status } = req.body;

    if (!usuario_id || !total || !forma_pagamento || !status) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
      const query = `
        INSERT INTO pedido (usuario_id, total, forma_pagamento, status)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const result = await pool.query(query, [usuario_id, total, forma_pagamento, status]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
  });

  app.get('/api/pedido', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM pedido ORDER BY data_pedido DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
  });

  // ==========================================================
  // ROTAS DE PRODUTOS
  // ==========================================================

  app.post('/api/produtos', async (req, res) => {
    const { name, price, description, category, image } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    try {
      const query = `
        INSERT INTO produtos (name, price, description, category, image)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [name, price, description, category, image || null];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }
  });

  app.get('/api/produtos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM produtos ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos.' });
    }
  });
};
