import React, { useState } from "react";
import "./Login.css";
import { auth, provider, signInWithPopup } from "../Cadastro/Firebase";
import { useNavigate } from "react-router-dom";
import UserService from "../../Back-end/services/UserService"; // Importe o UserService

function Login({ onClose, onOpenCadastro }) {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!nome || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    try {
      console.log("Tentando login:", { nome, senha });
      
      // 🔐 Fazer login via API
      const resultado = await UserService.loginUsuario({
        email: nome, // ou nome, dependendo do seu backend
        senha: senha
      });

      if (resultado && resultado.token) {
        console.log("✅ Login efetuado com sucesso:", resultado);
        
        // 💾 Salvar dados no localStorage
        localStorage.setItem('authToken', resultado.token);
        localStorage.setItem('userData', JSON.stringify(resultado.usuario));
        
        // 🚀 Navegar para a tela inicial
        navigate("/TelaInicial");
        
        // ✅ Fechar o modal
        if (onClose) onClose();
      } else {
        setErro("Credenciais inválidas.");
      }

    } catch (error) {
      console.error("❌ Erro no login:", error);
      setErro(error.message || "Erro ao fazer login. Tente novamente.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);
      
      // 💾 Salvar dados do Google no localStorage
      const usuarioGoogle = {
        id: result.user.uid,
        nome: result.user.displayName,
        email: result.user.email,
        foto: result.user.photoURL
      };
      
      localStorage.setItem('authToken', result.user.accessToken);
      localStorage.setItem('userData', JSON.stringify(usuarioGoogle));
      
      // 🚀 Navegar para a tela inicial
      navigate("/TelaInicial");
      
      // ✅ Fechar o modal
      if (onClose) onClose();
      
    } catch (err) {
      console.error("Erro no login com Google:", err);
      setErro("Erro ao autenticar com Google");
    }
  };

  const handleOpenCadastro = () => {
    if (onOpenCadastro) {
      onOpenCadastro();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="login-page">
      <div className="login-modal">
        <button className="login-close" onClick={handleClose}>
          &times;
        </button>

        <h2>Login</h2>

        <form onSubmit={handleLogin} className="login-form">
          <label>Seu Email:</label>
          <input
            type="email"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu email"
          />

          <label>Sua Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
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
          <span onClick={handleOpenCadastro} className="cadastro-link">
            Faça seu Cadastro Aqui
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;