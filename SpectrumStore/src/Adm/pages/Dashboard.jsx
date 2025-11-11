import React, { useState, useEffect } from "react";
import "./GestaoEstoqueMachine.css"; // (Certifique-se que o CSS do Modal está aqui)

function EditModal({ peca, onClose, onSave }) {
  // Estado "interno" do formulário
  const [formData, setFormData] = useState(peca);

  // Atualiza o estado interno do formulário a cada digitação
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value, 10)
          : value,
    }));
  };

  // Chama a função 'onSave' (que é a 'handleSavePeca' do Dashboard)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            Editar Peça: {peca.nome_peca} (Posição #{peca.id})
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>Nome da Peça:</label>
            <input
              type="text"
              name="nome_peca"
              value={formData.nome_peca}
              onChange={handleChange}
            />

            <label>Quantidade (Repor):</label>
            <input
              type="number"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
            />

            <label>Status:</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="disponivel"
                name="disponivel"
                checked={formData.disponivel}
                onChange={handleChange}
              />
              <label htmlFor="disponivel">Peça Disponível (Ativa)</label>
            </div>

            {/* NOTA: Se a API da máquina (a foto) exigir { "cor": "..." }, 
                você precisa adicionar um input para "cor" aqui. */}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar Mudanças
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================================
// 🔹 COMPONENTE PRINCIPAL (O seu Dashboard/GEM)
// (Aqui começa o seu código original)
// =========================================================
export default function Dashboard() {
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState(""); // Estado para o filtro

  // 👇👇👇 PARTE 2: "DINAMINA" DO MODAL (Novos States) 👇👇👇
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPeca, setCurrentPeca] = useState(null); // A peça que está sendo editada
  // 👆👆👆 FIM DA "DINAMINA" 👆👆👆

  // useEffect (Busca os dados) - O seu código original, está perfeito
  useEffect(() => {
    setLoading(true);
    let url = "http://localhost:3001/api/maquina/estoque";
    if (filtro) {
      url += `?q=${filtro}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro da API: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setPecas(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Não foi possível carregar o estoque. A máquina está offline?"
        );
        setPecas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filtro]);

  // ==============================================
  // 👇👇👇 PARTE 3: "DINAMINA" (FUNÇÕES DO MODAL) 👇👇👇
  // ==============================================

  // 1. Abre o Modal (chamado pelos botões "Editar"/"Repor")
  const handleOpenModal = (peca) => {
    setCurrentPeca(peca); // Guarda a peça que o usuário clicou
    setIsModalOpen(true); // Abre o modal
  };

  // 2. Fecha o Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPeca(null);
  };

  // 3. Salva os dados (O "Garçom" que chama o Backend)
  const handleSavePeca = async (formData) => {
    const { id } = formData; // Pega o ID da peça (ex: 1)

    // Prepara o 'body' que o nosso 'adminRoutes.js' (backend) espera
    // (O adminRoutes.js vai repassar isso para a máquina)
    const bodyParaMaquina = {
      nome_peca: formData.nome_peca,
      quantidade: formData.quantidade,
      disponivel: formData.disponivel,
    };

    try {
      // Chama a rota "proxy" (PUT) que JÁ ESTÁ PRONTA no seu adminRoutes.js
      const res = await fetch(
        `http://localhost:3001/api/maquina/estoque/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyParaMaquina),
        }
      );

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(
          erroData.error || "A máquina (API) recusou a atualização."
        );
      }

      alert(`Peça #${id} atualizada com sucesso!`);

      // Atualiza a tabela na tela (Frontend) sem precisar recarregar a página
      setPecas(pecas.map((p) => (p.id === id ? formData : p)));

      handleCloseModal(); // Fecha o modal
    } catch (err) {
      console.error(err);
      alert(`Erro ao salvar: ${err.message}`);
    }
  };
  // ==============================================
  // 👆👆👆 FIM DA "DINAMINA" 👆👆👆
  // ==============================================

  // Renderização do conteúdo (Seu código original)
  return (
    <div className="admin-content">
      <h1>Gestão de Estoque da Máquina</h1>
      <p>Interface para consultar, repor e editar peças da bancada.</p>

      {/* Ferramenta de Filtro/Busca (Seu código original) */}
      <div className="filtro-container">
        <input
          type="text"
          placeholder="Filtrar por nome ou tipo (ex: chassi, azul, lamina_cor)..."
          onChange={(e) => setTimeout(() => setFiltro(e.target.value), 300)}
        />
      </div>

      {/* O seu container de Scroll (Seu código original) */}
      <div className="tabela-scroll-container">
        {loading && <p>Carregando estoque da máquina...</p>}
        {error && <p className="erro-estoque">{error}</p>}

        {!loading && !error && (
          <table className="tabela-estoque">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo da Peça</th>
                <th>Nome da Peça</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pecas.length > 0 ? (
                pecas.map((peca) => (
                  <tr key={peca.id}>
                    <td>{peca.id}</td>
                    <td>{peca.tipo_peca}</td>
                    <td>{peca.nome_peca}</td>
                    <td>{peca.quantidade}</td>
                    <td>
                      <span
                        className={
                          peca.disponivel ? "status-ativo" : "status-inativo"
                        }
                      >
                        {peca.disponivel ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="acoes-botoes">
                      {/* 👇👇👇 PARTE 4: "COSTURA" DO ONCLICK 👇👇👇 */}
                      <button
                        className="btn-repor"
                        onClick={() => handleOpenModal(peca)} // Chama a função
                      >
                        Repor
                      </button>
                      <button
                        className="btn-editar"
                        onClick={() => handleOpenModal(peca)} // Chama a função
                      >
                        Editar
                      </button>
                      {/* 👆👆👆 FIM DA "COSTURA" 👆👆👆 */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Nenhuma peça encontrada com esse filtro.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 👇👇👇 PARTE 5: "COSTURA" (Renderiza o Modal) 👇👇👇 */}
      {/* Se o 'isModalOpen' for true, o modal aparece */}
      {isModalOpen && (
        <EditModal
          peca={currentPeca}
          onClose={handleCloseModal}
          onSave={handleSavePeca}
        />
      )}
      {/* 👆👆👆 FIM DA "COSTURA" 👆👆👆 */}
    </div>
  );
}
