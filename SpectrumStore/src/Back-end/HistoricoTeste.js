import { pool } from './db.js';

// @param {import('express').Application} app

{import('express').Application} app

export const defineRoutes = (app) => {

 // ROTA GET — lista todos os pedidos
app.get('/api/pedido', async (req, res) => {
try {
            const result = await pool.query('SELECT * FROM pedido ORDER BY data_pedido DESC');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            res.status(500).json({ error: 'Erro interno no servidor ao listar pedidos.' });
        }

    
});
 // ROTA GET — lista todos os produtos
  app.get('/api/produtos', async (req, res) => {
   try {
            const result = await pool.query('SELECT * FROM produtos ORDER BY id');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            res.status(500).json({ error: 'Erro no servidor ao listar produtos.' });
        }

  });

};