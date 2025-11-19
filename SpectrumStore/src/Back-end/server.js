// =========================================================
// 🔹 ROTAS DE CADASTRO E USUÁRIOS (NOVAS)
// =========================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock de banco de dados temporário (substitua por suas queries do PostgreSQL)
let usuarios = [];
let nextId = 1;

// CREATE - Cadastrar usuário
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email, dataNascimento, senha, termosAceitos } = req.body;

    console.log('📥 Dados recebidos para cadastro:', { nome, email, dataNascimento, termosAceitos });

    // Validações
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

    // Verificar se email já existe (usando PostgreSQL)
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Este email já está cadastrado' 
      });
    }

    // Criptografar senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Criar usuário no PostgreSQL
    const query = `
      INSERT INTO usuarios (nome, email, data_nascimento, senha, termos_aceitos, ativo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nome, email, data_nascimento, termos_aceitos, data_cadastro, ativo
    `;
    
    const values = [
      nome.trim(),
      email.toLowerCase().trim(),
      dataNascimento || null,
      senhaHash,
      termosAceitos || false,
      true
    ];

    const result = await pool.query(query, values);
    const novoUsuario = result.rows[0];

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: novoUsuario.id, 
        email: novoUsuario.email 
      },
      process.env.JWT_SECRET || 'secret-key-spectrum-store',
      { expiresIn: '24h' }
    );

    console.log('✅ Usuário criado com sucesso:', novoUsuario.email);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      usuario: novoUsuario,
      token
    });

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// LOGIN - Autenticar usuário
app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário no PostgreSQL
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const usuario = result.rows[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        userId: usuario.id, 
        email: usuario.email 
      },
      process.env.JWT_SECRET || 'secret-key-spectrum-store',
      { expiresIn: '24h' }
    );

    // Remover senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario;

    console.log('✅ Login realizado:', usuario.email);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      usuario: usuarioSemSenha,
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

// VERIFICAR EMAIL - Verificar se email já existe
app.get('/api/usuarios/verificar-email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const result = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1 AND ativo = true',
      [email.toLowerCase()]
    );

    res.json({
      success: true,
      existe: result.rows.length > 0
    });

  } catch (error) {
    console.error('❌ Erro ao verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET - Buscar usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, nome, email, data_nascimento, termos_aceitos, data_cadastro, ativo FROM usuarios WHERE id = $1 AND ativo = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// UPDATE - Atualizar usuário
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, dataNascimento, senha } = req.body;

    // Verificar se usuário existe
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE id = $1 AND ativo = true',
      [id]
    );

    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se novo email já existe (se foi alterado)
    if (email) {
      const emailExistente = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1 AND id != $2 AND ativo = true',
        [email.toLowerCase(), id]
      );

      if (emailExistente.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
    }

    // Construir query dinamicamente
    let query = 'UPDATE usuarios SET ';
    const values = [];
    let paramCount = 1;
    const updates = [];

    if (nome) {
      updates.push(`nome = $${paramCount}`);
      values.push(nome.trim());
      paramCount++;
    }

    if (email) {
      updates.push(`email = $${paramCount}`);
      values.push(email.toLowerCase().trim());
      paramCount++;
    }

    if (dataNascimento) {
      updates.push(`data_nascimento = $${paramCount}`);
      values.push(dataNascimento);
      paramCount++;
    }

    if (senha) {
      if (senha.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);
      updates.push(`senha = $${paramCount}`);
      values.push(senhaHash);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum dado para atualizar'
      });
    }

    updates.push(`data_atualizacao = NOW()`);
    query += updates.join(', ') + ` WHERE id = $${paramCount} RETURNING id, nome, email, data_nascimento, data_cadastro, ativo`;
    values.push(id);

    const result = await pool.query(query, values);
    const usuarioAtualizado = result.rows[0];

    console.log('✅ Usuário atualizado:', usuarioAtualizado.email);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      usuario: usuarioAtualizado
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE - Deletar usuário (soft delete)
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE usuarios SET ativo = false, data_exclusao = NOW() WHERE id = $1 AND ativo = true RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    console.log('✅ Usuário deletado:', id);

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// HEALTH CHECK específico para usuários
app.get('/api/usuarios/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de usuários está funcionando',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/usuarios': 'Cadastrar usuário',
      'POST /api/usuarios/login': 'Login',
      'GET /api/usuarios/verificar-email/:email': 'Verificar email',
      'GET /api/usuarios/:id': 'Buscar usuário',
      'PUT /api/usuarios/:id': 'Atualizar usuário',
      'DELETE /api/usuarios/:id': 'Deletar usuário'
    }
  });
});