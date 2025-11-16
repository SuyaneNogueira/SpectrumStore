import React from 'react'
import "./CadastroAdm.css"

function CadastroAdm() {
  return (
    <div className='div-mestre-cadastro-adm'>
   <div className='seja-bem-vindo-adm'>

 <div className='letreiro-bem-vindo-adm'>
    <div className='titulo-bem-vindo-adm'>
       <h1>SEJA BEM VINDO!</h1>
    </div>

<div className='text-boas-vindas-adm'>
 <p>Esperamos que com sua chegada nossa empresa cresça ainda mais!!</p>
</div>

    </div>
   </div>

   <div className='cadastro-do-adm'>
     
     <div className='titulo-cadastro-adm'>
        <h1>Cadastro</h1>
     </div>

    <div className='inputs-cadastro-adm'>
       
    <input type="text" placeholder=' NOME:' />
    <input type="text" placeholder=' EMAIL:'/>
    <input type="text" placeholder=' CPF:'/>
    <input type="text" placeholder=' SENHA:' />


    </div>

    <div className='botão-cadastrar-adm'>
         
    <button>Cadastrar</button>

    </div>

   </div>

    </div>
  )
}

export default CadastroAdm