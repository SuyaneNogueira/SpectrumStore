import "./Pedidos.css";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Pedidos() {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    fetch("http://localhost:3001/api/pedido")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Falha ao buscar pedidos. O 'CarrinhoBackT.js' está rodando?"
          );
        }
        return res.json();
      })
      .then((data) => {
        setPedidos(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // O array vazio [] faz isso rodar só 1 vez
  // 👆👆👆 FIM DO BLOCO 👆👆👆

  // 👇👇👇 4. FUNÇÃO DE AÇÃO (O "DISPARADOR" ⚙️) 👇👇👇
  const handleLiberarPedido = async (pedido) => {
   
    const ordemDePedido = pedido.id; // Ex: 290

    if (
      !window.confirm(
        `Tem certeza que deseja liberar o pedido #${ordemDePedido} para a expedição da máquina?`
      )
    ) {
      return;
    }

    try {
      // Chama a NOSSA rota "proxy" (o "Garçom" no adminRoutes.js)
      const res = await fetch(
        `http://localhost:3001/api/maquina/expedicao/liberar/${ordemDePedido}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(
          erroData.error || "A máquina (API) recusou a liberação."
        );
      }

      alert(`Pedido #${ordemDePedido} liberado com sucesso para a máquina!`);

      // Atualiza o status na tela (Frontend)
      setPedidos(
        pedidos.map((p) =>
          p.id === pedido.id ? { ...p, status: "Despacho" } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert(`Erro ao liberar pedido: ${err.message}`);
    }
  };

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
              onClick={() => navigate("/PerfilAdm")}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="area-dos-pedidos-adm">
        <div className="titulo-dois-pedidos-adm">
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">
              Todos os Pedidos
            </Link>{" "}
          </div>
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">
              Processo
            </Link>{" "}
          </div>
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">
              Despacho
            </Link>{" "}
          </div>
          <div>
            {" "}
            <Link className="link-adm-pedidos" to="">
              Completo
            </Link>{" "}
          </div>
        </div>

        <div className="area-processos-pedidos-adm">
          <div className="status-pedidos-adm-um">
            <div className="adm-modal-sete" style={{ position: "relative" }}>
              {/* Botão */}
              <button
                className="button-adm-modal"
                onClick={() => setOpenPopup(!openPopup)}
              >
                {">"}
              </button>

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
          <div className="pedidos-lista-container-adm">
            {loading && <p>Carregando pedidos...</p>}
            {error && <p className="erro-pedidos-adm">{error}</p>}

            {!loading && !error && pedidos.map(pedido => (
              // Esta é a linha de dados, ela imita a sua classe de cabeçalho
              <div key={pedido.id} className="status-pedidos-adm-item">
                {/* 1. ID */}
                <div>
                  <p>#{pedido.id}</p>
                </div>
                {/* 2. Nome */}
                <div>
                  <p>{pedido.nome || 'N/A'}</p>
                </div>
                {/* 3. Endereço */}
                <div>
                  <p>{pedido.endereco || 'N/A'}</p>
                </div>
                {/* 4. Data */}
                <div>
                  <p>{new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</p>
                </div>
                {/* 5. Preço */}
                <div>
                  <p>R$ {Number(pedido.total).toFixed(2)}</p>
                </div>
                {/* 6. Status */}
                <div>
                  <span className={`status-bubble status-${pedido.status?.toLowerCase()}`}>
                    {pedido.status}
                  </span>
                </div>
                {/* 7. Ação */}
                <div>
                  <button 
                    className="acao-btn-adm"
                    onClick={() => handleLiberarPedido(pedido)}
                  >
                    ⚙️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
