import React from "react";
import "./Suporte.css";

function Suporte({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-conteudo">
        <button className="modal-fechar" onClick={onClose}>✕</button>
        <h2>Suporte</h2>

        <form className="suporte-form">
          <p><strong>De:</strong> seuemail@gmail.com</p>
          <p><strong>Para:</strong> spectrum.tea0204@gmail.com</p>

          <label>Assunto:</label>
          <textarea placeholder="Digite sua mensagem..." />

          <button type="submit" className="botao-enviar">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default Suporte;
