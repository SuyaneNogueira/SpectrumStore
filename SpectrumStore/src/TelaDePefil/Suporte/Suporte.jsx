import React from "react";
import "./Suporte.css";

function Suporte({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="suporte-overlay">
      <div className="suporte-modal">
        <h2 className="suporte-titulo">Suporte</h2>

        <div className="suporte-info">
          <p><strong>De:</strong> seuemail@gmail.com</p>
          <p><strong>Para:</strong> spectrum.tea0204@gmail.com</p>
        </div>

        <label className="suporte-label">Assunto:</label>
        <textarea
          placeholder="Digite sua mensagem..."
          className="suporte-textarea"
        />

        <div className="suporte-actions">
          <button className="suporte-btn">Enviar</button>
          <img
            src="LixeiraAjustes.png"
            alt="Excluir"
            className="suporte-lixeira"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default Suporte;
