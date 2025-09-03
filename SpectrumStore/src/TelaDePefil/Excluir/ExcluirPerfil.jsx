import React from "react";
import "./ExcluirPerfil.css";

function ExcluirPerfil({ onClose, onConfirm }) {

  return (
    <div className="modal-overlay">
      <div className="modal-excluir">
        <div className="container-imagemtexto">
        <img src="/BoxImportant.png" alt="" className="icone-excluir" />
        <p className="texto-excluir">
          Tem Certeza que Deseja Excluir Seu Perfil?
        </p>
        </div>
        <div className="botoes-excluir">
          <button className="btn-sim" onClick={onConfirm}>
            Sim
          </button>
          <button className="btn-nao" onClick={onClose}>
            Não
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExcluirPerfil;
