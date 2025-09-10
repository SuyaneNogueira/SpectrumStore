import "./Estoque.css";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Estoque() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);

  // 🔹 estado para categoria selecionada
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  // 🔹 categorias fixas + "Todos"
  const categoriasFixas = [
    "Brinquedos sensoriais",
    "Brinquedos educativos e pedagógicos",
    "Rotina e organização",
    "Moda e acessórios sensoriais",
    "Ambiente e relaxamento",
    "Jogos Cognitivos e Educacionais",
  ];
  const categorias = ["Todos", ...categoriasFixas];

  // carregar produtos do localStorage (os mesmos do Produtos.jsx)
  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
    setProdutos(produtosSalvos);
  }, []);

  // 🔹 aplicar filtro por categoria
  const produtosFiltrados =
    categoriaSelecionada === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaSelecionada);

  return (
    <div className="container-geral-estoque-adm">
      <div className="titulo-estoque-adm">
        <div className="titulo-definitivo-estoque">
          <h1>Estoque</h1>
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
                Fora estoque:{" "}
                {produtos.filter((p) => p.quantidade === 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 Select de categorias */}
        <div className="categorias-estoque-adm">
          <div className="aba-categorias-estoque-produto">
            <p>Categorias</p>
            <div className="imagem-down-png-adm-estoque">
              <select
                className="select-image-down-estoque-adm"
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
              >
                {categorias.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Área para receber os produtos do Produtos.jsx */}
      <div className="receber-produtos-estoque-adm">
        {produtosFiltrados.map((produto, index) => (
          <div key={index} className="produto-card-estoque">
            <div className="img-card-produto-estoque">
              <div className="style-img-estoque-adm"></div>
            </div>
            <div className="preco-categoria-produtos-estoque">
              <div className="preco-indivi-estoque-adm">
                <p>
                  <span>R$</span> {produto.valor}
                </p>
              </div>

              <div className="categoria-indivi-estoque-adm">
                <p>{produto.categoria}</p>
              </div>
            </div>
            <div className="container-identificao-produtos-estoque">
              <div className="nome-produto-estoque-adm">
                <h3>{produto.nome}</h3>
              </div>

              <div className="quantidade-produto-estoque-adm">
                <div>
                  <p> Em Estoque: {produto.quantidade ?? 0}</p>
                </div>
                <div>
                  <button>Repor Estoque</button>
                </div>
              </div>

              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
