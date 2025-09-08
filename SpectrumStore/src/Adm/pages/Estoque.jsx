import "./Estoque.css";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Estoque() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);

  // carregar produtos do localStorage (os mesmos do Produtos.jsx)
  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
    setProdutos(produtosSalvos);
  }, []);

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
              <p>
                Produtos em estoque:{" "}
                {produtos.filter((p) => p.quantidade > 0).length}
              </p>
            </div>
          </div>

          <div className="div-info-produtos-fora-estoque">
            <div className="div-enfeite-produtos-fora-estoque">
              <p>
                Fora estoque: {produtos.filter((p) => p.quantidade === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Área para receber os produtos do Produtos.jsx */}
      <div className="receber-produtos-estoque-adm">
        {produtos.map((produto, index) => (
          <div key={index} className="produto-card-estoque">
            <h3>{produto.nome}</h3>
            <p>Categoria: {produto.categoria}</p>
            <p>Preço: R$ {produto.valor}</p>
            <p>Quantidade: {produto.quantidade ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
