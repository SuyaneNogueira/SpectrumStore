// services/UserService.js
const API_BASE_URL = 'http://localhost:3030/api'; // Use a porta 3030 do seu backend

class UserService {
  // CREATE - Cadastrar novo usuário
  async criarUsuario(usuarioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro no UserService - criarUsuario:', error);
      throw error;
    }
  }

  // LOGIN - Fazer login
  async loginUsuario(credenciais) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciais),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      return data;
    } catch (error) {
      console.error('Erro no UserService - loginUsuario:', error);
      throw error;
    }
  }

  // VERIFICAR EMAIL
  async verificarEmailExistente(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/verificar-email/${email}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao verificar email');
      }

      return data;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return { existe: false };
    }
  }

  // Buscar usuário por ID
  async buscarUsuarioPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar usuário');
      }

      return data.usuario;
    } catch (error) {
      console.error('Erro no UserService - buscarUsuarioPorId:', error);
      throw error;
    }
  }

  // UPDATE - Atualizar usuário
  async atualizarUsuario(id, usuarioData) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro no UserService - atualizarUsuario:', error);
      throw error;
    }
  }

  // DELETE - Deletar usuário
  async deletarUsuario(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao deletar usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro no UserService - deletarUsuario:', error);
      throw error;
    }
  }
}

export default new UserService();