import "./Produtos.css";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Produtos() {
  const navigate = useNavigate();
  return (
    <div className="container-produtos-adm">
      <div className="titulo-produtos-adm">
        <div>
          <h1>Produtos</h1>
          <p>2 produtos cadastrados</p>
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
      <div className="cadastro-dos-produtos-adm">

      </div>
    </div>
  );
}
