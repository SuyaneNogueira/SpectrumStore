// services/UserService.js - VERSÃO COMPLETA E ATUALIZADA
const API_URL = "http://localhost:3001/api";

class UserService {
  /* ============================================================
     ===============   CRIAR USUÁRIO   ===========================
     ============================================================ */
  static async criarUsuario(userData) {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMsg = `Erro ${response.status}`;
        try {
          const err = await response.json();
          errorMsg = err.message || err.error || errorMsg;
        } catch (_) {
          errorMsg = await response.text();
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (err) {
      console.error("❌ Erro no criarUsuario:", err);
      throw err;
    }
  }

  /* ============================================================
     ==================   LOGIN   ================================
     ============================================================ */
  static async loginUsuario(credentials) {
    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || "Erro ao fazer login");
      }

      return await response.json();
    } catch (err) {
      console.error("❌ Erro no loginUsuario:", err);
      throw err;
    }
  }

  /* ============================================================
     =============   VERIFICAR EMAIL EXISTENTE   =================
     ============================================================ */
  static async verificarEmailExistente(email) {
    try {
      const response = await fetch(
        `${API_URL}/usuarios/verificar-email/${encodeURIComponent(email)}`
      );

      if (response.status === 404) {
        return { existe: false };
      }

      return await response.json();
    } catch (err) {
      console.warn("⚠ Erro verificar email:", err.message);
      return { existe: false, erro: err.message };
    }
  }

  /* ============================================================
     ===============   BUSCAR POR ID   ===========================
     ============================================================ */
  static async buscarUsuarioPorId(id) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`);

      if (!response.ok) throw new Error("Usuário não encontrado");

      return await response.json();
    } catch (err) {
      console.error("❌ Erro buscarUsuarioPorId:", err);
      throw err;
    }
  }

  /* ============================================================
     =================   ATUALIZAR USUÁRIO   =====================
     ============================================================ */
  static async atualizarUsuario(id, userData) {
    try {
      const token = localStorage.getItem("authToken") || "";
      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      };

      let response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        if (response.status === 404 || response.status === 405) {
          response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(userData),
          });
        }

        if (!response.ok) {
          const err = await response.json().catch(() => null);
          throw new Error(err?.message || "Erro ao atualizar usuário");
        }
      }

      return await response.json();
    } catch (err) {
      console.error("❌ Erro atualizarUsuario:", err);
      throw err;
    }
  }

  /* ============================================================
     ==================   DELETAR USUÁRIO   ======================
     ============================================================ */
  static async deletarUsuario(id) {
    try {
      const token = localStorage.getItem("authToken") || "";

      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || "Erro ao excluir usuário");
      }

      return await response.json();
    } catch (err) {
      console.error("❌ Erro deletarUsuario:", err);
      throw err;
    }
  }

  /* ============================================================
     ===================   UPLOAD DE FOTO   ======================
     ============================================================ */
  static async uploadFotoUsuario(id, file) {
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("foto", file);

      const response = await fetch(`${API_URL}/usuarios/${id}/foto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || "Erro ao enviar foto");
      }

      return await response.json();
    } catch (err) {
      console.error("❌ Erro uploadFotoUsuario:", err);
      throw err;
    }
  }

  static async uploadFoto(id, f) {
    return this.uploadFotoUsuario(id, f);
  }

  /* ============================================================
     ======================   TOKEN   =============================
     ============================================================ */
  static async verificarToken() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return { success: false };

      const response = await fetch(`${API_URL}/usuarios/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Token inválido");

      return await response.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /* ============================================================
     ==================   ATUALIZAR SENHA   ======================
     ============================================================ */
  static async atualizarSenha(id, senhaAtual, novaSenha) {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/usuarios/${id}/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      return await response.json();
    } catch (err) {
      console.error("❌ atualizarSenha:", err);
      throw err;
    }
  }

  /* ============================================================
     ==================   LISTAR USUÁRIOS   ======================
     ============================================================ */
  static async listarUsuarios() {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      return await response.json();
    } catch (err) {
      console.error("❌ listarUsuarios:", err);
      throw err;
    }
  }

  /* ============================================================
     ===========   SOLICITAR RECUPERAÇÃO DE SENHA   ==============
     ============================================================ */
  static async solicitarRecuperacaoSenha(email) {
    try {
      const response = await fetch(`${API_URL}/usuarios/recuperar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Erro ao enviar solicitação");

      return await response.json();
    } catch (err) {
      console.error("❌ solicitarRecuperacaoSenha:", err);
      throw err;
    }
  }

  /* ============================================================
     ===================   REDEFINIR SENHA   =====================
     ============================================================ */
  static async redefinirSenha(token, novaSenha) {
    try {
      const response = await fetch(`${API_URL}/usuarios/redefinir-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      return await response.json();
    } catch (err) {
      console.error("❌ redefinirSenha:", err);
      throw err;
    }
  }

  /* ============================================================
     ======================   HEALTH CHECK   =====================
     ============================================================ */
  static async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return await response.json();
    } catch (err) {
      console.error("❌ healthCheck:", err);
      return { success: false, message: err.message };
    }
  }

  /* ============================================================
     =====================   TESTAR CONEXÃO   ====================
     ============================================================ */
  static async testarConexao() {
    try {
      const t0 = performance.now();
      const response = await fetch(`${API_URL}/health`);
      const t1 = performance.now();

      if (!response.ok) throw new Error("Servidor offline");

      return {
        success: true,
        latency: t1 - t0,
        data: await response.json(),
      };
    } catch (err) {
      console.error("❌ testarConexao:", err);
      return { success: false, message: err.message };
    }
  }

  /* ============================================================
     ==================   DADOS DO LOGADO   ======================
     ============================================================ */
  static async getUsuarioLogado() {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) throw new Error("Nenhum usuário logado");

      const usuario = JSON.parse(userData);

      if (usuario.id) return this.buscarUsuarioPorId(usuario.id);

      return usuario;
    } catch (err) {
      console.error("❌ getUsuarioLogado:", err);
      throw err;
    }
  }

  /* ============================================================
     ========================   LOGOUT   =========================
     ============================================================ */
  static logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("favorites");

    return { success: true };
  }
}

export default UserService;
