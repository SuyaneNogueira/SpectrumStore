import Navbar from '../Navbar/Navbar'
import './Tela_inicial.css'
import Checkbox from '../components/Checkbox'
import { useFavorites } from '../contexts/FavoritesContext';

function Tela_inicial() {
  const { toggleFavorite, isFavorite } = useFavorites();

  const produtoAbaco = {
    id: 'abaco-01', // Adicione um ID para identificar o produto
    nome: 'Ábaco',
    preco: 200,
    // ...
  };

  return (
    <div className='div-tela-inicial-principal'>
        <Navbar/>
      <div className='div-elementos-tela-inicial'>
      <div class="div-fundo-brinquedos-container">
    <img class="foto-fundo-b" src="Fundo-brinquedos.png" alt="Brinquedos educativos" />
  
    <div class="conteudo-principal-brinquedos">
      <h2 class="titulo-brinquedos">Por que os brinquedos são importantes?</h2>
      <button class="botao-saiba-mais">Saiba mais</button>
    </div>
    </div>
    <div className="separacao-divs-produtos-fundo">
    <div className='container-produtos-store'>
      <div className="produtos-store">
        <div className='produto-imagem-container'>
          <img className='foto-abaco' src="Abaco.jpg" alt="" />
          <div class="etiqueta-preco"><span className='cor-amarela-preco'>R$</span>200</div>
          <div class="icone-favorito"><Checkbox isChecked={isFavorite(produtoAbaco.id)}
            onClick={() => toggleFavorite(produtoAbaco)}/></div>
        </div>
        <div className='produto-detalhes'>
          <h3 className='titulo-produto-store'>Ábaco</h3>
          <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
          <div class="produto-avaliacao">
          <span class="estrela-cheia">★</span>
          <span class="estrela-cheia">★</span>
          <span class="estrela-cheia">★</span>
          <span class="estrela-cheia">★</span>
          <span class="estrela-vazia">☆</span>
        </div>
        
      </div>
      </div>
      <div className="produtos-store">

      </div>
      <div className="produtos-store">

      </div>
    </div>
    <div className='container-produtos-store'>
      <div className="produtos-store"></div>
      <div className="produtos-store"></div>
      <div className="produtos-store"></div>
    </div> 
    </div>
    </div>
    </div>
  )
}

export default Tela_inicial