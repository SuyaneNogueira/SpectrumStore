import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./Firebase";
import TermosDeUso from "./TermosDeUso";
import { useCadastro } from "../../Back-end/Hooks/UseCadastro";
import "./Cadastro.css";
import { useNavigate } from "react-router-dom";

function Cadastro({ onClose, onOpenLogin }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [email, setEmail] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const { loading, error, cadastrarUsuario } = useCadastro();
   const navigate = useNavigate();

  // Envio de cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica no frontend
    if (!termosAceitos) {
      alert("Você deve aceitar os Termos de Uso para continuar.");
      return;
    }

    const userData = {
      nome,
      email,
      dataNascimento,
      senha,
      confirmarSenha,
      termosAceitos
    };

    const resultado = await cadastrarUsuario(userData);

    if (resultado.success) {
      console.log("✅ Cadastro realizado com sucesso:", resultado.data);
      
    if (typeof onClose === "function") onClose();
      
      // Redireciona após um pequeno delay
      setTimeout(() => {
        navigate("/TelaInicial");
      }, 500);
    } else {
      console.error("❌ Erro no cadastro:", resultado.error);
    }
  };

  // Login Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);
      
      window.location.href = "/TelaInicial";
      if (typeof onClose === "function") onClose();
    } catch (err) {
      const message = err?.message || "";
      const errorMessage = message.includes("auth/popup-closed-by-user")
        ? "Autenticação cancelada pelo usuário."
        : "Erro ao autenticar com Google";
      console.error("Erro ao logar com Google:", err);
      alert(errorMessage);
    }
  };

  // Abre modal de termos
  const abrirModalTermos = (e) => {
    e.stopPropagation(); 
    setModalAberto(true);
  };

  const fecharModalTermos = () => {
    setModalAberto(false);
  };

  // Abre login
  const abrirLoginAPartirCadastro = (e) => {
    e?.preventDefault();
    if (typeof onClose === "function") onClose();
    if (typeof onOpenLogin === "function") onOpenLogin();
  };

  return (
    <>
      <div
        className="cadastro-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (
            e.target.classList.contains("cadastro-overlay") &&
            typeof onClose === "function"
          )
            onClose();
        }}
      >
        <div className="cadastro-modal" onClick={(e) => e.stopPropagation()}>
          {/* ESQUERDA */}
          <div className="cadastro-esquerda">
            <h1>Seja Bem-Vindo!</h1>
            <p>
              Nosso espaço foi criado com base em ciência, empatia e inclusão, 
              para promover bem-estar e autonomia a todas as pessoas no espectro.
            </p>
          </div>

          {/* DIREITA */}
          <div className="cadastro-direita">
            <form onSubmit={handleSubmit} className="cadastro-form">
              <button className="close-button" onClick={onClose} type="button">
                &times;
              </button>

              <h2>Cadastro</h2>

              <div className="input-group">
                <label>Seu Nome:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="input-group">
                <label>Seu Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="input-group">
                <label>Sua Data de Nascimento:</label>
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label>Sua Senha:</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="input-group">
                <label>Confirmar Senha:</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  placeholder="Digite a senha novamente"
                />
              </div>

              {/* TERMOS */}
              <div className="termos-container">
                <div 
                  className={`termo-circulo ${termosAceitos ? 'ativo' : ''}`} 
                  onClick={() => !loading && setTermosAceitos(!termosAceitos)} 
                />
                <p>Li e aceito os
                  <span 
                    className="termos-link"
                    onClick={abrirModalTermos} 
                  >
                    Termos de Uso
                  </span>
                </p>
              </div>

              {error && (
                <p className="cadastro-erro" role="alert">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                className="cadastro-btn"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Criar Conta"}
              </button>

              <p className="cadastro-footer">
                Já possui Cadastro?{" "}
                <a href="#login" onClick={abrirLoginAPartirCadastro}>
                  Faça Login Aqui
                </a>
              </p>
            </form>

            <div className="separator-container">
              <div className="vertical-line" />
              <div className="cadastro-ou">Ou</div>
              <div className="vertical-line" />
            </div>

            <div className="div-google-bnt">
              <button
                className="google-btn"
                onClick={handleGoogleLogin}
                type="button"
                disabled={loading}
              >
                <img
                  src="/GoogleCadastro.png"
                  alt="Google"
                  className="google-icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL TERMOS */}
      {modalAberto && (
        <div className="modal-termos-overlay" onClick={fecharModalTermos}>
          <div onClick={(e) => e.stopPropagation()}>
            <TermosDeUso onClose={fecharModalTermos} />
          </div>
        </div>
      )}
    </>
  );
}

export default Cadastro;