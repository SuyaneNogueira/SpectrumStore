import Navbar from '../Navbar/Navbar'
import Button from './Button';
import './Tela_inicial.css'
import { useState } from "react";


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
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-vazia">☆</span>
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
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-vazia">☆</span>
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
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-vazia">☆</span>
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
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-vazia">☆</span>
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
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-vazia">☆</span>
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
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-cheia">★</span>
                  <span className="estrela-vazia">☆</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      </div>
  )
}

export default Tela_inicial