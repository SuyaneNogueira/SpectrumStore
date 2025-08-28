import './CarrinhoP1.css'
import Navbar from '../../Navbar/Navbar'
import StarRating from '../../TelaInicial/StarRating'

function CarrnhoP1() {
  return (
    <div className='fundoCarrinho'>
     <Navbar/>
        <div className='sssssss'>
           <div className='CoisaBrancaCarrinho'>
            <div className='Comprar-tudo'>
              <div className='div-checkbox-comprar-tudo'><input className='Comprar-tudo-checkbox' type="checkbox"/></div></div>
            <div className='Card1'>
              <div className='div-checkbox-e-imagem'>
               <div className='div-checkbox-card1'><input className='checkbox-card' type="checkbox"/>
              </div>
                <div className='div-imagem-produto-carrinho'>
                  <div className='imagem-carrinho-logo'>
                    <img className='imagem-mesmo-produtos-carrinho' src="CarrinhoFundooooo.png" alt="" />
                    </div>
                  </div> 
                    <div className='Descrição-estrela'> 
                      <div className='estrela'>
                          <StarRating/>
                      </div>
                      <div className='descrição'>
                        <p>Descrição dos brinquedos hgyjkgbjg,mmjbmkgbjgjku</p>
                      </div>
                      <div className='div-valor-brinquedo-carrinho'>
                          R$:<input className='Valor' type="Number" />
                      </div>
                    </div>
              </div>
              </div> 
            <div className='div-button-carrinho'>
             <div className='div-total'>
              Total:<input className='input-total' type="Number" />
              </div> 
              <div><button>Comprar itens</button></div>
            </div>
        </div>  
        </div>

   

    </div>
  )
}

export default CarrnhoP1