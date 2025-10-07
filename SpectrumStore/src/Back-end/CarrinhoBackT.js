import { pool } from './db.js';

/**
 * Define todas as rotas da API para pedidos, usuários e produtos.
 * @param {import('express').Application} app Instância do Express.
 */
export const defineRoutes = (app) => {

    // ==========================================================
    // ROTAS DE PEDIDO
    // ==========================================================

    // ROTA POST /api/pedido — cria um novo pedido (espera 5 campos)
    app.post('/api/pedido', async (req, res) => {
        const { usuario_id, data_pedido, total, forma_pagamento, status } = req.body;
        
        // ** (RECOMENDAÇÃO: Adicionar a conversão para número aqui, como sugerido antes) **
        const totalNumerico = parseFloat(total); 

        // Validação estrita para evitar o erro 400 Bad Request
        if (!usuario_id || !data_pedido || isNaN(totalNumerico) || !forma_pagamento || !status) {
            console.warn('Tentativa de criar pedido com dados incompletos:', req.body);
            return res.status(400).json({ error: 'Dados incompletos: usuario_id, data_pedido, total, forma_pagamento e status são obrigatórios.' });
        }

        try {
            const query = `
                INSERT INTO pedido (usuario_id, data_pedido, total, forma_pagamento, status) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            // IMPORTANTE: O campo 'total' deve ser enviado como um número (ou string formatada para número)
            const values = [usuario_id, data_pedido, totalNumerico, forma_pagamento, status];
            const result = await pool.query(query, values);
            
            // Retorna 201 Created
            res.status(201).json({ 
                message: 'Pedido criado com sucesso', 
                pedido: result.rows[0]
            });

        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            // Retorna 500 Internal Server Error
            res.status(500).json({ error: 'Erro interno ao processar o pedido. Por favor, tente novamente.' });
        }
    });


    // ROTA GET /api/pedido — lista todos os pedidos
    app.get('/api/pedido', async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM pedido ORDER BY data_pedido DESC');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            res.status(500).json({ error: 'Erro interno no servidor ao listar pedidos.' });
        }
    });

    // ==========================================================
    // ROTAS DE USUÁRIO
    // ==========================================================

    // ROTA POST /api/usuarios — cria um novo usuário
    app.post('/api/usuarios', async (req, res) => {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Preencha todos os campos: nome, email e senha são obrigatórios.' });
        }

        try {
            const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email';
            const values = [nome, email, senha];

            const result = await pool.query(query, values);
            res.status(201).json({ message: 'Usuário criado com sucesso', usuario: result.rows[0] });
        } catch (error) {
            if (error.code === '23505') { // Código de erro do PostgreSQL para violação de unique constraint (email duplicado)
                return res.status(400).json({ error: 'Email já cadastrado. Por favor, use outro email.' });
            }
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro no servidor ao cadastrar usuário.' });
        }
    });
    // app.delete();

    // ROTA GET /api/usuarios — lista todos os usuários
    app.get('/api/usuarios', async (req, res) => {
        try {
            const result = await pool.query('SELECT id, nome, email, criado_em FROM usuarios ORDER BY id');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({ error: 'Erro no servidor ao listar usuários.' });
        }
    });

    // ==========================================================
    // ROTAS DE PRODUTO
    // ==========================================================

    // ROTA POST /api/produtos — cadastra um novo produto
    app.post('/api/produtos', async (req, res) => {
        const { name, price, description, category, image } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({ error: 'Preencha todos os campos: name, price, description e category são obrigatórios.' });
        }

        try {
            const query = `
                INSERT INTO produtos (name, price, description, category, image)
                VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            const values = [name, price, description, category, image || null];
            const result = await pool.query(query, values);
            res.status(201).json({ message: 'Produto criado com sucesso', produto: result.rows[0] });
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            res.status(500).json({ error: 'Erro no servidor ao cadastrar produto.' });
        }
    });

    // ROTA GET /api/produtos — lista todos os produtos
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