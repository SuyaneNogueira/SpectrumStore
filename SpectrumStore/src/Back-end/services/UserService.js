// services/UserService.js - VERSÃO COMPLETA E CORRIGIDA
const API_URL = 'http://localhost:3001/api';

class UserService {
  // CADASTRO DE USUÁRIO - CORRIGIDO
  static async criarUsuario(userData) {
    try {
      console.log('📤 Enviando requisição para:', `${API_URL}/usuarios`);
      console.log('📝 Dados enviados:', userData);

      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📨 Status da resposta:', response.status);
      
      // VERIFICA SE HOUVE ERRO NA RESPOSTA
      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        
        try {
          // Tenta obter detalhes do erro do servidor
          const errorData = await response.json();
          console.log('📄 Detalhes do erro do servidor:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Se não conseguir parsear como JSON, tenta como texto
          try {
            const errorText = await response.text();
            console.log('📄 Erro (texto):', errorText);
            if (errorText) {
              errorMessage = errorText;
            }
          } catch (textError) {
            console.log('❌ Não foi possível ler o corpo do erro');
          }
        }
        
        throw new Error(errorMessage);
      }

      // SE CHEGOU AQUI, DEU CERTO!
      const data = await response.json();
      console.log('✅ Resposta do servidor (sucesso):', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - criarUsuario:', error);
      throw error; // Repassa o erro para quem chamou
    }
  }

  // HEALTH CHECK - Mantém igual
  static async healthCheck() {
    try {
      console.log('🏥 Verificando saúde do servidor...');
      
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check falhou: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Health check OK:', data);
      return { success: true, data };

    } catch (error) {
      console.log('⚠️ Health check falhou:', error.message);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // LOGIN (se precisar)
  static async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no login');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  }

  // BUSCAR USUÁRIO POR ID
  static async buscarUsuarioPorId(id) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`);
      
      if (!response.ok) {
        throw new Error('Usuário não encontrado');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // ATUALIZAR USUÁRIO
  static async atualizarUsuario(id, userData) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  }
}

export default UserService;