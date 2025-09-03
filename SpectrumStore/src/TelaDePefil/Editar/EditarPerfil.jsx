import React from "react";
import "./EditarPerfil.css";

function EditarPerfil({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <button className="modal-fechar" onClick={onClose}>✕</button>
        <h2>Editar Informações</h2>

        <div className="editar-info">
          <div className="editar-foto"></div>
          <button className="alterar-foto">Alterar Foto</button>
        </div>

        <form className="editar-form">
          <label>Nome:</label>
          <input type="text" defaultValue="Maria Knupp" />

          <label>CPF:</label>
          <input type="text" defaultValue="110.597.338-40" />

          <label>Data de Nascimento:</label>
          <input type="date" defaultValue="2007-02-16" />

          <button type="submit" className="botao-salvar">
            Salvar Informações
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarPerfil;
