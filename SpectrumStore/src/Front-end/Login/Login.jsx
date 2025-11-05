import React, { useState } from "react";
import "./Login.css";
import { auth, provider, signInWithPopup } from "../Cadastro/Firebase";

function Login({ onClose, onOpenCadastro }) {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!nome || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    console.log("Login efetuado:", { nome, senha });
    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);
      window.location.href = "/TelaInicial";
    } catch (err) {
      setErro("Erro ao autenticar com Google");
    }
  };

  return (
    <div
      className="login-overlay"
      onClick={(e) => {
        if (e.target.classList.contains("login-overlay")) onClose();
      }}
    >
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose}>
          &times;
        </button>

        <h2>Login</h2>

        <form onSubmit={handleLogin} className="login-form">
          <label>Seu Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Sua Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            type="button"
            className="google-login"
            onClick={handleGoogleLogin}
          >
            <img src="/GoogleCadastro.png" alt="Google" />
            Continue com o Google
          </button>

          {erro && <p className="login-erro">{erro}</p>}

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>

        <p className="login-footer">
          Ainda não possui uma conta?{" "}
          <span onClick={onOpenCadastro}>Faça seu Cadastro Aqui</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
