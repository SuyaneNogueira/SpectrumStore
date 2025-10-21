import React, { useState } from "react";
// import { auth, provider } from "../../Login/Firebase"; 
// import { signInWithPopup } from 'firebase/auth'; // 
import "./Cadastro.css";

function Cadastro({ onClose }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

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
      if (!auth || !provider) {
        throw new Error("Configuração do Firebase (auth ou provider) não encontrada.");
      }
      
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);

      onClose();
    } catch (err) {
      const errorMessage = err.message.includes('auth/popup-closed-by-user')
        ? "Autenticação cancelada pelo usuário."
        : "Erro ao autenticar com Google. Verifique a chave do Firebase.";
        
      console.error("Erro ao logar com Google:", err);
      setErro(errorMessage);
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
      <div className="cadastro-modal" onClick={(e) => e.stopPropagation()}>
   
   {/* COLUNA ESQUERDA: Boas-vindas */}
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
     <button className="close-button" onClick={onClose}>&times;</button>
     
     <h2>Cadastre-se</h2>

     <form onSubmit={handleSubmit} className="cadastro-form">
       
       <div className="input-group">
           <label>Seu Nome:</label>
           <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
       </div>

       <div className="input-group">
           <label>Sua Data de Nascimento:</label>
           <input type="text" placeholder="DD/MM/AAAA" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
       </div>

       <div className="input-group">
           <label>Sua Senha:</label>
           <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
       </div>

       <div className="input-group">
           <label>Confirme Sua Senha:</label>
           <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
       </div>

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
            <div className="cadastro-ou">Ou</div>
           <div className="google-interaction">                                    
           </div>
           
           <div className="vertical-line"></div> 
       </div>
       <div>
           <button className="google-btn" onClick={handleGoogleLogin}>
               <img src="/GoogleCadastro.png" alt="Google" className="google-icon" />
           </button>
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