import "./Pedidos.css";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Pedidos() {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <div className="pedidos-visao-adm">
      {/* Título */}
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

      {/* Conteúdo */}
      <div className="area-dos-pedidos-adm">
        <div className="titulo-dois-pedidos-adm">
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">Todos os Pedidos</Link>{" "}
          </div>
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">Processo</Link>{" "}
          </div>
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">Despacho</Link>{" "}
          </div>
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">Completo</Link>{" "}
          </div>
        </div>

        <div className="area-processos-pedidos-adm">
          <div className="status-pedidos-adm-um">
            <div className="adm-modal-sete" style={{ position: "relative" }}>
              {/* Botão */}
              <button className="button-adm-modal" onClick={() => setOpenPopup(!openPopup)}>{">"}</button>

              {/* Popup */}
              {openPopup && (
                <div className="popup-box">
                  <p>
                    Caso ocorra um desalinhamento das colunas elas ainda vão
                    seguir essa sequência à direita.
                  </p>
                </div>
              )}
            </div>

            <div>
              <p>ID</p>
            </div>
            <div>
              <p>Nome</p>
            </div>
            <div>
              <p>Endereço</p>
            </div>
            <div>
              <p>Data</p>
            </div>
            <div>
              <p>Preço</p>
            </div>
            <div>
              <p>Status</p>
            </div>
            <div>
              <p>Ação</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
