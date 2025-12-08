// hooks/useCadastro.js - VERSÃO ATUALIZADA
import { useState } from 'react';
import UserService from '../services/UserService';

export const useCadastro = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Função para verificar saúde do servidor
  const verificarServidor = async () => {
    console.log('🔍 Verificando conexão com o servidor...');
    
    try {
      const health = await UserService.healthCheck();
      
      if (!health.success) {
        console.log('⚠️ Health check falhou, mas continuando...');
        return true;
      }
      
      console.log('✅ Servidor está respondendo');
      return true;
      
    } catch (error) {
      console.log('⚠️ Erro no health check, mas continuando...', error.message);
      return true;
    }
  };

  const cadastrarUsuario = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('🎯 Iniciando processo de cadastro...');

      // Verificação opcional do servidor
      await verificarServidor();

      // Validações básicas do frontend
      if (!userData.nome || !userData.email || !userData.senha) {
        throw new Error('Nome, email e senha são obrigatórios');
      }

      if (userData.senha.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      if (userData.senha !== userData.confirmarSenha) {
        throw new Error('As senhas não conferem');
      }

      if (!userData.termosAceitos) {
        throw new Error('Você deve aceitar os Termos de Uso');
      }

      // Formatar dados para envio (COM FOTO)
      const dadosParaEnvio = {
        nome: userData.nome.trim(),
        email: userData.email.trim().toLowerCase(),
        dataNascimento: userData.dataNascimento || null,
        senha: userData.senha,
        termosAceitos: userData.termosAceitos,
        foto_url: userData.foto_url || null
      };

      console.log('📤 Enviando dados para cadastro:', dadosParaEnvio);

      // CADASTRO REAL
      const resultado = await UserService.criarUsuario(dadosParaEnvio);
      
      console.log('✅ Cadastro realizado com sucesso:', resultado);
      setSuccess(true);
      
      // Salvar token e dados do usuário
      if (resultado.token && resultado.usuario) {
        localStorage.setItem('authToken', resultado.token);
        localStorage.setItem('userData', JSON.stringify(resultado.usuario));
      }

      return { success: true, data: resultado };

    } catch (err) {
      const errorMessage = err.message || 'Erro ao cadastrar usuário';
      console.error('❌ Erro no cadastro:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    cadastrarUsuario,
  };
};