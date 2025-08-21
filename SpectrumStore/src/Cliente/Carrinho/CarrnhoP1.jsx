import './CarrinhoP1.css'
import Navbar from '../../Navbar/Navbar'
function CarrnhoP1() {
  return (
    <div className='fundoCarrinho'>
     <Navbar/>
  
        {/* <img src="CarrinhoFundooooo.png" alt="" className='foto-de-fundo-carrinho' /> */}
     
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
              </div>
              <div className=''>

              </div>
              </div>  

            {/* <div>
                <div>botao1</div>
                <div>botao2</div>
            </div> */}
        </div>  
        </div>

   

    </div>
  )
}

export default CarrnhoP1