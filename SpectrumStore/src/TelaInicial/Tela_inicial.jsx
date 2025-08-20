import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Button from './Button';
import StarRating from './StarRating';
import './Tela_inicial.css';
import React, { useState } from 'react';
import Abaco from '../imagens/Abaco.jpg';
import QuebraCabeca from '../imagens/Quebra-cabeça.avif';
import MassinhaModelar from '../imagens/Massinha-modelar.webp';
import JogoMemoria from '../imagens/Jogo-memoria.jpg';
import CuboMagico from '../imagens/Cubo-magico.jpg';


const produtosSpectrum = [
  { id: 1, name: "Ábaco", price: 20.00, image: Abaco, description: "O ábaco é uma ferramenta de cálculo milenar para desenvolver o raciocínio lógico.", rating: 3.5, category: "JogosCognitivosEEducacionais"},
  { id: 2, name: "Quebra-cabeça", price: 40.00, image: QuebraCabeca, description: "Quebra-cabeça de madeira com 50 peças para estimular a coordenação motora.", rating: 4.5, category: "BrinquedosEducativosEPedagogicos"},
  { id: 3, name: "Massinha de modelar", price: 8.00, image: MassinhaModelar, description: "Kit de massinhas coloridas para desenvolver a criatividade e a coordenação.", rating: 2.5, category: "BrinquedosSensoriais"},
  { id: 4, name: "Jogo da memória", price: 15.00, image: JogoMemoria, description: "Jogo de memória com animais para exercitar a memória e a concentração.", rating: 1.5, category: "JogosCognitivosEEducacionais"},
  { id: 5, name: "Cubo Mágico", price: 10.00, image: CuboMagico, description: "Clássico cubo mágico para desafiar a lógica e a paciência.", rating: 5.0, category: "BrinquedosEducativosEPedagogicos"}
];

function Tela_inicial() {

  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  const handleCategoriaClick = (categoria) => {
    setCategoriaSelecionada(categoria);
    setTermoPesquisa(''); 
  };
  
  const handlePesquisaChange = (termo) => {
    setTermoPesquisa(termo);
    setCategoriaSelecionada(null);
  };

  let produtosExibidos = produtosSpectrum;

  if (categoriaSelecionada) {
    produtosExibidos = produtosSpectrum.filter(produto => 
      produto.category === categoriaSelecionada
    );
  }

  if (termoPesquisa) {
    produtosExibidos = produtosExibidos.filter(produto =>
      produto.name.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      produto.description.toLowerCase().includes(termoPesquisa.toLowerCase())
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
            {produtosExibidos.map(produto => (
              <Link to={`/produto/${produto.id}`} className="produtos-store" key={produto.id}>
                <div className='produto-imagem-container'>
                  <img className='foto-produtos' src={produto.image} alt={produto.name} />
                  <div className="etiqueta-preco">
                    <span className='cor-amarela-preco'>R$</span>{produto.price.toFixed(2)}
                  </div>
                  <div className="icone-favorito">
                    <Button/>
                  </div>
                </div>
                <div className='produto-detalhes'>
                  <h3 className='titulo-produto-store'>{produto.name}</h3>
                  <p className='descricao-produto'>{produto.description}</p>
                  <div className="produto-avaliacao">
                    <StarRating rating={produto.rating} />
                  </div>
                </div>
              </Link>
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