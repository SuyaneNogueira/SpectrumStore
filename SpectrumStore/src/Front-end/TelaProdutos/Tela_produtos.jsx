import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Tela_produtos.css";
import { useParams } from "react-router-dom";
import StarRating from "../TelaInicial/StarRating";
import personalizacoesPorCategoria from "./PersonalizacoesData";
import { useCart } from "../Carrinho/CartContext";
import Popup from "./Popup";

import CadernoBrochura from "../imagens/CadernoBrochura.webp";
import CamisaCompressao from "../imagens/CamisaCompressao.webp";
import EscovaEletrica from "../imagens/EscovaEletrica.webp";
import FidgetToy from "../imagens/FidgetToy.webp";
import JogoMemoria from "../imagens/JogoMemoria.jpg";
import KitJogoPareamento from "../imagens/KitJogoPareamento.webp";
import LivroComunicacao from "../imagens/LivroComunicacao.jpg";
import LuminariaProjetor from "../imagens/LuminariaProjetor.avif";
import MantaPonderada from "../imagens/MantaPonderada.webp";
import QuadroRotinaD from "../imagens/QuadroRotinaD.webp";
import QuebraCabecaV from "../imagens/QuebraCabecaV.png";

const produtosSpectrum = [
  {
    id: 1,
    name: "Caderno Brochura",
    price: 12.50,
    image: CadernoBrochura,
    description:
      "Caderno brochura simples com capa lisa. Ideal para anotações e desenhos, de fácil manuseio.",
    rating: 4.0,
    category: "MateriaisEscolaresAdaptados",
  },
  {
    id: 2,
    name: "Camisa de Compressão",
    price: 79.90,
    image: CamisaCompressao,
    description:
      "Camisa de compressão sensorial, oferece feedback tátil profundo, ajudando a regular e acalmar.",
    rating: 4.8,
    category: "ModaEAcessoriosSensoriais",
  },
  {
    id: 3,
    name: "Escova de Dentes Elétrica",
    price: 55.00,
    image: EscovaEletrica,
    description:
      "Escova de dentes elétrica com vibração suave, indicada para sensibilidade oral e rotinas de higiene.",
    rating: 3.9,
    category: "CuidadosERotinaPessoal",
  },
  {
    id: 4,
    name: "Fidget Toy Pop-It",
    price: 25.00,
    image: FidgetToy,
    description:
      "Brinquedo sensorial Pop-It para alívio do estresse e foco. Ajuda na coordenação motora fina.",
    rating: 4.5,
    category: "BrinquedosSensoriais",
  },
  {
    id: 5,
    name: "Jogo da Memória",
    price: 35.00,
    image: JogoMemoria, // Este já estava no seu import, mas usei o nome da sua lista
    description:
      "Jogo clássico da memória com figuras temáticas, estimulando a concentração e o raciocínio.",
    rating: 4.2,
    category: "JogosCognitivosEEducacionais",
  },
  {
    id: 6,
    name: "Kit Jogo de Pareamento",
    price: 45.90,
    image: KitJogoPareamento,
    description:
      "Kit com cartões para atividades de pareamento, ideal para desenvolver a discriminação visual e a lógica.",
    rating: 4.7,
    category: "BrinquedosEducativosEPedagogicos",
  },
  {
    id: 7,
    name: "Livro de Comunicação Visual",
    price: 65.00,
    image: LivroComunicacao,
    description:
      "Livro/Álbum de comunicação alternativa (PECS). Ferramenta essencial para comunicação não-verbal.",
    rating: 5.0,
    category: "ComunicacaoAlternativaEAumentativa(CAA)",
  },
  {
    id: 8,
    name: "Luminária Projetora",
    price: 89.99,
    image: LuminariaProjetor,
    description:
      "Luminária que projeta estrelas ou padrões. Cria um ambiente relaxante e estimulante visualmente.",
    rating: 4.6,
    category: "AmbienteERelaxamento",
  },
  {
    id: 9,
    name: "Manta Ponderada",
    price: 249.00,
    image: MantaPonderada,
    description:
      "Manta com peso terapêutico, proporciona pressão suave e constante, promovendo calma e segurança.",
    rating: 4.9,
    category: "MaterialPonderado",
  },
  {
    id: 10,
    name: "Quadro de Rotina Diária",
    price: 49.90,
    image: QuadroRotinaD,
    description:
      "Quadro visual magnético para estabelecer e acompanhar a rotina diária, oferecendo previsibilidade.",
    rating: 4.7,
    category: "RotinaEOrganizacao",
  },
  {
    id: 11,
    name: "Quebra-Cabeça de Madeira",
    price: 38.00,
    image: QuebraCabecaV,
    description:
      "Quebra-cabeça de encaixe em madeira, com figuras coloridas. Desenvolve a motricidade e o foco.",
    rating: 4.3,
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

 // Na Tela_produtos.jsx

 const handleAddToCart = () => {
 if (!produto) return;

 const totalPersonalizacoes = Object.values(personalizacoesSelecionadas)
 .flat()
 .filter((v) => v && v.trim && v.trim() !== "").length;

 if (totalPersonalizacoes < 5) {
   alert("⚠️ Adicione pelo menos 5 personalizações antes de continuar!");
 return;
 }

    // =========================================================
    // 1. PREPARAR AS CUSTOMIZAÇÕES
    // =========================================================
    // O seu 'personalizacoesSelecionadas' já está no formato
    // de array (ex: { extras: ["Opção A", "Opção B"] }),
    // o que é ÓTIMO, pois o usuário quer múltiplas opções.
    
    // Nós só precisamos fazer duas coisas:
    
    // 1a. Clonar o objeto para não mexer no original
    const customizationsParaCarrinho = { ...personalizacoesSelecionadas };

    // 1b. Adicionar o "SKU" que o nosso roteador do backend precisa
    // 'produto.category' (ex: "ModaEAcessoriosSensoriais")
    customizationsParaCarrinho.sku = produto.category;


    // =========================================================
    // 2. MONTAR O PRODUTO FINAL PARA O CARRINHO
    // =========================================================
    const produtoParaCarrinho = {
      id: produto.id,
      name: produto.name || produto.nome,
      price: produto.price || produto.valor,
      image: produto.image || produto.imagem,
      rating: produto.rating || 0,
      
      // 2a. Usa o nome 'customizations' (que o backend espera)
      // 2b. Passa o objeto que acabamos de preparar (com o SKU)
      customizations: customizationsParaCarrinho,

      quantidade,
    };

    // DEBUG: Veja o que você está enviando
    console.log("Enviando para o carrinho:", JSON.stringify(produtoParaCarrinho, null, 2));

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
