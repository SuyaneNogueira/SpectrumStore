import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecionar depois
import "./CadastroAdm.css";

function CadastroAdm() {
  const navigate = useNavigate();

  // 1. Estados para guardar o que o usuário digita
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState(""); // (Opcional: O backend atual não salva CPF, mas mantive o campo)
  const [senha, setSenha] = useState("");
  const [codigoMestre, setCodigoMestre] = useState(""); // 🚨 ESSENCIAL para Admin

  const [loading, setLoading] = useState(false);

  // 2. A Função que chama o Backend
  const handleCadastro = async () => {
    if (!nome || !email || !senha || !codigoMestre) {
      alert("Por favor, preencha todos os campos obrigatórios (incluindo o Código Mestre).");
      return;
    }

    setLoading(true);

    try {
      // Chama a rota específica de criação de ADMIN
      const res = await fetch("http://localhost:3001/api/cadastro/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          codigoMestre // A senha secreta "SPECTRUM_ADMIN_2025"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("👑 Administrador cadastrado com sucesso!");
        navigate("/login"); // Manda pro login pra ele entrar
      } else {
        alert("Erro: " + (data.error || "Falha ao cadastrar."));
      }

    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='div-mestre-cadastro-adm'>
      
      {/* Lado Esquerdo (Visual) */}
      <div className='seja-bem-vindo-adm'>
        <div className='letreiro-bem-vindo-adm'>
          <div className='titulo-bem-vindo-adm'>
            <h1>SEJA BEM VINDO!</h1>
          </div>
          <div className='text-boas-vindas-adm'>
            <p>Esperamos que com sua chegada nossa empresa cresça ainda mais!!</p>
          </div>
        </div>
      </div>

      {/* Lado Direito (Formulário) */}
      <div className='cadastro-do-adm'>
        
        <div className='titulo-cadastro-adm'>
          <h1>Cadastro Admin</h1>
        </div>

        <div className='inputs-cadastro-adm'>
          
          <input 
            type="text" 
            placeholder=' NOME:' 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          
          <input 
            type="email" 
            placeholder=' EMAIL:'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            type="text" 
            placeholder=' CPF (Opcional):'
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          
          <input 
            type="password" // Mudei para password pra esconder
            placeholder=' SENHA:' 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {/* 👇 O CAMPO SECRETO QUE FALTAVA 👇 */}
          <input 
            type="password" 
            placeholder=' CÓDIGO MESTRE (Senha da Empresa):' 
            value={codigoMestre}
            onChange={(e) => setCodigoMestre(e.target.value)}
            style={{ border: "2px solid #03374c" }} // Destaque sutil
          />

        </div>

        <div className='botão-cadastrar-adm'>
          <button onClick={handleCadastro} disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CadastroAdm;