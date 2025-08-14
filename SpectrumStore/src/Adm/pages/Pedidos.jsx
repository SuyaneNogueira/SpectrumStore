import "./Pedidos.css";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function Pedidos() {

  const navigate = useNavigate();

  return (
    <div className="pedidos-visao-adm">
      <div className="titulo-pedidos-adm">
        <div className="pedidos-encontrados-adm">
          <h1>Pedidos</h1>

          <p>28 pedidos encontrados</p>
        </div>

        <div className="icones-geral-adm">
          <div className="icons-notification-adm">
            <FaRegBell
              size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="icon-search-adm">
            <CiSearch
               size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="icon-perfil-adm">
            <CgProfile
              size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      </div>

     <div className="area-dos-pedidos-adm">
         <div className="titulo-dois-pedidos-adm">

           <div> <Link to ="">Todos os Pedidos</Link> </div>
           <div> <Link to ="">Processo</Link> </div>
           <div> <Link to ="">Despacho</Link> </div>
           <div> <Link to ="">Completo</Link> </div>

         </div>
         <div className="area-processos-pedidos-adm">
               <div className="status-pedidos-adm-um">
                   <p>ID</p>
                   <p>Nome</p>
                   <p>Endereço</p>
               </div>
         </div>
     </div>

    </div>
  );
}
