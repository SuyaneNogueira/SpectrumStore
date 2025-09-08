// src/components/CarrinhoP1/CartContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Carregar itens do localStorage ao iniciar
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart).map(item => ({ ...item, isSelected: false })) : [];
  });

  // Estado para controlar a seleção geral
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Salvar itens no localStorage sempre que cartItems mudar
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // Adicione a propriedade isSelected: false por padrão
    setCartItems(prevItems => [...prevItems, { ...item, isSelected: false }]);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const toggleAllItems = (checked) => {
    setCartItems(prevItems => prevItems.map(item => ({ ...item, isSelected: checked })));
  };

  const toggleItem = (cartItemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  useEffect(() => {
    // ESTA É A NOVA LÓGICA
    // Verifica se todos os itens estão selecionados para atualizar a checkbox "Comprar tudo"
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.isSelected);
    setSelectAll(allSelected);
  }, [cartItems]); // O useEffect é executado sempre que 'cartItems' muda

  const selectedItems = cartItems.filter(item => item.isSelected);

  const totalSelected = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        toggleAllItems,
        toggleItem,
        selectAll,
        totalSelected,
        selectedItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};