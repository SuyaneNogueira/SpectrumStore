import Navbar from '../Navbar/Navbar';
import Button from './Button';
import StarRating from './StarRating';
import './Tela_inicial.css';

// 1. Array de produtos
const produtosSpectrum = [
  { id: 1, name: "Ábaco", price: 20.00, image: "Abaco.jpg", description: "O ábaco é uma ferramenta de cálculo milenar para desenvolver o raciocínio lógico.", rating: 3.5},
  { id: 2, name: "Quebra-cabeça", price: 40.00, image: "Quebra-cabeça.avif", description: "Quebra-cabeça de madeira com 50 peças para estimular a coordenação motora. dsaajjjjjjjjjjjjj", rating: 4.5},
  { id: 3, name: "Massinha de modelar", price: 8.00, image: "Massinha-modelar.webp", description: "Kit de massinhas coloridas para desenvolver a criatividade e a coordenação.", rating: 2.5},
  { id: 4, name: "Jogo da memória", price: 15.00, image: "Jogo-memoria.jpg", description: "Jogo de memória com animais para exercitar a memória e a concentração. jjjjjjjjjjjj", rating: 1.5},
  { id: 5, name: "Cubo Mágico", price: 10.00, image: "Cubo-magico.jpg", description: "Clássico cubo mágico para desafiar a lógica e a paciência.", rating: 5.0}
];

function Tela_inicial() {
  return (
    <div className='div-tela-inicial-principal'>
      <Navbar/>
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
            {/* 2. Mapeamento do array para criar os cards */}
            {produtosSpectrum.map(produto => (
              <div className="produtos-store" key={produto.id}>
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