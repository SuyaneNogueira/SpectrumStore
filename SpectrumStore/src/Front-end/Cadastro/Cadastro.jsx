import React, { useState } from "react";
// import { auth, provider } from "../../Login/Firebase"; 
// import { signInWithPopup } from 'firebase/auth'; // Importe signInWithPopup diretamente do módulo 'firebase/auth'
import "./Cadastro.css";

function Cadastro({ onClose }) {
  // Use state para os inputs
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  // Funções de Submissão e Login
  
  // Função para lidar com o Cadastro padrão (Email/Senha)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem!");
      return;
    }
    // TODO: Adicionar lógica real de cadastro com Email/Senha no Firebase aqui.
    setErro("");
    console.log("Cadastro enviado:", { nome, dataNascimento, senha });

    // Fecha o modal após o processamento (simulado)
    onClose();
  };

  // Função para lidar com o Login via Google
  const handleGoogleLogin = async () => {
    try {
      // Verifica se as importações auth e provider estão disponíveis
      if (!auth || !provider) {
        throw new Error("Configuração do Firebase (auth ou provider) não encontrada.");
      }
      
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);
      
      // TODO: Adicionar lógica para salvar dados adicionais do Google (nome, etc) no seu banco de dados, se necessário.

      onClose();
    } catch (err) {
      // Exibe o erro de forma mais amigável
      const errorMessage = err.message.includes('auth/popup-closed-by-user')
        ? "Autenticação cancelada pelo usuário."
        : "Erro ao autenticar com Google. Verifique a chave do Firebase.";
        
      console.error("Erro ao logar com Google:", err);
      setErro(errorMessage);
    }
  };

  return (
    // CAMADA 1: Overlay (Fundo escuro que fecha ao clicar fora)
    <div
      className="cadastro-overlay"
      role="dialog"
      aria-modal="true"
      // Garante que o clique fora do modal (apenas no overlay) feche-o
      onClick={(e) => {
        if (e.target.classList.contains("cadastro-overlay")) onClose();
      }}
    >
      {/* CAMADA 2: Modal principal (Layout em duas colunas) */}
      <div className="cadastro-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* COLUNA ESQUERDA: Boas-vindas (Quase transparente com blur) */}
        <div className="cadastro-esquerda">
          <h1>Seja Bem Vindo!</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            Maecenes placerat ultricies libero eu pharetra. Vestibulum a
            ultrices augue.
          </p>
        </div>

        {/* COLUNA DIREITA: Formulário */}
        <div className="cadastro-direita">
          {/* Botão de Fechar */}
          <button className="close-button" onClick={onClose}>&times;</button>
          
          <h2>Cadastre-se</h2>

          <form onSubmit={handleSubmit} className="cadastro-form">
            
            {/* Input: Seu Nome: */}
            <div className="input-group">
                <label>Seu Nome:</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>

            {/* Input: Sua Data de Nascimento: */}
            <div className="input-group">
                <label>Sua Data de Nascimento:</label>
                {/* O placeholder "DD/MM/AAAA" da imagem */}
                <input type="text" placeholder="DD/MM/AAAA" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
            </div>

            {/* Input: Sua Senha: */}
            <div className="input-group">
                <label>Sua Senha:</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>

            {/* Input: Confirme Sua Senha: */}
            <div className="input-group">
                <label>Confirme Sua Senha:</label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
            </div>
            
            {/* Termos de Uso (Nota: Usamos <input type="radio"> para replicar o círculo da imagem) */}
            <div className="cadastro-termos">
                <input type="radio" id="termos" name="termos" required /> 
                <label htmlFor="termos">Li e Aceito os Termos de Uso</label>
            </div>
            
            {erro && <p className="cadastro-erro">{erro}</p>}
            
            <button type="submit" className="cadastro-btn">
                Criar Conta
            </button>
          </form>

            <div className="separator-container">
                <div className="vertical-line"></div> 
                <div className="google-section">
                    <div className="cadastro-ou">Ou</div>
                    <button className="google-btn" onClick={handleGoogleLogin}>
                        <img src="/GoogleCadastro.png" alt="Google" className="google-icon" />
                    </button>
                </div>
                <div className="vertical-line"></div> 
            </div>

            {/* Footer de Login */}
            <p className="cadastro-footer">
                Já possui Cadastro? <a href="#" onClick={onClose}>Faça Login Aqui</a>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;