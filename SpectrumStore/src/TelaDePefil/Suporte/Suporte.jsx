import React, { useEffect, useState } from "react";
// import { useForm, ValidationError } from "@formspree/react";
// import EmojiPicker from "emoji-picker-react";
import "./Suporte.css";

function Suporte({ isOpen = false, onClose = () => {} }) {
  const [state, handleSubmit] = useForm("mpwjbkbk"); // endpoint Formspree
  const [showPopup, setShowPopup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  useEffect(() => {
    if (state.succeeded) {
      setShowPopup(true);

      const timer = setTimeout(() => {
        setShowPopup(false);
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.succeeded, onClose]);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Arquivo selecionado:", file.name);
    }
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

        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

            {/* Ícone de anexo */}
            <label htmlFor="suporte-file-upload" className="suporte-icone">
              <img src="/clipsuporte.png" alt="Anexar arquivo" />
            </label>
            <input
              id="suporte-file-upload"
              type="file"
              name="attachment"   // 👈 aqui é essencial para enviar ao Formspree
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />


            {/* Ícone de emoji */}
            <div className="suporte-icone" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <img src="/emojisuporte.png" alt="Emoji" />
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="suporte-emoji-picker">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
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
