import React from "react";
import "./CarrinhoP1.css";
import Navbar from "../Navbar/Navbar";
import StarRating from "../TelaInicial/StarRating";
import { useCart } from "./CartContext";
import TrashIcon from "../imagens/trash-icon.png";
import { Link } from "react-router-dom";

function CarrnhoP1() {
  const {
    cartItems,
    removeFromCart,
    toggleAllItems,
    toggleItem,
    selectAll,
    totalSelected,
    updateQuantity,
  } = useCart();

  return (
    <div className="fundoCarrinho">
      <Navbar />
      <div className="sssssss">
        <div className="CoisaBrancaCarrinho">
          <div className="Comprar-tudo">
            <div className="content">
              <label className="checkBox">
                <input
                  id="ch-tudo"
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => toggleAllItems(e.target.checked)}
                />
                <div className="transition" />
              </label>
            </div>
            <span className="comprar-tudo-div">Comprar tudo</span>
          </div>

          <div className="lista-produtos-scroll">
            {cartItems &&
              cartItems.map((item, index) => (
                <div className="Card1" key={item.cartItemId || `item-${index}`}>
                  <div className="div-checkbox-e-imagem">
                    <div className="content">
                      <label className="checkBox">
                        <input
                          id={`ch-${item.cartItemId}`}
                          type="checkbox"
                          checked={item.isSelected}
                          onChange={() => toggleItem(item.cartItemId)}
                        />
                        <div className="transition" />
                      </label>
                    </div>

                    <div className="div-imagem-produto-carrinho">
                      <div className="imagem-carrinho-logo">
                        <img
                          className="imagem-mesmo-produtos-carrinho"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                    </div>

                    <div className="Descrição-estrela">
                      <div className="descrição">
                        <div className="nome-avaliacao">
                          <p className="nome-produto">{item.name}</p>
                          <div className="avaliacao-produto">
                            <StarRating rating={item.rating} />
                            {/* <span className='quantidade-avaliacoes'>({item.reviewCount || 0})</span> */}
                          </div>
                        </div>

                       {item.customizations &&
                       Object.entries(item.customizations).length > 0 && (
                         <div className="personalizacoes-carrinho">
                           {Object.entries(item.customizations).map(
                                ([key, value]) => {
                                  // Se for array, mostra todos os valores
                                  const valores = Array.isArray(value)
                                    ? value
                                    : [value];

                                  return (
                                    <div
                                      key={key}
                                      className="personalizacao-item-carrinho"
                                    >
                                      <span className="personalizacao-chave">
                                        {key.charAt(0).toUpperCase() +
                                          key.slice(1)}
                                        :
                                      </span>

                                      {valores.map((val, idx) => {
                                        if (
                                          typeof val === "object" &&
                                          val !== null
                                        ) {
                                          val = JSON.stringify(val);
                                        }

                                        const texto = String(val);

                                        if (
                                          key.toLowerCase().includes("cor") ||
                                          key.toLowerCase().includes("color")
                                        ) {
                                          return (
                                            <div
                                              key={idx}
                                              className="cor-carrinho"
                                              style={{
                                                backgroundColor: texto
                                                  .toLowerCase()
                                                  .normalize("NFD")
                                                  .replace(
                                                    /[\u0300-\u036f]/g,
                                                    ""
                                                  ),
                                              }}
                                              title={texto}
                                            />
                                          );
                                        } else {
                                          return (
                                            <span
                                              key={idx}
                                              className="personalizacao-valor"
                                            >
                                              {texto}
                                            </span>
                                          );
                                        }
                                      })}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                      </div>

                      <div className="div-valor-brinquedo-carrinho">
                        <span className="cor-amarelo-preco-2">R$:</span>{" "}
                        {(item.price * (item.quantidade || 1)).toFixed(2)}
                      </div>
                    </div>

                    <div className="div-quantidade-e-lixeira">
                      <div className="seletor-quantidade">
                        {item.quantidade === 1 ? (
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="trash-button"
                          >
                            <img
                              src={TrashIcon}
                              alt="Remover"
                              className="trash-icon"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                Math.max(1, (item.quantidade || 1) - 1)
                              )
                            }
                          >
                            -
                          </button>
                        )}
                        <input
                          type="number"
                          value={item.quantidade || 1}
                          readOnly
                          min="1"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.cartItemId,
                              (item.quantidade || 1) + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="div-button-carrinho">
            <div className="div-total">Total: R${totalSelected.toFixed(2)}</div>
            <div>
              <Link
                to="/pagamento"
                onClick={() => {
                  const itensSelecionados = cartItems.filter(
                    (item) => item.isSelected
                  );
                  localStorage.setItem(
                    "itensPagamento",
                    JSON.stringify(itensSelecionados)
                  );
                }}
              >
                <button>Comprar itens</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarrnhoP1;
