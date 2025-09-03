import "./Produtos.css";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { ImArrowLeft } from "react-icons/im";
import { ImArrowRight } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Produtos() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 14;

  const [editIndex, setEditIndex] = useState(null);

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    valor: "",
    categoria: "",
    cor: "",
    tamanho: "",
    descricao: "",
    paraQueServe: "",
    imagem: "https://via.placeholder.com/150",
  });

  // 🔹 CATEGORIAS FIXAS
  const categoriasFixas = [
    "Eletrônicos",
    "Roupas",
    "Brinquedos",
    "Esportes",
    "Casa",
    "Outros",
  ];

  // 🔹 estado para categoria selecionada (filtro)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  // Carregar produtos do localStorage
  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
    setProdutos(produtosSalvos);
  }, []);

  // Criar ou editar produto
  const handleSubmit = (e) => {
    e.preventDefault();

    let novosProdutos;
    if (editIndex !== null) {
      novosProdutos = [...produtos];
      novosProdutos[editIndex] = novoProduto;
    } else {
      novosProdutos = [...produtos, novoProduto];
    }

    setProdutos(novosProdutos);
    localStorage.setItem("produtos", JSON.stringify(novosProdutos));

    setIsOpen(false);
    setEditIndex(null);
    setNovoProduto({
      nome: "",
      valor: "",
      categoria: "",
      cor: "",
      tamanho: "",
      descricao: "",
      paraQueServe: "",
      imagem: "https://via.placeholder.com/150",
    });
  };

  // Excluir produto
  const handleDelete = (index) => {
    const novosProdutos = produtos.filter((_, i) => i !== index);
    setProdutos(novosProdutos);
    localStorage.setItem("produtos", JSON.stringify(novosProdutos));

    const totalPaginas = Math.ceil(novosProdutos.length / itensPorPagina);
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  };

  // Editar produto
  const handleEdit = (index) => {
    setEditIndex(index);
    setNovoProduto(produtos[index]);
    setIsOpen(true);
  };

  // 🔹 categorias dinâmicas (produtos) + fixas
  const categorias = ["Todos", ...categoriasFixas];

  // 🔹 filtragem conforme categoria selecionada
  const produtosFiltrados =
    categoriaSelecionada === "Todos"
      ? produtos
      : produtos.filter((p) => p.categoria === categoriaSelecionada);

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensVisiveis = produtosFiltrados.slice(
    indexPrimeiroItem,
    indexUltimoItem
  );
  const totalPaginas = Math.max(
    1,
    Math.ceil(produtosFiltrados.length / itensPorPagina)
  );

  return (
    <div className="container-produtos-adm">
      <div className="titulo-produtos-adm">
        <div>
          <h1>Produtos</h1>
          <p>{produtos.length} produtos cadastrados</p>

          <div className="categorias-produto-adm">
            <p>Categorias</p>
            <div className="imagem-down-png-adm">
              {/* 🔹 SELECT PARA FILTRO */}
              <select
                value={categoriaSelecionada}
                onChange={(e) => {
                  setCategoriaSelecionada(e.target.value);
                  setPaginaAtual(1);
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
        </div>

        <div className="icones-geral-adm-produtos">
          <div className="icons-notification-adm-produtos">
            <FaRegBell
              size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>
          <div className="icon-search-adm-produtos">
            <CiSearch
              size={30}
              color="#03374C"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>
          <div className="icon-perfil-adm-produtos">
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
        <div className="lista-produtos-adm">
          <div className="criar-produto-adm">
            <button
              className="button-adicionar-produto-adm"
              onClick={() => {
                setIsOpen(true);
                setEditIndex(null);
              }}
            >
              Adicionar Produto
              <img className="plus-png-adm" src="plus.png" alt="" />
            </button>
          </div>

          {itensVisiveis.map((produto, index) => {
            const originalIndex = produtos.findIndex((p) => p === produto);
            const idParaAcoes =
              originalIndex !== -1 ? originalIndex : indexPrimeiroItem + index;
            const key =
              originalIndex !== -1
                ? originalIndex
                : `${indexPrimeiroItem}-${index}`;

            return (
              <div key={key} className="card-produtos-adm">
                <div className="ajustes-card-foto-adm">
                  <img
                    className="foto-card-adm"
                    src={produto.imagem}
                    alt={produto.nome}
                  />
                </div>

                <div className="div-valor-do-produto-adm">
                  <div className="preco-categota-produto-adm">
                    <div className="style-valor-produto">
                      <p><span>R$</span> {produto.valor}</p>
                    </div>
                    <div className="style-categorias-adm">
                    <p className="ajust-categoria-adm">Categoria: {produto.categoria}</p>
                    </div>
                  </div>
                </div>

                <div className="div-nome-produto-adm-card">
                  <p>
                    <strong>{produto.nome}</strong>
                  </p>
                </div>

                <div className="div-descrição-produto-adm">
                  <p>{produto.descricao}</p>
                </div>

                <div className="div-botoes-card-edita-ex-adm">
                  <button onClick={() => handleEdit(idParaAcoes)}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(idParaAcoes)}>
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="div-botão-proximo-produtos-adm">
          <div className="botão-proximo-adm-produtos">
            <ImArrowLeft
              onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
              disabled={paginaAtual === 1}
            />
            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>
            <ImArrowRight
              onClick={() =>
                setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
              }
              disabled={paginaAtual === totalPaginas}
            />
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="modal-overlay-produtos-adm">
          <div className="modal-content-produtos-adm">
            <div className="botão-fechar-modal-adm">
              <span
                className="close-btn-produtos-adm"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </span>
            </div>

            <div className="imagem-clicavel-trocar-adm">
              <label
                htmlFor="input-imagem"
                className="label-imagem-adm-produtos"
              >
                <img
                  src={novoProduto.imagem}
                  alt="Selecione a imagem do produto"
                  className="preview-imagem-adm"
                />
              </label>
              <input
                id="input-imagem"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setNovoProduto({ ...novoProduto, imagem: imageUrl });
                  }
                }}
              />
            </div>

            <div className="modal-body-produtos-adm">
              <form className="modal-form-produtos-adm" onSubmit={handleSubmit}>
                <div className="form-row-produtos-adm-um">
                  <div className="div-nome-produto-adm">
                    <label>Nome do produto:</label>
                    <input
                      type="text"
                      value={novoProduto.nome}
                      onChange={(e) =>
                        setNovoProduto({ ...novoProduto, nome: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="valor-modal-adm">
                    <label>Valor:</label>
                    <input
                      type="number"
                      value={novoProduto.valor}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          valor: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row-produtos-adm-dois">
                  <div className="div-categoria-produtos-adm">
                    <label>Categoria:</label>
                    {/* 🔹 SELECT DE CATEGORIAS FIXAS NO MODAL */}
                    <select
                      value={novoProduto.categoria}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          categoria: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecione</option>
                      {categoriasFixas.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="div-cor-produto-adm">
                    <label>Cor:</label>
                    <input
                      type="text"
                      value={novoProduto.cor}
                      onChange={(e) =>
                        setNovoProduto({ ...novoProduto, cor: e.target.value })
                      }
                    />
                  </div>

                  <div className="tamanho-produto-adm">
                    <label>Tamanho:</label>
                    <input
                      type="text"
                      value={novoProduto.tamanho}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          tamanho: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row-produtos-adm-tres">
                  <label>Descrição do produto:</label>

                  <textarea
                    rows="2"
                    value={novoProduto.descricao}
                    onChange={(e) =>
                      setNovoProduto({
                        ...novoProduto,
                        descricao: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="form-row-produtos-adm-quatro">
                  <label>Descrição de para que serve:</label>
                  <textarea
                    rows="3"
                    value={novoProduto.paraQueServe}
                    onChange={(e) =>
                      setNovoProduto({
                        ...novoProduto,
                        paraQueServe: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <div className="modal-buttons-produto-adm">
                  <button type="submit" className="btn-confirmar">
                    {editIndex !== null ? "Salvar Alterações" : "Confirmar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
