import Navbar from '../Navbar/Navbar';
import Button from './Button';
import StarRating from './StarRating';
import './Tela_inicial.css';

function Tela_inicial() {
  // Em uma aplicação real, esse valor viria de um banco de dados ou API.
  // Para o nosso exemplo, vamos usar um valor fixo.
  const abaco1Rating = 3.5;
  const abaco2Rating = 4.5;
  const abaco3Rating = 2.5;
  const abaco4Rating = 1.5;
  const abaco5Rating = 5.0;
  const abaco6Rating = 3.0;
  const abaco7Rating = 2.0;
  const abaco8Rating = 4.0;
  const abaco9Rating = 1.0;

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
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco1Rating} />
                </div>
              </div>
            </div>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco2Rating} />
                </div>
              </div>
            </div>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco3Rating} />
                </div>
              </div>
            </div>
          </div>
          <div className='container-produtos-store'>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco4Rating} />
                </div>
              </div>
            </div>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco5Rating} />
                </div>
              </div>
            </div>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco6Rating} />
                </div>
              </div>
            </div>
          </div>
           <div className='container-produtos-store'>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco7Rating} />
                </div>
              </div>
            </div>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco8Rating} />
                </div>
              </div>
            </div>
            <div className="produtos-store">
              <div className='produto-imagem-container'>
                <img className='foto-abaco' src="Abaco.jpg" alt="Ábaco" />
                <div className="etiqueta-preco">
                  <span className='cor-amarela-preco'>R$</span>200
                </div>
                <div className="icone-favorito">
                  <Button/>
                </div>
              </div>
              <div className='produto-detalhes'>
                <h3 className='titulo-produto-store'>Ábaco</h3>
                <p className='descricao-produto'>aiodhsoaihfduadfhuosdhfuoahfuoheuoiafnoehfioehfo</p>
                <div className="produto-avaliacao">
                  <StarRating rating={abaco9Rating} />
                </div>
              </div>
            </div>
          </div>
        <div className="rodape-tela-inicial">
          <div className="logo-rodape-spectrum">
            <h1 className='logo-escrita-spectrum-store-rodape'><span className='span-cor-logo-spectrum-rodape'>Spectrum</span> Store</h1> 
          </div>
          
        </div>
        </div>
      </div>
    </div>
  );
}

export default Tela_inicial;