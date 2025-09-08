import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from './CartContext'; // Importa o contexto do arquivo separado

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart).map(item => ({ 
      ...item, 
      cartItemId: item.cartItemId || Date.now() + Math.random(),
      isSelected: false 
    })) : [];
  });

  const [selectAll, setSelectAll] = useState(false);

  // Funções devem ser declaradas antes dos effects que as usam
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

  const addToCart = (item) => {
    const newItem = {
      ...item,
      cartItemId: Date.now() + Math.random(), // ID único
      isSelected: false
    };
    setCartItems(prevItems => [...prevItems, newItem]);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  // Effect para sincronizar selectAll
  useEffect(() => {
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.isSelected);
    setSelectAll(allSelected);
  }, [cartItems]);

  // Effect para salvar no localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

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

// Exporte também como padrão se preferir
export default CartProvider;