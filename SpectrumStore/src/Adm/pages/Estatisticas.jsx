import React from "react";
import { useNavigate } from "react-router-dom";
import "./Estatisticas.css"; // Vamos criar este arquivo de estilo abaixo

export default function Estatisticas() {
  const navigate = useNavigate();

  return (
    <div className="construction-container">
      <div className="construction-card">
        {/* Ícone animado */}
        <div className="construction-icon">
          ⚙️
        </div>

        <h1>Em Desenvolvimento</h1>
        
        <p className="construction-text">
          Estamos preparando gráficos e análises incríveis para você monitorar tudo por aqui.
        </p>
        
        <p className="construction-subtext">
          Esta funcionalidade será liberada para todos em breve!
        </p>

        {/* Botão para voltar para a página anterior */}
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
}