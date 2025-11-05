import React, { useState, useEffect } from 'react';
import './GestaoEstoqueMachine.css'; // (Você ainda vai precisar do CSS)

// =========================================================
// 🔹 COMPONENTE DO CONTEÚDO PRINCIPAL (A Gestão de Estoque)
// =========================================================
export default function Dashboard() {
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState(''); // Estado para o filtro

  // Busca os dados do NOSSO backend (o "garçom" proxy)
  useEffect(() => {
    setLoading(true);
    
    // Monta a URL do NOSSO backend
    // (O server.js vai repassar isso para a máquina)
    let url = 'http://localhost:3001/api/maquina/estoque';

    // Se o usuário digitou algo no filtro, adiciona como 'query param'
    // Ex: /api/maquina/estoque?q=chassi
    if (filtro) {
      url += `?q=${filtro}`; 
    }

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erro da API: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setPecas(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar o estoque. A máquina está offline?");
        setPecas([]);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [filtro]); // Roda de novo toda vez que o 'filtro' mudar

  // Renderização do conteúdo
  return (
    <div className="admin-content">
      <h1>Gestão de Estoque da Máquina</h1>
      <p>Interface para consultar, repor e editar peças da bancada.</p>

      {/* Ferramenta de Filtro/Busca */}
      <div className="filtro-container">
        <input 
          type="text" 
          placeholder="Filtrar por nome ou tipo (ex: chassi, azul, lamina_cor)..."
          // Um 'debounce' leve para não fazer fetch a cada letra
          onChange={(e) => setTimeout(() => setFiltro(e.target.value), 300)}
        />
      </div>

<div className='tabela-scroll-container'>
      {/* Tabela de Resultados */}
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
              pecas.map(peca => (
                <tr key={peca.id}>
                  <td>{peca.id}</td>
                  <td>{peca.tipo_peca}</td>
                  <td>{peca.nome_peca}</td>
                  <td>{peca.quantidade}</td>
                  <td>
                    <span className={peca.disponivel ? 'status-ativo' : 'status-inativo'}>
                      {peca.disponivel ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="acoes-botoes">
                    <button className="btn-repor">Repor</button>
                    <button className="btn-editar">Editar</button>
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
     </div>
  );
}