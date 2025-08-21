import Navbar from '../Navbar/Navbar';
import './Tela_produtos.css';
import { useParams } from 'react-router-dom';
import Radio from './Radio';
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

function Tela_produtos() {
  const { id } = useParams();
  const produto = produtosSpectrum.find(p => p.id === parseInt(id));

  if (!produto) {
    return <div>Produto não encontrado!</div>;
  }

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
              <Radio rating={produto.rating} />
            </div>
            </div>
          </div>
        </div>

        <div className="secao-personalizacao">
          <h3 className="titulo-personalizacao">Personalizações</h3>
          <div className="opcoes-personalizacao">
            <div className="grupo-opcao">
              <p className="titulo-opcao">Cor:</p>
              <div className="opcoes-container">
                {/* Exemplo de opções de cor. Implemente a lógica de seleção aqui. */}
                <div className="cor-quadrado" style={{ backgroundColor: 'yellow' }}></div>
                <div className="cor-quadrado" style={{ backgroundColor: 'blue' }}></div>
                <div className="cor-quadrado" style={{ backgroundColor: 'red' }}></div>
                <div className="cor-quadrado" style={{ backgroundColor: 'green' }}></div>
                <div className="cor-quadrado" style={{ backgroundColor: 'purple' }}></div>
                <div className="cor-quadrado" style={{ backgroundColor: 'orange' }}></div>
              </div>
            </div>
            <div className="grupo-opcao">
              <p className="titulo-opcao">Tamanho:</p>
              <div className="opcoes-container">
                <div className="tamanho-caixa">P (5cm)</div>
                <div className="tamanho-caixa">M (10cm)</div>
                <div className="tamanho-caixa">G (15cm)</div>
              </div>
            </div>
            <div className="grupo-opcao">
              <p className="titulo-opcao">Textura:</p>
              <div className="opcoes-container">
                <div className="textura-caixa">Liso</div>
                <div className="textura-caixa">Áspera</div>
                <div className="textura-caixa">Ondulado</div>
                <div className="textura-caixa">Escamoso</div>
                <div className="textura-caixa">Pontilhado</div>
                <div className="textura-caixa">Acolchoado</div>
              </div>
            </div>
            <div className="grupo-opcao">
              <p className="titulo-opcao">Nível de Pressão:</p>
              <div className="opcoes-container">
                <div className="textura-caixa">Muito macio</div>
                <div className="textura-caixa">Macio</div>
                <div className="textura-caixa">Médio</div>
                <div className="textura-caixa">Rígido</div>
              </div>
            </div>
            <div className="grupo-opcao">
              <p className="titulo-opcao">Detalhes Adicionais:</p>
              <div className="opcoes-container">
                  <div className="textura-caixa">Com sinos</div>
                  <div className="textura-caixa">Com espelhos</div>
                  <div className="textura-caixa">Com glitter</div>
                  <div className="textura-caixa">Com luzes</div>
                  <div className="textura-caixa">Com alça</div>
                  <div className="textura-caixa">Com velcro</div>
              </div>
            </div>
          </div>
          <button className="botao-adicionar-carrinho">Adicionar ao carrinho</button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Tela_produtos