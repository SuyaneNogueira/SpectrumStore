// services/UserService.js
const API_BASE_URL = 'http://localhost:3001/api';

class UserService {
  // CREATE - Cadastrar novo usuário
  async criarUsuario(usuarioData) {
    try {
      console.log('📤 Enviando requisição para:', `${API_BASE_URL}/usuarios`);
      console.log('📝 Dados:', usuarioData);

      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      console.log('📨 Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Resposta do servidor:', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - criarUsuario:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Servidor indisponível. Verifique se o backend está rodando na porta 3030.');
      }
      
      throw error;
    }
  }

  // VERIFICAR EMAIL - Compatível com seu backend
  async verificarEmailExistente(email) {
    try {
      console.log('🔍 Verificando email:', email);
      
      const response = await fetch(`${API_BASE_URL}/usuarios/verificar-email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📨 Status da verificação:', response.status);

      // Se o endpoint não existir (404), retornar que o email não existe
      if (response.status === 404) {
        console.log('⚠️ Endpoint de verificação não encontrado, continuando...');
        return { existe: false };
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📧 Resultado da verificação:', data);
      return data;

    } catch (error) {
      console.warn('⚠️ Erro ao verificar email:', error.message);
      // Em caso de erro, retornar que o email não existe para não bloquear o cadastro
      return { existe: false, error: error.message };
    }
  }

  // LOGIN - Fazer login
  async loginUsuario(credenciais) {
    try {
      console.log('🔐 Tentando login para:', credenciais.email);
      
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciais),
      });

      console.log('📨 Status do login:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Login realizado com sucesso');
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - loginUsuario:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  async buscarUsuarioPorId(id) {
    try {
      console.log('🔍 Buscando usuário ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
      
      console.log('📨 Status da busca:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Usuário encontrado:', data.usuario);
      return data.usuario;

    } catch (error) {
      console.error('❌ Erro no UserService - buscarUsuarioPorId:', error);
      throw error;
    }
  }

  // UPDATE - Atualizar usuário (CORRIGIDO)
  async atualizarUsuario(id, usuarioData) {
    try {
      const token = localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📤 Enviando atualização para:', `${API_BASE_URL}/usuarios/${id}`);
      console.log('📝 Dados:', usuarioData);

      // Função para ler resposta sem erro de "body stream already read"
      const lerResposta = async (response) => {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          return { message: text };
        }
      };

      // Tenta PUT primeiro
      let response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(usuarioData),
      });

      console.log('📨 Status da resposta PUT:', response.status);

      let data;
      if (!response.ok) {
        // Se PUT falhar, tenta PATCH
        if (response.status === 404 || response.status === 405) {
          console.log('🔄 Tentando PATCH...');
          response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(usuarioData),
          });
          console.log('📨 Status da resposta PATCH:', response.status);
        }

        if (!response.ok) {
          data = await lerResposta(response);
          let errorMessage = data.message || `Erro ${response.status}: ${response.statusText}`;
          
          if (response.status === 404) {
            errorMessage = 'Usuário não encontrado. Verifique se o ID está correto.';
          } else if (response.status === 400) {
            errorMessage = 'Dados inválidos. Verifique as informações enviadas.';
          } else if (response.status === 401) {
            errorMessage = 'Não autorizado. Faça login novamente.';
          } else if (response.status === 500) {
            errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          }
          
          throw new Error(errorMessage);
        }
      }

      data = await lerResposta(response);
      console.log('✅ Resposta do servidor:', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - atualizarUsuario:', error);
      
      // Tratamento adicional para erros de rede
      if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e se o servidor está rodando.');
      }
      
      throw error;
    }
  }

  // DELETE - Deletar usuário
  async deletarUsuario(id) {
    try {
      const token = localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('🗑️ Deletando usuário ID:', id);
      
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      console.log('📨 Status do delete:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Usuário deletado com sucesso');
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - deletarUsuario:', error);
      throw error;
    }
  }

  // UPLOAD DE FOTO DE PERFIL - Nova função específica
  async uploadFotoUsuario(userId, file) {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('foto', file);

      console.log('📤 Enviando foto para:', `${API_BASE_URL}/usuarios/${userId}/foto`);
      console.log('📸 Arquivo:', file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)}MB`);

      const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/foto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      console.log('📨 Status do upload:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Erro ${response.status} ao fazer upload da foto`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        // Tratamento específico para erros comuns
        if (response.status === 413) {
          errorMessage = 'Arquivo muito grande. Tente uma imagem menor.';
        } else if (response.status === 415) {
          errorMessage = 'Tipo de arquivo não suportado. Use JPG, PNG ou GIF.';
        } else if (response.status === 401) {
          errorMessage = 'Não autorizado. Faça login novamente.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Foto enviada com sucesso:', data);
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - uploadFotoUsuario:', error);
      
      // Tratamento adicional para erros de rede
      if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        throw new Error('Não foi possível conectar ao servidor para enviar a foto.');
      }
      
      throw error;
    }
  }

  // ALIAS para compatibilidade - mantém a função antiga também
  async uploadFoto(id, file) {
    return await this.uploadFotoUsuario(id, file);
  }

  // HEALTH CHECK - Verificar se o servidor está respondendo
  async healthCheck() {
    try {
      console.log('🏥 Verificando saúde do servidor...');
      
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`Servidor retornou status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Health check OK:', data);
      return { success: true, data };

    } catch (error) {
      console.error('❌ Health check falhou:', error.message);
      return { 
        success: false, 
        error: error.message,
        details: 'Servidor não está respondendo. Verifique se está rodando na porta 3030.'
      };
    }
  }

  // VERIFICAR TOKEN - Validar token JWT
  async verificarToken() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return { success: false, message: 'Token não encontrado' };
      }

      const response = await fetch(`${API_BASE_URL}/usuarios/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const data = await response.json();
      return { success: true, user: data.user };

    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      return { success: false, message: error.message };
    }
  }

  // ATUALIZAR SENHA - Método específico para troca de senha
  async atualizarSenha(id, senhaAtual, novaSenha) {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}/senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAtual,
          novaSenha
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - atualizarSenha:', error);
      throw error;
    }
  }

  // LISTAR USUÁRIOS - (Apenas para admin)
  async listarUsuarios() {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - listarUsuarios:', error);
      throw error;
    }
  }

  // RECUPERAR SENHA - Solicitar recuperação de senha
  async solicitarRecuperacaoSenha(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/recuperar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - solicitarRecuperacaoSenha:', error);
      throw error;
    }
  }

  // REDEFINIR SENHA - Redefinir senha com token
  async redefinirSenha(token, novaSenha) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/redefinir-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, novaSenha }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('❌ Erro no UserService - redefinirSenha:', error);
      throw error;
    }
  }

  // VERIFICAR CONEXÃO - Teste simples de conexão
  async testarConexao() {
    try {
      const startTime = Date.now();
      const response = await fetch(`${API_BASE_URL}/health`);
      const endTime = Date.now();
      
      const latency = endTime - startTime;
      
      if (!response.ok) {
        throw new Error(`Servidor retornou status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        latency: latency,
        message: `Conexão estabelecida com sucesso (${latency}ms)`
      };

    } catch (error) {
      console.error('❌ Teste de conexão falhou:', error);
      return {
        success: false,
        error: error.message,
        message: 'Falha na conexão com o servidor'
      };
    }
  }

  // OBTER DADOS DO USUÁRIO LOGADO - Convenience method
  async getUsuarioLogado() {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('Nenhum usuário logado');
      }

      const usuario = JSON.parse(userData);
      
      // Se necessário, buscar dados atualizados do servidor
      if (usuario.id) {
        const usuarioAtualizado = await this.buscarUsuarioPorId(usuario.id);
        return usuarioAtualizado;
      }
      
      return usuario;

    } catch (error) {
      console.error('❌ Erro ao obter usuário logado:', error);
      throw error;
    }
  }

  // LOGOUT - Limpar dados locais
  logout() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('favorites');
      
      console.log('✅ Logout realizado com sucesso');
      return { success: true, message: 'Logout realizado' };

    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      return { success: false, message: error.message };
    }
  }
}

// Exportar uma instância única do serviço
export default new UserService();