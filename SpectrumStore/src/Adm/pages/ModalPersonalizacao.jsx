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
      especifico: [],
    }
  );

  // 🔹 Conjuntos básicos
  const cores = ["#0000FF", "#FFFF00", "#008000", "#FF0000", "#800080", "#FFA500"];
  const tamanhos = ["Pequeno", "Médio", "Grande"];
  const pesos = ["1kg", "2kg", "3kg", "4kg", "5kg", "6kg"];
  const materiais = ["Algodão", "Veludo", "Poliéster", "Nylon"];
  const extras = ["Com som", "Com textura", "Brilha no escuro", "Personalizado"];
  const especificos = ["Infantil", "Adulto", "Sensorial", "Decorativo"];

  // 🔹 Todas as categorias
  const categoriasMap = {
    "Brinquedos sensoriais": {
      textura: ["Lisa", "Rugosa", "Macia", "Com bolhas"],
      formato: ["Cubo", "Esfera", "Pirâmide", "Anel"],
      material: ["Silicone", "Borracha", "Espuma", "Plástico"],
      cor: cores,
    },
    "Brinquedos educativos e pedagógicos": {
      tema: ["Matemática", "Letras", "Formas", "Cores"],
      material: ["Madeira", "Plástico", "Cartão"],
      dificuldade: ["Fácil", "Médio", "Difícil"],
    },
    "Rotina e organização": {
      tipo: ["Quadro de Rotina", "Planner Visual", "Agenda Adaptada"],
      tamanho: ["A4", "A3", "A5"],
      estilo: ["Colorido", "Minimalista", "Ilustrado"],
    },
    "Moda e acessórios sensoriais": {
      tipo: ["Pulseira Sensorial", "Colar Mordedor", "Camiseta com Peso"],
      material: ["Silicone", "Tecido", "Velcro"],
      cor: cores,
      tamanho: tamanhos,
    },
    "Ambiente e relaxamento": {
      aroma: ["Lavanda", "Baunilha", "Menta", "Sem perfume"],
      textura: ["Macia", "Felpuda", "Refrescante"],
      tipo: ["Travesseiro", "Manta", "Capa de Almofada"],
    },
    "Jogos Cognitivos e Educacionais": {
      tema: ["Memória", "Raciocínio Lógico", "Atenção", "Linguagem"],
      nivel: ["Infantil", "Juvenil", "Adulto"],
      material: ["Papel", "Madeira", "Plástico"],
    },
    "Materiais Escolares Adaptados": {
      tipo: ["Lápis Grosso", "Tesoura Adaptada", "Caderno Sensorial"],
      cor: cores,
      tamanho: tamanhos,
    },
    "Cuidados e Rotina Pessoal": {
      tipo: ["Escova Sensorial", "Toalha Adaptada", "Massageador"],
      material: ["Silicone", "Tecido", "Borracha"],
      cor: cores,
    },
    "Materiais de CAA": {
      tipo: ["Cartas de Comunicação", "Prancha Visual", "Aplicativo CAA"],
      simbolos: ["PCS", "ARASAAC", "PECS", "Outro"],
      tamanho: tamanhos,
    },
    "Material Ponderado": {
      cor: cores,
      tamanho: tamanhos,
      peso: pesos,
      material: materiais,
      extra: extras,
      especifico: especificos,
    },
  };

  // 🔹 Define categoria atual (ou padrão)
  const categoriaAtual = categoriasMap[novoProduto.categoria] || categoriasMap["Material Ponderado"];

  // ✅ Alterna múltiplas seleções
  const handleSelecionar = (campo, valor) => {
    setPersonalizacao((prev) => {
      const jaSelecionado = prev[campo]?.includes(valor);
      return {
        ...prev,
        [campo]: jaSelecionado
          ? prev[campo].filter((v) => v !== valor)
          : [...(prev[campo] || []), valor],
      };
    });
  };

  const handleConfirmar = () => {
    if (
      novoProduto.categoria === "Material Ponderado" &&
      personalizacao.peso.length < 4
    ) {
      alert("⚠️ Escolha pelo menos 4 opções de peso antes de salvar!");
      return;
    }

    const novoProdutoAtualizado = {
      ...novoProduto,
      personalizacao,
    };

    setNovoProduto(novoProdutoAtualizado);
    localStorage.setItem("produtoAtual", JSON.stringify(novoProdutoAtualizado));
    localStorage.setItem("personalizacaoSelecionada", JSON.stringify(personalizacao));

    alert("✅ Personalização salva com sucesso!");
  };

  // Carrega do localStorage se existir
  useEffect(() => {
    const salvo = localStorage.getItem("produtoAtual");
    if (salvo) {
      setPersonalizacao(JSON.parse(salvo).personalizacao || personalizacao);
    }
  }, []);

  // 🔹 Divide automaticamente os campos em páginas (máx 3 seções por página)
  const camposPorPagina = 5;
  const campos = Object.entries(categoriaAtual);
  const totalPaginas = Math.ceil(campos.length / camposPorPagina);
  const camposDaPagina = campos.slice(
    (pagina - 1) * camposPorPagina,
    pagina * camposPorPagina
  );

  return (
    <div className="modal-personalizacao-adm">
      <h3 className="titulo-modal-personalizacao-adm">
        Personalização para {novoProduto.categoria || "Material Ponderado"}
      </h3>

      {/* ---------- Conteúdo paginado ---------- */}
      <div className="pagina-personalizacao">
        {camposDaPagina.map(([campo, opcoes]) => (
          <div className="secao" key={campo}>
            <p>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</p>
            <div className={campo === "cor" ? "opcoes-cores" : "botoes-opcao"}>
              {opcoes.map((valor) => (
                <button
                  key={valor}
                  style={{
                    backgroundColor: campo === "cor" ? valor : "",
                    border:
                      campo === "cor" && personalizacao[campo]?.includes(valor)
                        ? "3px solid #333"
                        : campo === "cor"
                        ? "1px solid #ccc"
                        : undefined,
                  }}
                  className={`botao-opcao ${
                    personalizacao[campo]?.includes(valor) ? "selecionado" : ""
                  }`}
                  onClick={() => handleSelecionar(campo, valor)}
                >
                  {campo === "cor" ? "" : valor}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Rodapé com paginação automática ---------- */}
      <div className="rodape-modal">
        <div className="paginacao">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
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
