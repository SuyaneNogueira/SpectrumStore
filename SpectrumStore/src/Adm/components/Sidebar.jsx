import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation(); 
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h1 className="logo-escrita-adm">
         <span className='span-cor-logo-spectrum-adm'>Spectrum</span> Store
      </h1>

     <div className="butons-sidebar">
      <Link to="GEM" className={`menu-item ${location.pathname === "GEM" ? "active" : ""}`}>
        GEM
      </Link>

      <Link to="pedidos" className={`menu-item ${location.pathname === "pedidos" ? "active" : ""}`}>
        Pedido
      </Link>

      <Link to="estatisticas" className={`menu-item ${location.pathname === "estatisticas" ? "active" : ""}`}>
        Estatísticas
      </Link>

      <Link to="produtos" className={`menu-item ${location.pathname === "produtos" ? "active" : ""}`}>
        Produtos
      </Link>

      <Link to="estoque" className={`menu-item ${location.pathname === "estoque" ? "active" : ""}`}>
        Estoque
      </Link>
      </div>
      <div className="icones-geral-adm-sidebar">
          <div className="icons-notification-adm-sidebar">
            <FaRegBell  
              size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="icon-search-adm-sidebar">
            <CiSearch
              size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>

          <div className="icon-perfil-adm-sidebar">
            <CgProfile
              size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/PerfilAdm")}
            />
          </div>
        </div>
    </div>
  );
}

