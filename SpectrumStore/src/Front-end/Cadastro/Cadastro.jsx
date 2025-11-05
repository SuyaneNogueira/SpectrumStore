// src/Front-end/Cadastro/Cadastro.jsx
import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./Firebase"; 
import TermosDeUso from "./TermosDeUso";
import "./Cadastro.css";

function Cadastro({ onClose, onOpenLogin }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  // Envio de cadastro
  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem!");
      return;
    }

    if (!termosAceitos) {
      setErro("Você deve aceitar os Termos de Uso para continuar.");
      return;
    }

    setErro("");
    console.log("Cadastro enviado:", { nome, dataNascimento, senha });
    if (typeof onClose === "function") onClose();
  };

  // Login Google
  const handleGoogleLogin = async () => {
    try {
      // signInWithPopup deve ser exportado pelo seu Firebase.js (conforme combinado)
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);
      // redirecionamento depois do login
      window.location.href = "/TelaInicial";
      if (typeof onClose === "function") onClose();
    } catch (err) {
      // proteção caso err seja indefinido
      const message = err && err.message ? err.message : "";
      const errorMessage = message.includes("auth/popup-closed-by-user")
        ? "Autenticação cancelada pelo usuário."
        : "Erro ao autenticar com Google";
      console.error("Erro ao logar com Google:", err);
      setErro(errorMessage);
    }
  };

  // Abre modal de termos
  const abrirModalTermos = (e) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    setModalAberto(true);
  };

  // Fecha modal de termos
  const fecharModalTermos = () => {
    setModalAberto(false);
  };

  // Abre modal Login de forma segura (fechando este modal antes)
  const abrirLoginAPartirCadastro = (e) => {
    e && e.preventDefault();
    // fecha o cadastro primeiro
    if (typeof onClose === "function") onClose();
    // só chama onOpenLogin se foi passado
    if (typeof onOpenLogin === "function") {
      onOpenLogin();
    } else {
      console.warn("onOpenLogin não foi passado como prop para <Cadastro />.");
    }
  };

  return (
    <>
      <div
        className="cadastro-overlay"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target.classList.contains("cadastro-overlay") && typeof onClose === "function") onClose();
        }}
      >
        <div className="cadastro-modal" onClick={(e) => e.stopPropagation()}>
          {/* COLUNA ESQUERDA */}
          <div className="cadastro-esquerda">
            <h1>Seja Bem-Vindo!</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Maecenas placerat ultricies libero eu pharetra. Vestibulum a
              ultrices augue.
            </p>
          </div>

          {/* COLUNA DIREITA */}
          <div className="cadastro-direita">
            <button className="close-button" onClick={() => typeof onClose === "function" && onClose()}>
              &times;
            </button>

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

              {/* TERMOS */}
              <div className="termos-container">
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={termosAceitos}
                  className={`termo-circulo ${termosAceitos ? "ativo" : ""}`}
                  onClick={() => setTermosAceitos(!termosAceitos)}
                  onKeyDown={(ev) => { if(ev.key === 'Enter' || ev.key === ' ') setTermosAceitos(!termosAceitos); }}
                />
                <p className="container-text">
                  Li e aceito os{" "}
                  <span
                    onClick={abrirModalTermos}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "var(--color-primary)"
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(ev) => { if(ev.key === 'Enter') abrirModalTermos(ev); }}
                  >
                    Termos de Uso
                  </span>
                </p>
              </div>

              {erro && <p className="cadastro-erro" role="alert">{erro}</p>}

              <button type="submit" className="cadastro-btn">
                Criar Conta
              </button>
            </form>

            <div className="separator-container">
              <div className="vertical-line" />
              <div className="cadastro-ou">Ou</div>
              <div className="vertical-line" />
            </div>

            <div>
              <button className="google-btn" onClick={handleGoogleLogin} type="button">
                <img src="/GoogleCadastro.png" alt="Google" className="google-icon" />
              </button>
            </div>

            <p className="cadastro-footer">
              Já possui Cadastro?{" "}
              <a
                href="Login"
                onClick={abrirLoginAPartirCadastro}
                style={{ cursor: "pointer" }}
              >
                Faça Login Aqui
              </a>
            </p>
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
