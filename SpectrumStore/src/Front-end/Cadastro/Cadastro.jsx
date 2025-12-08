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
  const [endereco, setEndereco] = useState(""); // (Opcional: Campo Novo)
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const { loading, error, cadastrarUsuario } = useCadastro();
  const navigate = useNavigate();

  // Envio de cadastro
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      endereco, // Enviando o endereço (se tiver campo no form)
      termosAceitos
    };

    const resultado = await cadastrarUsuario(userData);

    if (resultado.success) {
      console.log("✅ Cadastro realizado com sucesso:", resultado.data);
      
      // 👇👇👇 A CURA: SALVA O CRACHÁ NO NAVEGADOR 👇👇👇
      // Assim o usuário já sai logado e pode comprar direto!
      if (resultado.data && resultado.data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(resultado.data.usuario));
      }
      
      alert(`Bem-vindo(a), ${nome}! Cadastro realizado com sucesso.`);

      if (typeof onClose === "function") onClose();
      
      setTimeout(() => {
        navigate("/TelaInicial"); // Ou "/"
      }, 500);
    } else {
      console.error("❌ Erro no cadastro:", resultado.error);
      // O hook useCadastro já deve setar o erro visualmente
    }
  };

  // Login Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário logado com Google:", user);
      
      
      alert("Login com Google realizado! (Atenção: Funcionalidade parcial sem integração com banco)");
      
      // Simulação de login (Cuidado: ID fake pode quebrar o pedido)
      const usuarioSimulado = {
          id: 999, // ID temporário (Isso pode dar erro na compra!)
          nome: user.displayName,
          email: user.email
      };
      localStorage.setItem("usuario", JSON.stringify(usuarioSimulado));

      window.location.href = "/TelaInicial";
      if (typeof onClose === "function") onClose();

    } catch (err) {
      console.error("Erro Google:", err);
      alert("Erro ao autenticar com Google.");
    }
  };

  // ... (Restante das funções de modal mantidas iguais) ...
  const abrirModalTermos = (e) => { e.stopPropagation(); setModalAberto(true); };
  const fecharModalTermos = () => { setModalAberto(false); };
  const abrirLoginAPartirCadastro = (e) => {
    e?.preventDefault();
    if (typeof onClose === "function") onClose();
    if (typeof onOpenLogin === "function") onOpenLogin();
  };

  return (
    <>
      <div className="cadastro-overlay" role="dialog" onClick={(e) => {
          if (e.target.classList.contains("cadastro-overlay") && typeof onClose === "function") onClose();
        }}>
        <div className="cadastro-modal" onClick={(e) => e.stopPropagation()}>
          
          {/* ESQUERDA */}
          <div className="cadastro-esquerda">
            <h1>Seja Bem-Vindo!</h1>
            <p>Nosso espaço foi criado com base em ciência, empatia e inclusão...</p>
          </div>

          {/* DIREITA */}
          <div className="cadastro-direita">
            <form onSubmit={handleSubmit} className="cadastro-form">
              <button className="close-button" onClick={onClose} type="button">&times;</button>

              <h2>Cadastro</h2>

              {/* ... (Inputs de Nome e Email iguais) ... */}
              <div className="input-group"><label>Seu Nome:</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={loading} placeholder="Digite seu nome completo" /></div>
              <div className="input-group"><label>Seu Email:</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} placeholder="seu@email.com" /></div>
              
              {/* Novo Campo Opcional: Endereço
              <div className="input-group">
                 <label>Endereço (Opcional):</label>
                 <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} disabled={loading} placeholder="Rua, Número - Bairro" />
              </div> */}

              {/* ... (Inputs de Data e Senha iguais) ... */}
              <div className="input-group"><label>Data de Nascimento:</label><input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required disabled={loading} /></div>
              <div className="input-group"><label>Senha:</label><input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required disabled={loading} minLength={6} placeholder="Mínimo 6 caracteres" /></div>
              <div className="input-group"><label>Confirmar Senha:</label><input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required disabled={loading} minLength={6} placeholder="Repita a senha" /></div>

              {/* ... (Termos e Botões iguais) ... */}
              <div className="termos-container">
                <div className={`termo-circulo ${termosAceitos ? 'ativo' : ''}`} onClick={() => !loading && setTermosAceitos(!termosAceitos)} />
                <p>Li e aceito os <span className="termos-link" onClick={abrirModalTermos}>Termos de Uso</span></p>
              </div>

              {error && <p className="cadastro-erro">{error}</p>}

              <button type="submit" className="cadastro-btn" disabled={loading}>{loading ? "Cadastrando..." : "Criar Conta"}</button>

              <p className="cadastro-footer">Já possui Cadastro? <a href="#login" onClick={abrirLoginAPartirCadastro}>Faça Login Aqui</a></p>
            </form>

            {/* Google */}
            <div className="separator-container"><div className="vertical-line" /><div className="cadastro-ou">Ou</div><div className="vertical-line" /></div>
            <div className="div-google-bnt"><button className="google-btn" onClick={handleGoogleLogin} type="button" disabled={loading}><img src="/GoogleCadastro.png" alt="Google" className="google-icon" /></button></div>
          </div>
        </div>
      </div>

      {modalAberto && (<div className="modal-termos-overlay" onClick={fecharModalTermos}><div onClick={(e) => e.stopPropagation()}><TermosDeUso onClose={fecharModalTermos} /></div></div>)}
    </>
  );
}

export default Cadastro;