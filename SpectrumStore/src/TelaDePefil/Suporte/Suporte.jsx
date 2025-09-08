import React, { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import "./Suporte.css";

function Suporte({ isOpen = false, onClose = () => {} }) {
  const [from, setFrom] = useState("seuemail@gmail.com");
  const [message, setMessage] = useState("");

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);
  
    const handleSend = (e) => {
    e.preventDefault();
  
    emailjs.send(
      "spectrum",   
      "template_b5s5hfk",   
      {
        from_email: from,
        to_email: "spectrum.tea0204@gmail.com",
        message: message,
      },
      "nx6hmLI3fMGC-7-w7"      
    )
    .then(() => {
      alert("Mensagem enviada com sucesso!");
      onClose();
    })
    .catch((error) => {
      alert("Erro ao enviar: " + error.text);
    });
  };
  
  return (
    <div
      className="suporte-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.classList.contains("suporte-overlay")) onClose();
      }}
    >
      <div className="suporte-modal">
        <button className="suporte-fechar" onClick={onClose}>
          ×
        </button>

        <h2 className="suporte-titulo">Suporte</h2>

        {/* De */}
        <div className="suporte-campo">
          <label className="suporte-label">De:</label>
          <input
            type="email"
            className="suporte-input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        {/* Para */}
        <div className="suporte-campo">
          <label className="suporte-label">Para:</label>
          <span className="suporte-texto">spectrum.tea0204@gmail.com</span>
        </div>

        <label className="suporte-label">Assunto:</label>
        <textarea
          placeholder="Digite sua mensagem..."
          className="suporte-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <div className="suporte-actions">
          <button className="suporte-btn" type="button" onClick={handleSend}>
            Enviar
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default Suporte;
