import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Button from './Button';
import StarRating from './StarRating';
import './Tela_inicial.css';
import React, { useState, useEffect } from 'react';
import { useFavorites } from '../TelaFavoritos/FavoriteContext';

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

const produtosFixos = [
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

function Tela_inicial() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const { toggleFavorite, isFavorited } = useFavorites();
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [produtosCombinados, setProdutosCombinados] = useState([]);

 useEffect(() => {
  // Função para recarregar produtos sempre que o localStorage mudar
  const carregarProdutos = () => {
    const produtosSalvos = JSON.parse(localStorage.getItem("produtosLoja")) || [];
    setProdutosCombinados([...produtosFixos, ...produtosSalvos]);
  };

  // 🔹 Carrega os produtos ao montar
  carregarProdutos();

  // 🔹 Escuta alterações no localStorage (até entre abas)
  window.addEventListener("storage", carregarProdutos);

  // 🔹 Observa mudanças diretas feitas na mesma aba
  const observer = new MutationObserver(carregarProdutos);
  observer.observe(document.body, { childList: true, subtree: true });

  // 🔹 Cleanup ao desmontar
  return () => {
    window.removeEventListener("storage", carregarProdutos);
    observer.disconnect();
  };
}, []);

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);
    setTermoPesquisa(''); 
  };
  
  const handlePesquisaChange = (termo) => {
    setTermoPesquisa(termo);
    setCategoriaSelecionada(null);
  };

  const handleFavoriteClick = (productId) => {
    console.log(`Produto ${productId} foi favoritado/desfavoritado!`);
  };

  let produtosExibidos = produtosCombinados;

  if (categoriaSelecionada) {
    produtosExibidos = produtosExibidos.filter(produto => 
      (produto.category || produto.categoria) === categoriaSelecionada
    );
  }

  if (termoPesquisa) {
    produtosExibidos = produtosExibidos.filter(produto =>
      (produto.name || produto.nome).toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      (produto.description || produto.descricao).toLowerCase().includes(termoPesquisa.toLowerCase())
    );
  }

  return (
    <div className='div-tela-inicial-principal'>
      <Navbar onCategoriaClick={handleCategoriaClick} onPesquisaChange={handlePesquisaChange} />
      <div className='div-elementos-tela-inicial'>
        <div className="div-fundo-brinquedos-container">
          <img className="foto-fundo-b" src="Fundo-brinquedos.png" alt="Brinquedos educativos" />
          <div className="conteudo-principal-brinquedos">
            <h2 className="titulo-brinquedos">Qual a finalidade de cada produto?</h2>
            <button className="botao-saiba-mais">Saiba mais</button>
          </div>
        </div>
        <div className="separacao-divs-produtos-fundo">
          <div className='container-produtos-store'>
            {produtosExibidos.map((produto, idx) => (
              <div className="produtos-store" key={idx}>
                <div className="icone-favorito">
                  <Button isFavorited={isFavorited(produto.id)} 
                    onClick={() => toggleFavorite(produto)}/>
                </div>
                <Link to={`/produto/${produto.id || idx}`} className="link-produto-card">
                  <div className='produto-imagem-container'>
                    <img
                      className='foto-produtos'
                      src={produto.image || produto.imagem}
                      alt={produto.name || produto.nome}
                    />
                    <div className="etiqueta-preco">
                      <span className='cor-amarela-preco'>R$</span>{(produto.price || produto.valor).toFixed ? (produto.price || produto.valor).toFixed(2) : produto.price || produto.valor}
                    </div>
                  </div>
                  <div className='produto-detalhes'>
                    <h3 className='titulo-produto-store'>{produto.name || produto.nome}</h3>
                    <p className='descricao-produto'>{produto.description || produto.descricao}</p>
                    <div className="produto-avaliacao">
                      <StarRating rating={produto.rating || 0} />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="rodape-tela-inicial">
          <div className="logo-rodape-spectrum">
            <h1 className='logo-escrita-spectrum-store-rodape'><span className='span-cor-logo-spectrum-rodape'>Spectrum</span> Store</h1> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tela_inicial;
