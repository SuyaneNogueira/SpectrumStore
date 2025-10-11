import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Button from './Button';
import StarRating from './StarRating';
import './Tela_inicial.css';
import React, { useState, useEffect } from 'react';
import Abaco from '../imagens/Abaco.jpg';
import QuebraCabeca from '../imagens/Quebra-cabeça.avif';
import MassinhaModelar from '../imagens/Massinha-modelar.webp';
import BolaFut from '../imagens/BolaFut.webp';
import JogoMemoria from '../imagens/Jogo-memoria.jpg';
import CuboMagico from '../imagens/Cubo-magico.jpg';
import { useFavorites } from '../TelaFavoritos/FavoriteContext';

const produtosFixos = [
  { id: 1, name: "Ábaco", price: 20.00, image: Abaco, description: "O ábaco é uma ferramenta de cálculo milenar para desenvolver o raciocínio lógico.", rating: 3.5, category: "JogosCognitivosEEducacionais"},
  { id: 2, name: "Quebra-cabeça", price: 40.00, image: QuebraCabeca, description: "Quebra-cabeça de madeira com 50 peças para estimular a coordenação motora.", rating: 4.5, category: "BrinquedosEducativosEPedagogicos"},
  { id: 3, name: "Massinha de modelar", price: 8.00, image: MassinhaModelar, description: "Kit de massinhas coloridas para desenvolver a criatividade e a coordenação.", rating: 2.5, category: "BrinquedosSensoriais"},
  { id: 4, name: "Jogo da memória", price: 15.00, image: JogoMemoria, description: "Jogo de memória com animais para exercitar a memória e a concentração.", rating: 1.5, category: "JogosCognitivosEEducacionais"},
  { id: 5, name: "Cubo Mágico", price: 10.00, image: CuboMagico, description: "Clássico cubo mágico para desafiar a lógica e a paciência.", rating: 5.0, category: "BrinquedosEducativosEPedagogicos"},
  { id: 6, name: "Bola", price: 19.00, image: BolaFut, description: "Clássico", rating: 2.5, category: "BrinquedosEducativosEPedagogicos"}
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
            <h2 className="titulo-brinquedos">Por que os brinquedos são importantes?</h2>
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
