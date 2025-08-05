import Navbar from '../Navbar/Navbar'
import './Tela_inicial.css'

function Tela_inicial() {
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
      {/* <div className='container'>Container</div> */}
      </div>
    </div>
  )
}

export default Tela_inicial