import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Tela_produtos.css";
import { useParams } from "react-router-dom";
import StarRating from "../TelaInicial/StarRating";
import Abaco from "../imagens/Abaco.jpg";
import QuebraCabeca from "../imagens/Quebra-cabeça.avif";
import MassinhaModelar from "../imagens/Massinha-modelar.webp";
import JogoMemoria from "../imagens/Jogo-memoria.jpg";
import CuboMagico from "../imagens/Cubo-magico.jpg";
import personalizacoesPorCategoria from "./PersonalizacoesData";
import { useCart } from "../Carrinho/CartContext";
import Popup from "./Popup";

const produtosSpectrum = [
  {
    id: 1,
    name: "Ábaco",
    price: 20.0,
    image: Abaco,
    description:
      "O ábaco é uma ferramenta de cálculo milenar para desenvolver o raciocínio lógico.",
    rating: 3.5,
    category: "JogosCognitivosEEducacionais",
  },
  {
    id: 2,
    name: "Quebra-cabeça",
    price: 40.0,
    image: QuebraCabeca,
    description:
      "Quebra-cabeça de madeira com 50 peças para estimular a coordenação motora.",
    rating: 4.5,
    category: "BrinquedosEducativosEPedagogicos",
  },
  {
    id: 3,
    name: "Massinha de modelar",
    price: 8.0,
    image: MassinhaModelar,
    description:
      "Kit de massinhas coloridas para desenvolver a criatividade e a coordenação.",
    rating: 2.5,
    category: "BrinquedosSensoriais",
  },
  {
    id: 4,
    name: "Jogo da memória",
    price: 15.0,
    image: JogoMemoria,
    description:
      "Jogo de memória com animais para exercitar a memória e a concentração.",
    rating: 1.5,
    category: "JogosCognitivosEEducacionais",
  },
  {
    id: 5,
    name: "Cubo Mágico",
    price: 10.0,
    image: CuboMagico,
    description: "Clássico cubo mágico para desafiar a lógica e a paciência.",
    rating: 5.0,
    category: "BrinquedosEducativosEPedagogicos",
  },
];

function Tela_produtos() {
  const { id } = useParams();

  ////////////////////////////////////////////

  // 🔥 1️⃣ CARREGA O PRODUTO AO MONTAR OU MUDAR O ID
  React.useEffect(() => {
    const produtosLoja = JSON.parse(localStorage.getItem("produtosLoja")) || [];
    const produtoBase =
      produtosLoja.find((p) => Number(p.id) === Number(id)) ||
      produtosSpectrum.find((p) => p.id === Number(id));

    const produtoPersonalizado = JSON.parse(
      localStorage.getItem("produtoAtual")
    );

    const produtoCombinado =
      produtoPersonalizado && produtoPersonalizado.id === produtoBase?.id
        ? {
            ...produtoBase,
            personalizacao: produtoPersonalizado.personalizacao,
          }
        : produtoBase;

    setProduto(produtoCombinado);

    if (produtoCombinado) {
      const categoria = produtoCombinado.category;
      const personalizacoesCategoria =
        personalizacoesPorCategoria[categoria] || {};

      // Se o produto ainda não tiver personalizacao, aplica a da categoria
      setProduto({
        ...produtoCombinado,
        personalizacao:
          produtoCombinado.personalizacao || personalizacoesCategoria,
      });
    }
  }, [id]);

  // ⚡ 2️⃣ REAGE AUTOMATICAMENTE A ALTERAÇÕES NO LOCALSTORAGE (SEM DAR F5)
  React.useEffect(() => {
    const handleStorageChange = () => {
      const produtoPersonalizado = JSON.parse(
        localStorage.getItem("produtoAtual")
      );
      if (produtoPersonalizado && produtoPersonalizado.id === Number(id)) {
        setProduto((prev) =>
          prev
            ? { ...prev, personalizacao: produtoPersonalizado.personalizacao }
            : produtoPersonalizado
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [id]);

  ////////////////////////////////////////////////////////////////

  const [personalizacoesSelecionadas, setPersonalizacoesSelecionadas] =
    useState({});
  const { addToCart } = useCart();
  const [quantidade, setQuantidade] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [produto, setProduto] = useState(null);

  const handlePersonalizacaoClick = (key, opcao) => {
    setPersonalizacoesSelecionadas((prev) => {
      const newSelections = { ...prev };
      if (newSelections[key] === opcao) delete newSelections[key];
      else newSelections[key] = opcao;
      return newSelections;
    });
  };

  const handleAddToCart = () => {
    if (!produto) return;

    const totalPersonalizacoes = Object.values(personalizacoesSelecionadas)
      .flat()
      .filter((v) => v && v.trim && v.trim() !== "").length;

    if (totalPersonalizacoes < 5) {
      alert("⚠️ Adicione pelo menos 5 personalizações antes de continuar!");
      return;
    }

    // 🔥 Garante compatibilidade dos nomes das propriedades
    const produtoParaCarrinho = {
      id: produto.id,
      name: produto.name || produto.nome,
      price: produto.price || produto.valor,
      image: produto.image || produto.imagem,
      rating: produto.rating || 0,
      personalizacoes: personalizacoesSelecionadas, // ⚠️ Usa 'personalizacoes', igual no CarrinhoP1
      quantidade,
    };

    addToCart(produtoParaCarrinho);
    setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  if (!produto) return <div>Produto não encontrado!</div>;

  const personalizacoesDoProduto =
    personalizacoesPorCategoria[produto.category] || {};

  return (
    <div className="div-principal-produtos">
      <Navbar />
      <div className="alinhamento-produtos">
        <div className="conteudo-principal">
          <div className="secao-produto">
            <div className="imagem-produto-container">
              <img
                className="imagem-produto"
                src={produto.image || produto.imagem}
                alt={produto.name || produto.nome}
              />
            </div>
            <div className="detalhes-produto">
              <div className="detalhes-texto-container">
                <h2 className="nome-produto">{produto.name || produto.nome}</h2>
                <p className="descricao-produto-completa">
                  {produto.description || produto.descricao}
                </p>
                <div className="avaliacao-produto">
                  <StarRating rating={produto.rating || 0} />
                </div>
                <p className="preco-produto">
                  <span className="cor-amarelo-preco-3">R$:</span>{" "}
                  {(Number(produto.price) || Number(produto.valor)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="wrapper-linha">
            <div className="linha-divisora"></div>
          </div>

          {/* 🔹 Personalizações visuais do produto */}
          <div className="secao-personalizacao">
            <h3 className="titulo-personalizacao">Personalizações</h3>

            {/* 🔹 Opções disponíveis (definidas no cadastro) */}
            <div className="opcoes-personalizacao">
              {produto.personalizacao &&
                Object.keys(produto.personalizacao).map((key) => (
                  <div key={key} className="grupo-opcao">
                    <p className="titulo-opcao">
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")}
                      :
                    </p>
                    <div className="opcoes-container">
                      {produto.personalizacao[key].map((opcao) => (
                        <div
                          key={opcao}
                          className={`personalizacao-item ${
                            personalizacoesSelecionadas[key]?.includes(opcao)
                              ? "selecionado"
                              : ""
                          }`}
                          onClick={() => {
                            setPersonalizacoesSelecionadas((prev) => {
                              const novas = { ...prev };
                              const selecionadas = novas[key] || [];

                              if (selecionadas.includes(opcao)) {
                                novas[key] = selecionadas.filter(
                                  (v) => v !== opcao
                                );
                              } else {
                                novas[key] = [...selecionadas, opcao];
                              }

                              return novas;
                            });
                          }}
                        >
                          {key.toLowerCase().includes("cor") ? (
                            <div
                              className="cor-quadrado"
                              style={{
                                backgroundColor: opcao
                                  .toLowerCase()
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, ""),
                              }}
                            ></div>
                          ) : (
                            <div className="textura-caixa">{opcao}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              {/* //////////////////////////////////////////////////////////// */}

              <div className="quantidade-e-botao">
                <div className="seletor-quantidade">
                  <button
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  >
                    -
                  </button>
                  <input type="number" value={quantidade} readOnly min="1" />
                  <button onClick={() => setQuantidade(quantidade + 1)}>
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="botao-adicionar-carrinho"
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <Popup
          message="Produto adicionado ao carrinho!"
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

export default Tela_produtos;
