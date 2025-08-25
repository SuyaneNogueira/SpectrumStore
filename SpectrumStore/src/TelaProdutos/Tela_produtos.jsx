import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Tela_produtos.css';
import { Link, useParams } from 'react-router-dom';
import Radio from './Radio';
import Abaco from '../imagens/Abaco.jpg';
import QuebraCabeca from '../imagens/Quebra-cabeça.avif';
import MassinhaModelar from '../imagens/Massinha-modelar.webp';
import JogoMemoria from '../imagens/Jogo-memoria.jpg';
import CuboMagico from '../imagens/Cubo-magico.jpg';
import personalizacoesPorCategoria from './PersonalizacoesData'; 

const produtosSpectrum = [
  { id: 1, name: "Ábaco", price: 20.00, image: Abaco, description: "O ábaco é uma ferramenta de cálculo milenar para desenvolver o raciocínio lógico.", rating: 3.5, category: "JogosCognitivosEEducacionais"},
  { id: 2, name: "Quebra-cabeça", price: 40.00, image: QuebraCabeca, description: "Quebra-cabeça de madeira com 50 peças para estimular a coordenação motora.", rating: 4.5, category: "BrinquedosEducativosEPedagogicos"},
  { id: 3, name: "Massinha de modelar", price: 8.00, image: MassinhaModelar, description: "Kit de massinhas coloridas para desenvolver a criatividade e a coordenação.", rating: 2.5, category: "BrinquedosSensoriais"},
  { id: 4, name: "Jogo da memória", price: 15.00, image: JogoMemoria, description: "Jogo de memória com animais para exercitar a memória e a concentração.", rating: 1.5, category: "JogosCognitivosEEducacionais"},
  { id: 5, name: "Cubo Mágico", price: 10.00, image: CuboMagico, description: "Clássico cubo mágico para desafiar a lógica e a paciência.", rating: 5.0, category: "BrinquedosEducativosEPedagogicos"}
];

function Tela_produtos() {
  const { id } = useParams();
  const produto = produtosSpectrum.find(p => p.id === parseInt(id));

  const [currentRating, setCurrentRating] = useState(produto.rating);

  const handleRatingChange = (newRating) => {
   setCurrentRating(newRating);
   console.log(`Nova avaliação para o produto ${produto.name}: ${newRating} estrelas`);
  };

  if (!produto) {
    return <div>Produto não encontrado!</div>;
  }
  
  const personalizacoesDoProduto = personalizacoesPorCategoria[produto.category] || {};

  return (
    <div className='div-principal-produtos'>
      <Navbar/>
      <div className="alinhamento-produtos">
       <div className="conteudo-principal">
         <div className="secao-produto">
           <div className="imagem-produto-container">
             <img className="imagem-produto" src={produto.image} alt={produto.name} />
           </div>
           <div className="detalhes-produto">
            <div className="detalhes-texto-container">
               <h2 className="nome-produto">{produto.name}</h2>
               <p className="descricao-produto-completa">{produto.description}</p>
               <div className="avaliacao-produto">
                 <Radio 
                    initialRating={currentRating} 
                    onRatingChange={handleRatingChange} 
                 />
               </div>
               </div>
               </div>
            </div>

          <div className="secao-personalizacao">
           <h3 className="titulo-personalizacao">Personalizações</h3>
           <div className="opcoes-personalizacao">
            {Object.keys(personalizacoesDoProduto).map(key => (
              <div key={key} className="grupo-opcao">
                <p className="titulo-opcao">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</p>
                <div className="opcoes-container">
                  {personalizacoesDoProduto[key].map(opcao => (
                    <div key={opcao} className="personalizacao-item">
                      {key === 'cor' || key === 'corFundo' || key === 'corPrincipal' ? (
                        <div className="cor-quadrado" style={{ backgroundColor: opcao.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e') }}></div>
                      ) : (
                        <div className="textura-caixa">{opcao}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
           </div>
           <Link to='/Carrinho' className="botao-adicionar-carrinho">Adicionar ao carrinho</Link>
         </div>
       </div>
       </div>
     </div>
  );
}

export default Tela_produtos