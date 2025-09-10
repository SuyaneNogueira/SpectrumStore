import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    
        const addToCart = (product) => {
            // Encontra se o item já existe
            const existingItem = cartItems.find(item => 
                item.id === product.id && 
                JSON.stringify(item.personalizacoes) === JSON.stringify(product.personalizacoes)
            );
    
            if (existingItem) {
                // Se o item já existe, atualiza a quantidade
                setCartItems(prevItems => 
                    prevItems.map(item =>
                        item.cartItemId === existingItem.cartItemId 
                            ? { ...item, quantidade: item.quantidade + product.quantidade, isSelected: true }
                            : item
                    )
                );
            } else {
                // Se não, adiciona como um novo item
                const newItem = {
                    ...product,
                    cartItemId: Date.now(),
                    isSelected: true,
                };
                setCartItems(prevItems => [...prevItems, newItem]);
            }
        };
    
        const updateQuantity = (cartItemId, newQuantity) => {
            setCartItems(prevItems => 
                prevItems.map(item =>
                    item.cartItemId === cartItemId 
                        ? { ...item, quantidade: newQuantity } 
                        : item
                )
            );
        };
    
        const removeFromCart = (cartItemId) => {
            setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
        };
    
        const toggleItem = (cartItemId) => {
            setCartItems(prevItems => 
                prevItems.map(item =>
                    item.cartItemId === cartItemId 
                        ? { ...item, isSelected: !item.isSelected } 
                        : item
                )
            );
        };
    
        const toggleAllItems = (select) => {
            setCartItems(prevItems => 
                prevItems.map(item => ({ ...item, isSelected: select }))
            );
        };
        
        // Calcula o total com base na quantidade
        const totalSelected = cartItems.reduce((total, item) => {
            if (item.isSelected) {
                return total + (item.price * (item.quantidade || 1));
            }
            return total;
        }, 0);
    
        const selectAll = cartItems.length > 0 && cartItems.every(item => item.isSelected);

        const value = {
            cartItems, 
            addToCart, 
            removeFromCart,
            updateQuantity,
            toggleItem,
            toggleAllItems,
            selectAll,
            totalSelected
        }
        return (
            <CartContext.Provider value={value}>
              {children}
            </CartContext.Provider>
          );
        };
        
export const useCart = () => useContext(CartContext);

