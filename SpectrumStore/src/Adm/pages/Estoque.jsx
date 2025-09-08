import "./Estoque.css";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";

export default function Estoque() {
  const navigate = useNavigate();

  return (
    <div className="container-geral-estoque-adm">
      <div className="titulo-estoque-adm">
        <div className="titulo-definitivo-estoque">
          <h1>Estoque</h1>
          {/* {} */}
          <div className="icones-estoque-adm">
            <div className="icons-notification-adm-estoque">
              <FaRegBell
                size={30}
                color="#03374C"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>

            <div className="icon-search-adm-estoque">
              <CiSearch
                size={30}
                color="#03374C"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>

            <div className="icon-perfil-adm-estoque">
              <CgProfile
                size={30}
                color="#03374C"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>
          </div>
        </div>

        <div className="div-info-estoque-res">
          <div className="div-info-produtos-estoque">
            <div className="div-enfeite-produtos-em-estoque">
              <p>Produtos em estoque:8</p>
            </div>
          </div>

          <div className="div-info-produtos-fora-estoque">
            <div className="div-enfeite-produtos-fora-estoque">
              <p>Fora estoque:3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
