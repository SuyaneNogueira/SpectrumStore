import React, { useState, useContext } from 'react'; 
import Navbar from '../Navbar/Navbar';
import './Tela_produtos.css';
import { Link, useParams } from 'react-router-dom';
import StarRating from '../TelaInicial/StarRating';
import Abaco from '../imagens/Abaco.jpg';
import QuebraCabeca from '../imagens/Quebra-cabeça.avif';
import MassinhaModelar from '../imagens/Massinha-modelar.webp';
import JogoMemoria from '../imagens/Jogo-memoria.jpg';
import CuboMagico from '../imagens/Cubo-magico.jpg';
import personalizacoesPorCategoria from './PersonalizacoesData'; 
import { CartContext } from '../Carrinho/CartContext.jsx';
import { useCart } from '../Carrinho/CartContext';
import Popup from './Popup'; // Importe o componente Pop-up aqui

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
  const [personalizacoesSelecionadas, setPersonalizacoesSelecionadas] = useState({});
  const { addToCart } = useCart();
  const [quantidade, setQuantidade] = useState(1);
  const [showPopup, setShowPopup] = useState(false); // Novo estado para o pop-up

  const handlePersonalizacaoClick = (key, opcao) => {
    if (personalizacoesSelecionadas[key] === opcao) {
      setPersonalizacoesSelecionadas(prev => {
        
        const newSelections = { ...prev };
        delete newSelections[key];
        return newSelections;
      });
    } else {
      setPersonalizacoesSelecionadas(prev => ({
        ...prev,
        [key]: opcao
      }));
    }
  };

  const handleAddToCart = () => {
    if (produto) {
      addToCart({ 
        ...produto, 
        personalizacoes: personalizacoesSelecionadas,
        quantidade: quantidade 
      });
      setShowPopup(true); 
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); 
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
                  <StarRating rating={produto.rating} />
                </div>
                <p className="preco-produto"> <span className='cor-amarelo-preco-3'>R$:</span> {produto.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="wrapper-linha">
            <div className="linha-divisora"></div>
          </div>
          <div className="secao-personalizacao">
            <h3 className="titulo-personalizacao">Personalizações</h3>
            <div className="opcoes-personalizacao">
              {Object.keys(personalizacoesDoProduto).map(key => (
                <div key={key} className="grupo-opcao">
                  <p className="titulo-opcao">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</p>
                  <div className="opcoes-container">
                    {personalizacoesDoProduto[key].map(opcao => (
                      <div 
                        key={opcao} 
                        className={`personalizacao-item ${personalizacoesSelecionadas[key] === opcao ? 'selecionado' : ''}`}
                        onClick={() => handlePersonalizacaoClick(key, opcao)}
                      >
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
              
              <div className="quantidade-e-botao">
                <div className="seletor-quantidade">
                  <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))}>-</button>
                  <input 
                    type="number" 
                    value={quantidade} 
                    readOnly 
                    min="1"
                  />
                  <button onClick={() => setQuantidade(quantidade + 1)}>+</button>
                </div>
                <button onClick={handleAddToCart} className="botao-adicionar-carrinho">Adicionar ao carrinho</button>
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