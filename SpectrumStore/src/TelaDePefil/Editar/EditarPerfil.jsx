import React from "react";
import "./EditarPerfil.css";

function EditarPerfil({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <button className="modal-fechar" onClick={onClose}>✕</button>
        <h2 className="modal-titulo">Editar Informações</h2>

        <div className="editar-conteudo">
          {/* Foto + botão alterar */}
          <div className="editar-foto-container">
            <div className="editar-foto"></div>
            <button className="botao-alterar-foto">Alterar Foto</button>
          </div>

          {/* Campos de edição */}
          <div className="editar-form">
            <label><strong>Nome:</strong></label>
            <input type="text" defaultValue="Maria Knupp" />

            <label><strong>CPF:</strong></label>
            <input type="text" defaultValue="110.597.338-40" />

            <label><strong>Data de Nascimento:</strong></label>
            <input type="date" defaultValue="2007-02-16" />
          </div>
        </div>

        <div className="editar-footer">
          <button className="botao-salvar">Salvar Informações</button>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
