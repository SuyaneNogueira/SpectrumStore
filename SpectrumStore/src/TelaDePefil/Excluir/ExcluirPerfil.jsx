import React from "react";
import "./ExcluirPerfil.css";

function ExcluirPerfil({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <h3>Tem certeza que deseja excluir seu perfil?</h3>
        <div className="botoes-excluir">
          <button className="confirmar">Sim</button>
          <button className="cancelar" onClick={onClose}>Não</button>
        </div>
      </div>
    </div>
  );
}

export default ExcluirPerfil;
