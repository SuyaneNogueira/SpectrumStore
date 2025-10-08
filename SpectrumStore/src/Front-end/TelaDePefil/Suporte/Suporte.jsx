import React, { useEffect, useRef, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import Picker from "emoji-picker-react";
import "./Suporte.css";

function Suporte({ isOpen = false, onClose = () => {} }) {
  const [state, handleSubmit] = useForm("mpwjbkbk");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const fileRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // bloqueio scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // popup de envio
  useEffect(() => {
    if (state.succeeded) {
      setShowPopup(true);
      const t = setTimeout(() => {
        setShowPopup(false);
        onClose();
        setMessage("");
        setFilePreview(null);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [state.succeeded, onClose]);

  // fechar emoji picker
  useEffect(() => {
    function handleDocClick(e) {
      if (
        showEmoji &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [showEmoji]);

  // emoji
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + (emojiData.emoji || ""));
    setShowEmoji(false);
  };

  // arquivos
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setFilePreview(null);
      return;
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () =>
        setFilePreview({ url: reader.result, name: file.name });
      reader.readAsDataURL(file);
    } else {
      setFilePreview({ url: null, name: file.name });
    }
  };

  const removeFile = () => {
    if (fileRef.current) fileRef.current.value = "";
    setFilePreview(null);
  };

  return (
    <div
      className={`suporte-overlay ${isOpen ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.classList.contains("suporte-overlay")) onClose();
      }}
    >
      <div className="suporte-modal" role="document">
        <button
          className="suporte-fechar"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <h2 className="suporte-titulo">Suporte</h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="suporte-form"
          noValidate={false}  
        >
          {/* De (editável) */}
          <div className="suporte-campo linha-horizontal">
            <label className="suporte-label" htmlFor="email">
              De:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="suporte-input"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="seuemail@gmail.com"
              required
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>

          {/* Para */}
          <div className="suporte-campo linha-horizontal">
            <label className="suporte-label">Para:</label>
            <span className="suporte-texto">spectrum.tea0204@gmail.com</span>
          </div>

          {/* Assunto */}
          <label className="suporte-label" htmlFor="message">
            Assunto:
          </label>
          <textarea
            id="message"
            name="message"
            className="suporte-textarea"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />

          {/* Arquivo invisível */}
          <input
            ref={fileRef}
            type="file"
            name="attachment"
            accept="image/*,application/pdf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Ações */}
          <div className="suporte-actions">
            <button
              className="suporte-btn"
              type="submit"
              disabled={state.submitting}
            >
              {state.submitting ? "Enviando..." : "Enviar"}
            </button>

            {/* preview dentro da caixa */}
            {filePreview && (
              <div
                className="suporte-file-preview"
                role="group"
                aria-label="Arquivo selecionado"
              >
                {filePreview.url ? (
                  <img src={filePreview.url} alt={filePreview.name} />
                ) : (
                  <span className="suporte-file-name">{filePreview.name}</span>
                )}
                <button
                  type="button"
                  className="suporte-file-remove"
                  onClick={removeFile}
                >
                  ×
                </button>
              </div>
            )}

            <div className="suporte-icones">
              <button
                type="button"
                className="suporte-clip-btn"
                onClick={() => fileRef.current && fileRef.current.click()}
                title="Anexar arquivo"
              >
                <img src="/clipsuporte.png" alt="anexar" />
              </button>

              <div ref={emojiButtonRef} className="emoji-wrap">
                <button
                  type="button"
                  className="suporte-emoji-btn"
                  onClick={() => setShowEmoji((s) => !s)}
                  title="Inserir emoji"
                >
                  <img src="/emojisuporte.png" alt="emoji" />
                </button>

                {showEmoji && (
                  <div
                    className="emoji-picker-container"
                    role="dialog"
                    aria-label="Emoji picker"
                  >
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="suporte-popup-central" role="status" aria-live="polite">
          <p>Email enviado com sucesso!</p>
        </div>
      )}
    </div>
  );
}

export default Suporte;
