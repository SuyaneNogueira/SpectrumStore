import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation(); // pega o caminho atual

  return (
    <div className="sidebar">
      <h2 className="logo">
        <img src="Spectrum Store.png" alt="" />
      </h2>

     <div className="butons-sidebar">
      <Link to="dashboard" className={`menu-item ${location.pathname === "dashboard" ? "active" : ""}`}>
        Dashboard
      </Link>

      <Link to="/pedido" className={`menu-item ${location.pathname === "/pedido" ? "active" : ""}`}>
        Pedido
      </Link>

      <Link to="/estatisticas" className={`menu-item ${location.pathname === "/estatisticas" ? "active" : ""}`}>
        Estatísticas
      </Link>

      <Link to="produtos" className={`menu-item ${location.pathname === "produtos" ? "active" : ""}`}>
        Produtos
      </Link>

      <Link to="/estoque" className={`menu-item ${location.pathname === "/estoque" ? "active" : ""}`}>
        Estoque
      </Link>
      </div>
    </div>
  );
}

