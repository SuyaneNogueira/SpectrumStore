import React, { useEffect, useState } from "react";
// import { useForm, ValidationError } from "@formspree/react";
import "./Suporte.css";

function Suporte({ isOpen = false, onClose = () => {} }) {
  const [state, handleSubmit] = useForm("mpwjbkbk"); // seu endpoint do Formspree
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    if (state.succeeded) {
      setShowPopup(true);


      const timer = setTimeout(() => {
        setShowPopup(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.succeeded, onClose]);

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

        <form onSubmit={handleSubmit}>

          <div className="suporte-campo">
            <label className="suporte-label" htmlFor="email">De:</label>
            <input
              id="email"
              type="email"
              name="email"
              className="suporte-input"
              placeholder="seuemail@gmail.com"
              required
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>

          <div className="suporte-campo">
            <label className="suporte-label">Para:</label>
            <span className="suporte-texto">spectrum.tea0204@gmail.com</span>
          </div>

          <label className="suporte-label" htmlFor="message">Assunto:</label>
          <textarea
            id="message"
            name="message"
            placeholder="Digite sua mensagem..."
            className="suporte-textarea"
            required
          ></textarea>
          <ValidationError prefix="Message" field="message" errors={state.errors} />

          <div className="suporte-actions">
            <button
              className="suporte-btn"
              type="submit"
              disabled={state.submitting}
            >
              {state.submitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="suporte-popup-central">
          <p>Email enviado com sucesso!</p>
        </div>
      )}
    </div>
  );
}

export default Suporte;
