import './Pedidos.css';
import { CgProfile } from "react-icons/cg";

export default function Pedidos() {
  return (
    <div className='pedidos-visao-adm'>
         <div className='titulo-pedidos-adm'>
           <div className='pedidos-encontrados-adm'>
            <h1>Pedidos</h1>
      
             <p>28 pedidos encontrados</p>
           </div>
          
          <div className='icones-geral-adm'>
   <CgProfile size={40}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate('/')} />
        
          </div>
          
       </div>
    </div>  
  )
}
  