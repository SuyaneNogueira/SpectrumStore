import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation(); // pega o caminho atual

  return (
    <div className="sidebar">
      <h1 className="logo-escrita-adm">
         <span className='span-cor-logo-spectrum-adm'>Spectrum</span> Store
      </h1>

     <div className="butons-sidebar">
      <Link to="dashboard" className={`menu-item ${location.pathname === "dashboard" ? "active" : ""}`}>
        Dashboard
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
    </div>
  );
}

