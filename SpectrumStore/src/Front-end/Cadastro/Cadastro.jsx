import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../../Login/Firebase";
import "./Cadastro.css";

function Cadastro({ isOpen = false, onClose = () => {} }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

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
      onClose();
    } catch (err) {
      console.error("Erro ao logar com Google:", err);
      setErro("Erro ao autenticar com Google.");
    }
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
      <div className="cadastro-modal">
        <div className="cadastro-esquerda">
          <h1>Seja Bem Vindo!</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            Maecenes placerat ultricies libero eu pharetra. Vestibulum a
            ultrices augue.
          </p>
        </div>

        <div className="cadastro-direita">
          <h2>Cadastre-se</h2>

          <form onSubmit={handleSubmit} className="cadastro-form">
            <label>Seu Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <label>Sua Data de Nascimento:</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />

            <label>Sua Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <label>Confirme Sua Senha:</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />

            <div className="cadastro-termos">
              <input type="checkbox" required /> Li e Aceito os Termos de Uso
            </div>

            {erro && <p className="cadastro-erro">{erro}</p>}

            <button type="submit" className="cadastro-btn">
              Criar Conta
            </button>
          </form>

          <div className="cadastro-ou">Ou</div>

          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src="/GoogleCadastro.png" alt="Google" className="google-icon" />
            Entrar com Google
          </button>

          <p className="cadastro-footer">
            Já possui Cadastro? <a href="#">Faça Login Aqui</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
