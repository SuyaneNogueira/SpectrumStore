import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./Firebase"; 
import TermosDeUso from './TermosDeUso';
import "./Cadastro.css";

function Cadastro({ onClose, onOpenLogin, onOpenTermos }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [modalAberto, setModalAberto] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem!");
      return;
    }

    setErro("");
    console.log("Cadastro enviado:", { nome, dataNascimento, senha });
    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);
      window.location.href = "/TelaInicial";
      onClose();
    } catch (err) {
      const errorMessage = err.message.includes("auth/popup-closed-by-user")
        ? "Autenticação cancelada pelo usuário."
        : "Erro ao autenticar com Google";

      console.error("Erro ao logar com Google:", err);
      setErro(errorMessage);
    }
  };

     const abrirModalTermos = (e) => {
       e.stopPropagation(); 
       setModalAberto(true);
     };
    
     const fecharModalTermos = () => {
       setModalAberto(false);
     };
    
  return (
    <div
      className="cadastro-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.classList.contains("cadastro-overlay")) onClose();
      }}
    >
      <div className="cadastro-modal" onClick={(e) => e.stopPropagation()}>

        {/* COLUNA ESQUERDA */}
        <div className="cadastro-esquerda">
          <h1>Seja Bem-Vindo!</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            Maecenas placerat ultricies libero eu pharetra. Vestibulum a
            ultrices augue.
          </p>
        </div>

        {/* COLUNA DIREITA */}
        <div className="cadastro-direita">
          <button className="close-button" onClick={onClose}>&times;</button>

          <h2>Cadastre-se</h2>

          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="input-group">
              <label>Seu Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Sua Data de Nascimento:</label>
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Sua Senha:</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirme Sua Senha:</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>

            <div className="termos-container">
            <div className={`termo-circulo ${termosAceitos ? 'ativo' : ''}`} onClick={() => setTermosAceitos(!termosAceitos)} />
            <p>Li e aceito os 
              <span
                onClick={() => abrirModalTermos("TermosDeUso")}
                style={{ cursor: 'pointer' }}
              >
                Termos de Uso
              </span>
            </p>
          </div>

            {erro && <p className="cadastro-erro">{erro}</p>}

            <button type="submit" className="cadastro-btn">
              Criar Conta
            </button>
          </form>

          <div className="separator-container">
            <div className="vertical-line"></div>
            <div className="cadastro-ou">Ou</div>
            <div className="vertical-line"></div>
          </div>

          <div>
            <button className="google-btn" onClick={handleGoogleLogin}>
              <img src="/GoogleCadastro.png" alt="Google" className="google-icon" />
            </button>
          </div>

          <p className="cadastro-footer">
            Já possui Cadastro?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLogin(); }}>
              Faça Login Aqui
            </a>
          </p>
        </div>
        </div>
      {modalAberto && <TermosDeUso onClose={() => setModalAberto(false)} />}
        </div>
     

    
  );
}

export default Cadastro;
