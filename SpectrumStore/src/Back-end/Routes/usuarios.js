// backend/routes/usuarios.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock de banco de dados (substitua por seu banco real)
let usuarios = [];
let nextId = 1;

// Middleware para log de requests
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CREATE - Cadastrar usuário
router.post('/', async (req, res) => {
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

    // Verificar se email já existe
    const usuarioExistente = usuarios.find(u => u.email === email && u.ativo);
    if (usuarioExistente) {
      return res.status(400).json({ 
        success: false,
        message: 'Este email já está cadastrado' 
      });
    }

    // Criptografar senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Criar usuário
    const novoUsuario = {
      id: nextId.toString(),
      nome,
      email: email.toLowerCase(),
      dataNascimento,
      senha: senhaHash,
      termosAceitos: termosAceitos || false,
      dataCadastro: new Date().toISOString(),
      ativo: true
    };

    usuarios.push(novoUsuario);
    nextId++;

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: novoUsuario.id, 
        email: novoUsuario.email 
      },
      process.env.JWT_SECRET || 'secret-key-desenvolvimento',
      { expiresIn: '24h' }
    );

    // Retornar dados (sem a senha)
    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    console.log('✅ Usuário criado com sucesso:', usuarioSemSenha.email);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      usuario: usuarioSemSenha,
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

// READ - Buscar usuário por ID
router.get('/:id', (req, res) => {
  try {
    const usuario = usuarios.find(u => u.id === req.params.id && u.ativo);
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    const { senha, ...usuarioSemSenha } = usuario;
    
    res.json({
      success: true,
      usuario: usuarioSemSenha
    });

  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// READ - Buscar usuário por email
router.get('/email/:email', (req, res) => {
  try {
    const usuario = usuarios.find(u => 
      u.email === req.params.email.toLowerCase() && u.ativo
    );
    
    if (!usuario) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    const { senha, ...usuarioSemSenha } = usuario;
    
    res.json({
      success: true,
      usuario: usuarioSemSenha
    });

  } catch (error) {
    console.error('❌ Erro ao buscar usuário por email:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// UPDATE - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const usuarioIndex = usuarios.findIndex(u => u.id === req.params.id && u.ativo);
    
    if (usuarioIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    const { nome, email, dataNascimento, senha } = req.body;

    // Verificar se novo email já existe (se foi alterado)
    if (email && email !== usuarios[usuarioIndex].email) {
      const emailExistente = usuarios.find(u => u.email === email.toLowerCase() && u.ativo);
      if (emailExistente) {
        return res.status(400).json({ 
          success: false,
          message: 'Email já está em uso' 
        });
      }
    }

    // Atualizar dados
    if (nome) usuarios[usuarioIndex].nome = nome;
    if (email) usuarios[usuarioIndex].email = email.toLowerCase();
    if (dataNascimento) usuarios[usuarioIndex].dataNascimento = dataNascimento;
    
    // Se forneceu nova senha, criptografar
    if (senha) {
      if (senha.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }
      const saltRounds = 10;
      usuarios[usuarioIndex].senha = await bcrypt.hash(senha, saltRounds);
    }

    usuarios[usuarioIndex].dataAtualizacao = new Date().toISOString();

    const { senha: _, ...usuarioAtualizado } = usuarios[usuarioIndex];

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
router.delete('/:id', (req, res) => {
  try {
    const usuarioIndex = usuarios.findIndex(u => u.id === req.params.id && u.ativo);
    
    if (usuarioIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado' 
      });
    }

    // Soft delete - marca como inativo
    usuarios[usuarioIndex].ativo = false;
    usuarios[usuarioIndex].dataExclusao = new Date().toISOString();

    console.log('✅ Usuário deletado:', usuarios[usuarioIndex].email);

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

// LIST ALL - Listar todos os usuários
router.get('/', (req, res) => {
  try {
    const usuariosSemSenha = usuarios
      .filter(u => u.ativo)
      .map(({ senha, ...usuario }) => usuario);
    
    res.json({
      success: true,
      usuarios: usuariosSemSenha,
      total: usuariosSemSenha.length
    });

  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// LOGIN - Autenticar usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const usuario = usuarios.find(u => 
      u.email === email.toLowerCase() && u.ativo
    );

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

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
      process.env.JWT_SECRET || 'secret-key-desenvolvimento',
      { expiresIn: '24h' }
    );

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

// HEALTH CHECK
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de usuários está funcionando',
    timestamp: new Date().toISOString(),
    totalUsuarios: usuarios.filter(u => u.ativo).length
  });
});

module.exports = router;