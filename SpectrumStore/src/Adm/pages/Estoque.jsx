import "./Estoque.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";

export default function Estoque() {

const navigate = useNavigate();


  return (
    <div className="container-geral-estoque-adm">
      <div className="titulo-estoque-adm">
        <div className="titulo-definitivo-estoque">
           <h1>Produtos</h1>
        </div>

        <div className="icones-estoque-adm">
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

        <div>
          
        </div>
      </div>
    </div>
  );
}
