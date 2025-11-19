// hooks/useCadastro.js
import { useState } from 'react';
import UserService from '../services/UserService';

export const useCadastro = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cadastrarUsuario = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validações básicas
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

      // Verificar se email já existe
      try {
        const emailExiste = await UserService.verificarEmailExistente(userData.email);
        if (emailExiste.existe) {
          throw new Error('Este email já está cadastrado');
        }
      } catch (err) {
        console.log('⚠️ Verificação de email ignorada:', err.message);
      }

      // Formatar dados para envio
      const dadosParaEnvio = {
        nome: userData.nome.trim(),
        email: userData.email.trim().toLowerCase(),
        dataNascimento: userData.dataNascimento ? formatarData(userData.dataNascimento) : null,
        senha: userData.senha,
        termosAceitos: userData.termosAceitos,
        dataCadastro: new Date().toISOString(),
        ativo: true
      };

      console.log('📤 Enviando dados para cadastro:', dadosParaEnvio);

      // CADASTRO REAL
      const resultado = await UserService.criarUsuario(dadosParaEnvio);
      
      setSuccess(true);
      
      // Salvar token se retornado
      if (resultado.token) {
        localStorage.setItem('authToken', resultado.token);
        localStorage.setItem('userData', JSON.stringify(resultado.usuario));
      }

      return { success: true, data: resultado };

    } catch (err) {
      const errorMessage = err.message || 'Erro ao cadastrar usuário';
      setError(errorMessage);
      console.error('❌ Erro no cadastro:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE - Atualizar usuário
  const atualizarUsuario = async (id, userData) => {
    setLoading(true);
    setError(null);

    try {
      const dadosParaEnvio = {
        nome: userData.nome?.trim(),
        email: userData.email?.trim().toLowerCase(),
        dataNascimento: userData.dataNascimento ? formatarData(userData.dataNascimento) : null,
      };

      // Remove campos undefined
      Object.keys(dadosParaEnvio).forEach(key => 
        dadosParaEnvio[key] === undefined && delete dadosParaEnvio[key]
      );

      const resultado = await UserService.atualizarUsuario(id, dadosParaEnvio);
      setSuccess(true);
      return { success: true, data: resultado };

    } catch (err) {
      const errorMessage = err.message || 'Erro ao atualizar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Deletar usuário
  const deletarUsuario = async (id) => {
    setLoading(true);
    setError(null);

    try {
      await UserService.deletarUsuario(id);
      setSuccess(true);
      
      // Limpar localStorage se for o usuário atual
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.id === id) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }

      return { success: true };

    } catch (err) {
      const errorMessage = err.message || 'Erro ao deletar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // READ - Buscar usuário
  const buscarUsuario = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const usuario = await UserService.buscarUsuarioPorId(id);
      return { success: true, data: usuario };

    } catch (err) {
      const errorMessage = err.message || 'Erro ao buscar usuário';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const limparEstados = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    cadastrarUsuario,
    atualizarUsuario,
    deletarUsuario,
    buscarUsuario,
    limparEstados,
  };
};

// Função auxiliar para formatar data
const formatarData = (data) => {
  if (!data) return null;
  
  if (data.includes('/')) {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  
  return data;
};