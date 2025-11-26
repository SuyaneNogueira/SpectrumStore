import React, { useState } from "react";
import "./ExcluirPerfil.css";
import UserService from "../../../Back-end/services/UserService";

function ExcluirPerfil({ onClose, onExcluir }) {
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setConfirmacao(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verificar se a confirmação está correta
      if (confirmacao.toLowerCase() !== "excluir minha conta") {
        throw new Error('Por favor, digite "excluir minha conta" para confirmar');
      }

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

      console.log("🗑️ Solicitando exclusão do usuário:", userId);

      // Fazer requisição para excluir o usuário - CORREÇÃO AQUI
      const resultado = await UserService.deletarUsuario(userId);

      if (resultado) {
        console.log("✅ Perfil excluído com sucesso");
        
        // Limpar dados do localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('favorites');
        
        // Chamar callback do componente pai se existir
        if (onExcluir) {
          onExcluir();
        }
        
        // Redirecionar para a página inicial
        window.location.href = "/";
      } else {
        throw new Error("Erro ao excluir perfil");
      }

    } catch (err) {
      console.error("❌ Erro ao excluir perfil:", err);
      setError(err.message || "Erro ao excluir perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="excluir-modal-overlay">
      <div className="excluir-modal-conteudo">
        <button className="excluir-modal-fechar" onClick={onClose}>✕</button>
        <h2 className="excluir-modal-titulo">Excluir Perfil</h2>

        <form onSubmit={handleSubmit} className="excluir-conteudo">
          {/* Mensagem de aviso */}
          <div className="excluir-mensagem-aviso">
            <h3>⚠️ Atenção: Esta ação é irreversível!</h3>
            <p>Ao excluir sua conta:</p>
            <ul>
              <li>Seus dados pessoais serão permanentemente removidos</li>
              <li>Seu histórico e atividades serão perdidos</li>
              <li>Esta ação não pode ser desfeita</li>
            </ul>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="excluir-mensagem-erro">
              {error}
            </div>
          )}

          {/* Campo de confirmação */}
          <div className="excluir-form-group">
            <label htmlFor="confirmacao">
              <strong>Para confirmar, digite: <span style={{color: '#d63031'}}>"excluir minha conta"</span></strong>
            </label>
            <input 
              type="text" 
              id="confirmacao"
              name="confirmacao"
              value={confirmacao}
              onChange={handleInputChange}
              placeholder="Digite 'excluir minha conta'"
              required
              disabled={loading}
            />
          </div>

          {/* Footer com botões */}
          <div className="excluir-footer">
            <div className="excluir-botoes-container">
              <button 
                type="submit" 
                className="excluir-botao-excluir"
                disabled={loading || confirmacao.toLowerCase() !== "excluir minha conta"}
              >
                {loading ? "Excluindo..." : "Excluir Minha Conta"}
              </button>
              
              <button 
                type="button" 
                className="excluir-botao-cancelar"
                onClick={onClose}
                disabled={loading}
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

export default ExcluirPerfil;