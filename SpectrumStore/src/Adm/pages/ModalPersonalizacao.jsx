import React, { useState, useEffect } from "react";
import "./ModalPersonalizacao.css";

export default function ModalPersonalizacao({ novoProduto, setNovoProduto }) {
  const [pagina, setPagina] = useState(1);
  const [personalizacao, setPersonalizacao] = useState(
    novoProduto.personalizacao || {
      cor: [],
      tamanho: [],
      peso: [],
      material: [],
      extra: [],
      especifico: []
    }
  );

  const cores = ["#0000FF", "#FFFF00", "#008000", "#FF0000", "#800080", "#FFA500"];
  const tamanhos = ["Pequeno", "Médio", "Grande"];
  const pesos = ["1kg", "2kg", "3kg", "4kg", "5kg", "6kg"];
  const materiais = ["Algodão", "Veludo", "Poliéster", "Nylon"];
  const extras = ["Com som", "Com textura", "Brilha no escuro", "Personalizado"];
  const especificos = ["Infantil", "Adulto", "Sensorial", "Decorativo"];

  // ✅ Alterna múltiplas seleções
  const handleSelecionar = (campo, valor) => {
    setPersonalizacao((prev) => {
      const jaSelecionado = prev[campo].includes(valor);
      return {
        ...prev,
        [campo]: jaSelecionado
          ? prev[campo].filter((v) => v !== valor)
          : [...prev[campo], valor],
      };
    });
  };

  const handleConfirmar = () => {
    if (personalizacao.peso.length < 4) {
      alert("⚠️ Escolha pelo menos 4 opções de peso antes de salvar!");
      return;
    }

    const novoProdutoAtualizado = {
      ...novoProduto,
      personalizacao,
    };

    setNovoProduto(novoProdutoAtualizado);
    localStorage.setItem("produtoAtual", JSON.stringify(novoProdutoAtualizado));

    alert("✅ Personalização salva com sucesso!");
  };

  // Carrega do localStorage se existir
  useEffect(() => {
    const salvo = localStorage.getItem("produtoAtual");
    if (salvo) {
      setPersonalizacao(JSON.parse(salvo).personalizacao || personalizacao);
    }
  }, []);

  return (
    <div className="modal-personalizacao">
      <h3 className="titulo-modal">Personalização para Material Ponderado</h3>

      {/* ---------- Página 1 ---------- */}
      {pagina === 1 && (
        <div className="pagina-personalizacao">
          <h4>Principal:</h4>

          <div className="secao">
            <p>Cores:</p>
            <div className="opcoes-cores">
              {cores.map((cor) => (
                <button
                  key={cor}
                  style={{
                    backgroundColor: cor,
                    border: personalizacao.cor.includes(cor)
                      ? "3px solid #333"
                      : "1px solid #ccc",
                  }}
                  className="botao-cor"
                  onClick={() => handleSelecionar("cor", cor)}
                />
              ))}
            </div>
          </div>

          <div className="secao">
            <p>Tamanho:</p>
            <div className="botoes-opcao">
              {tamanhos.map((t) => (
                <button
                  key={t}
                  className={`botao-opcao ${
                    personalizacao.tamanho.includes(t) ? "selecionado" : ""
                  }`}
                  onClick={() => handleSelecionar("tamanho", t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="secao">
            <p>Peso (mínimo 4):</p>
            <div className="botoes-opcao">
              {pesos.map((p) => (
                <button
                  key={p}
                  className={`botao-opcao ${
                    personalizacao.peso.includes(p) ? "selecionado" : ""
                  }`}
                  onClick={() => handleSelecionar("peso", p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="secao">
            <p>Material:</p>
            <div className="botoes-opcao">
              {materiais.map((m) => (
                <button
                  key={m}
                  className={`botao-opcao ${
                    personalizacao.material.includes(m) ? "selecionado" : ""
                  }`}
                  onClick={() => handleSelecionar("material", m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Página 2 ---------- */}
      {pagina === 2 && (
        <div className="pagina-personalizacao">
          <h4>Extras:</h4>
          <div className="botoes-opcao">
            {extras.map((extra) => (
              <button
                key={extra}
                className={`botao-opcao ${
                  personalizacao.extra.includes(extra) ? "selecionado" : ""
                }`}
                onClick={() => handleSelecionar("extra", extra)}
              >
                {extra}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Página 3 ---------- */}
      {pagina === 3 && (
        <div className="pagina-personalizacao">
          <h4>Específico:</h4>
          <div className="botoes-opcao">
            {especificos.map((esp) => (
              <button
                key={esp}
                className={`botao-opcao ${
                  personalizacao.especifico.includes(esp) ? "selecionado" : ""
                }`}
                onClick={() => handleSelecionar("especifico", esp)}
              >
                {esp}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Rodapé ---------- */}
      <div className="rodape-modal">
        <div className="paginacao">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`pagina-botao ${pagina === num ? "ativo" : ""}`}
              onClick={() => setPagina(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <button className="botao-confirmar" onClick={handleConfirmar}>
          Confirmar
        </button>
      </div>
    </div>
  );
}
