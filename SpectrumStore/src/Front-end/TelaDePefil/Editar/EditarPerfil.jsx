import React, { useState, useEffect } from "react";
import "./EditarPerfil.css";
import UserService from "../../../Back-end/services/UserService";

function EditarPerfil({ onClose, usuario, onSalvar }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    dataNascimento: "",
    senha: "",
    confirmarSenha: ""
  });
  const [fotoPreview, setFotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fotoLoading, setFotoLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Função para obter URL segura da foto
  const getFotoUsuario = (foto) => {
    if (!foto || foto === "" || foto === "null" || foto.includes('via.placeholder.com')) {
      return "/usuario-padrao.png";
    }
    return foto;
  };

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (usuario) {
      // Formatar data para o input type="date" (AAAA-MM-DD)
      let dataFormatada = "";
      if (usuario.dataNascimento) {
        if (usuario.dataNascimento.includes('/')) {
          const [dia, mes, ano] = usuario.dataNascimento.split('/');
          dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        } else {
          dataFormatada = usuario.dataNascimento;
        }
      }

      setFormData({
        nome: usuario.nome || "",
        email: usuario.email || "",
        dataNascimento: dataFormatada,
        senha: "",
        confirmarSenha: ""
      });

      // ✅ Carregar foto do usuário com fallback seguro
      setFotoPreview(getFotoUsuario(usuario.fotoUrl || usuario.foto));
    }
  }, [usuario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📸 Foto selecionada:", file.name);
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione uma imagem válida (JPG, PNG, GIF)");
        return;
      }

      // Validar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter menos de 5MB");
        return;
      }

      setFotoLoading(true);
      setError("");

      try {
        // ✅ 1. Criar preview temporário
        const imageUrl = URL.createObjectURL(file);
        setFotoPreview(imageUrl);

        console.log("✅ Preview da foto criado");

        // ✅ 2. Fazer upload REAL da foto para o backend
        const userData = localStorage.getItem('userData');
        if (userData) {
          const usuarioLogado = JSON.parse(userData);
          const userId = usuarioLogado.id;

          if (userId) {
            console.log("📤 Fazendo upload da foto para o servidor...");
            
            // 🔄 Fazer upload para o backend
            const resultadoUpload = await UserService.uploadFotoUsuario(userId, file);
            
            if (resultadoUpload && resultadoUpload.fotoUrl) {
              console.log("✅ Foto salva no servidor:", resultadoUpload.fotoUrl);
              
              // ✅ Atualizar localStorage com a nova URL da foto
              const usuarioAtualizado = {
                ...usuarioLogado,
                fotoUrl: resultadoUpload.fotoUrl,
                foto: resultadoUpload.fotoUrl
              };
              
              localStorage.setItem('userData', JSON.stringify(usuarioAtualizado));
              setFotoPreview(resultadoUpload.fotoUrl); // ✅ Usar URL permanente do servidor
              
              // ✅ Atualizar componente pai
              if (onSalvar) {
                onSalvar(usuarioAtualizado);
              }
              
              setSuccess("Foto atualizada com sucesso!");
            } else {
              throw new Error("Não foi possível obter a URL da foto do servidor");
            }
          }
        }

      } catch (err) {
        console.error("❌ Erro ao fazer upload da foto:", err);
        
        // Mensagem de erro mais amigável
        let mensagemErro = "Erro ao salvar a foto. Tente novamente.";
        if (err.message.includes("404")) {
          mensagemErro = "Serviço de upload não disponível. Tente mais tarde.";
        } else if (err.message.includes("413")) {
          mensagemErro = "Arquivo muito grande. Use uma imagem menor.";
        } else if (err.message.includes("network") || err.message.includes("Failed to fetch")) {
          mensagemErro = "Erro de conexão. Verifique sua internet.";
        }
        
        setError(mensagemErro);
        
        // ❌ Se der erro, reverter para foto anterior
        const userData = localStorage.getItem('userData');
        if (userData) {
          const usuarioLogado = JSON.parse(userData);
          setFotoPreview(getFotoUsuario(usuarioLogado.fotoUrl || usuarioLogado.foto));
        }
      } finally {
        setFotoLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validações
      if (!formData.nome.trim()) {
        throw new Error("Nome é obrigatório");
      }

      if (!formData.email.trim()) {
        throw new Error("Email é obrigatório");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Email inválido");
      }

      if (formData.senha) {
        if (formData.senha.length < 6) {
          throw new Error("A senha deve ter pelo menos 6 caracteres");
        }

        if (formData.senha !== formData.confirmarSenha) {
          throw new Error("As senhas não conferem");
        }
      }

      // Preparar dados para envio (SEM FOTO - a foto já foi enviada separadamente)
      const dadosAtualizacao = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        dataNascimento: formData.dataNascimento
      };

      // Incluir senha apenas se foi alterada
      if (formData.senha) {
        dadosAtualizacao.senha = formData.senha;
      }

      console.log("📤 Enviando dados para atualização:", dadosAtualizacao);

      // Obter ID do usuário do localStorage
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error("Usuário não autenticado");
      }

      const usuarioLogado = JSON.parse(userData);
      const userId = usuarioLogado.id;

      if (!userId) {
        throw new Error("ID do usuário não encontrado");
      }

      // Fazer requisição para atualizar (apenas dados, sem foto)
      const resultado = await UserService.atualizarUsuario(userId, dadosAtualizacao);

      if (resultado.success) {
        setSuccess("Perfil atualizado com sucesso!");
        
        // ✅ Atualizar dados no localStorage
        const usuarioAtualizado = {
          ...usuarioLogado,
          nome: dadosAtualizacao.nome,
          email: dadosAtualizacao.email,
          dataNascimento: dadosAtualizacao.dataNascimento,
          // Mantém a foto existente (já foi atualizada separadamente)
          fotoUrl: usuarioLogado.fotoUrl,
          foto: usuarioLogado.fotoUrl
        };
        
        localStorage.setItem('userData', JSON.stringify(usuarioAtualizado));
        
        if (onSalvar) {
          onSalvar(usuarioAtualizado);
        }

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(resultado.message || "Erro ao atualizar perfil");
      }

    } catch (err) {
      console.error("❌ Erro ao atualizar perfil:", err);
      
      // Mensagem de erro mais amigável
      let mensagemErro = err.message || "Erro ao atualizar perfil. Tente novamente.";
      if (err.message.includes("413")) {
        mensagemErro = "Dados muito grandes. Tente com uma imagem menor ou sem foto.";
      } else if (err.message.includes("network") || err.message.includes("Failed to fetch")) {
        mensagemErro = "Erro de conexão. Verifique sua internet.";
      }
      
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editar-modal-overlay">
      <div className="editar-modal-conteudo">
        <button 
          className="editar-modal-fechar" 
          onClick={onClose}
          disabled={loading || fotoLoading}
        >
          ✕
        </button>
        <h2 className="editar-modal-titulo">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="editar-conteudo">
          {error && (
            <div className="editar-mensagem-erro">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="editar-mensagem-sucesso">
              ✅ {success}
            </div>
          )}

          <div className="editar-conteudo-superior">
            {/* Foto de perfil */}
            <div className="editar-foto-container">
              <div className="editar-foto">
                <img 
                  src={fotoPreview} 
                  alt="Foto do perfil" 
                  onError={(e) => {
                    // ✅ Fallback seguro se a imagem não carregar
                    e.target.src = "/usuario-padrao.png";
                  }}
                />
                {fotoLoading && (
                  <div className="foto-loading-overlay">
                    <div className="foto-loading-spinner"></div>
                    <span>Enviando...</span>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                id="foto-input"
                accept="image/*"
                onChange={handleFotoChange}
                style={{ display: 'none' }}
                disabled={fotoLoading || loading}
              />
              <label 
                htmlFor="foto-input" 
                className="editar-botao-alterar-foto"
                style={{ 
                  opacity: (fotoLoading || loading) ? 0.6 : 1,
                  cursor: (fotoLoading || loading) ? 'not-allowed' : 'pointer'
                }}
              >
                {fotoLoading ? "Enviando..." : "Alterar Foto"}
              </label>
              
              <small style={{ color: '#666', fontSize: '12px', textAlign: 'center', lineHeight: '1.4' }}>
                Formatos: JPG, PNG, GIF
                <br />
                Tamanho máximo: 5MB
              </small>
            </div>

            {/* Campos de edição */}
            <div className="editar-form">
              <div className="editar-form-group">
                <label htmlFor="nome"><strong>Nome:</strong></label>
                <input 
                  type="text" 
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite seu nome completo"
                  disabled={loading}
                />
              </div>

              <div className="editar-form-group">
                <label htmlFor="email"><strong>Email:</strong></label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>

              <div className="editar-form-group">
                <label htmlFor="dataNascimento"><strong>Data de Nascimento:</strong></label>
                <input 
                  type="date" 
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="editar-form-group">
                <label htmlFor="senha"><strong>Nova Senha (opcional):</strong></label>
                <input 
                  type="password" 
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  minLength="6"
                  disabled={loading}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Deixe em branco para manter a senha atual
                </small>
              </div>

              {formData.senha && (
                <div className="editar-form-group">
                  <label htmlFor="confirmarSenha"><strong>Confirmar Nova Senha:</strong></label>
                  <input 
                    type="password" 
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    placeholder="Digite a senha novamente"
                    minLength="6"
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="editar-footer">
            <div className="editar-botoes-container">
              <button 
                type="submit" 
                className="editar-botao-salvar"
                disabled={loading || fotoLoading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </button>
              
              <button 
                type="button" 
                className="editar-botao-cancelar"
                onClick={onClose}
                disabled={loading || fotoLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfil;