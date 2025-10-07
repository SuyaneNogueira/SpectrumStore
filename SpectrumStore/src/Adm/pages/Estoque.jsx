import "./Estoque.css";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import { ImArrowLeft } from "react-icons/im";
import { ImArrowRight } from "react-icons/im";

export default function Estoque() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  const itensPorPagina = 6; // 🔹 quantidade de produtos por página

  // categorias fixas
  const categoriasFixas = [
    "Brinquedos sensoriais",
    "Brinquedos educativos e pedagógicos",
    "Rotina e organização",
    "Moda e acessórios sensoriais",
    "Ambiente e relaxamento",
    "Jogos Cognitivos e Educacionais",
    "Materiais Escolares Adaptados",
    "Cuidados e Rotina Pessoal",
    "Materiais de CAA",
    "Material Ponderado",
  ];
  const categorias = ["Todos", ...categoriasFixas];

  // carregar produtos do localStorage
  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem("produtosLoja")) || [];
  setProdutos(produtosSalvos);
  }, []);

  // aplicar filtro por categoria
  const produtosFiltrados =
    categoriaSelecionada === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaSelecionada);

  // paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina) || 1;
  const indexInicial = (paginaAtual - 1) * itensPorPagina;
  const indexFinal = indexInicial + itensPorPagina;
  const produtosPaginados = produtosFiltrados.slice(indexInicial, indexFinal);

  return (
    <div className="container-geral-estoque-adm">
      <div className="titulo-estoque-adm">
        <div className="titulo-definitivo-estoque">
          <h1>Estoque</h1>
          <div className="icones-estoque-adm">
            <div className="icons-notification-adm-estoque">
              <FaRegBell
                className="notification-estoque-adm"
                size={30}
                color="#03374C"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>

            <div className="icon-search-adm-estoque">
              <CiSearch
                className="search-estoque-adm"
                size={30}
                color="#03374C"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>

            <div className="icon-perfil-adm-estoque">
              <CgProfile
                className="icon-estoque-adm"
                size={30}
                color="#03374C"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              />
            </div>
          </div>
        </div>
        <div className="categorias-estoque-adm">
          <div className="aba-categorias-estoque-produto">
            <p>Categorias</p>
            <div className="imagem-down-png-adm-estoque">
              <select
                className="select-image-down-estoque-adm"
                value={categoriaSelecionada}
                onChange={(e) => {
                  setCategoriaSelecionada(e.target.value);
                  setPaginaAtual(1); // resetar para a primeira página ao trocar categoria
                }}
              >
                {categorias.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
        </div>
      </div>

      {/* 🔹 Produtos da página atual */}
      <div className="receber-produtos-estoque-adm">
        {produtosPaginados.map((produto, index) => (
          <div key={index} className="produto-card-estoque">
            <div className="img-card-produto-estoque">
              <div className="style-img-estoque-adm">
                <img
                  className="imagemzinha-do-estoque"
                  src={produto.imagem}
                  alt={produto.nome}
                />
                <div className="preco-indivi-estoque-adm">
                  <p>
                    <span>R$</span> {produto.valor}
                  </p>
                </div>
              </div>
            </div>
            <div className="preco-categoria-produtos-estoque">
              <div className="categoria-indivi-estoque-adm">
                <div className="style-categoria-produtos">
                  <p title={produto.categoria}>{produto.categoria}</p>
                </div>
              </div>
            </div>
            <div className="container-identificao-produtos-estoque">
              <div className="nome-produto-estoque-adm">
                <h3>{produto.nome}</h3>
              </div>

              <div className="quantidade-produto-estoque-adm">
                <div className="style-estoque-produtos-adm">
                  <p> Em Estoque: {produto.quantidade ?? 0}</p>
                </div>
                <div className="style-botao-repor-estoque">
                  <button className="botão-repor-estoque">Repor Estoque</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Navegação entre páginas */}
      <div className="div-botão-proximo-estoque-adm">
        <div className="botão-proximo-adm-estoque">
          <ImArrowLeft
            onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
            style={{
              cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
              opacity: paginaAtual === 1 ? 0.5 : 1,
            }}
          />
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <ImArrowRight
            onClick={() =>
              setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
            }
            style={{
              cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
              opacity: paginaAtual === totalPaginas ? 0.5 : 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}
