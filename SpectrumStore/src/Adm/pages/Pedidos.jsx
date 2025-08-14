import "./Pedidos.css";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";

export default function Pedidos() {
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
              size={40}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="icon-search-adm">
            <CiSearch
               size={40}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="icon-perfil-adm">
            <CgProfile
              size={40}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
