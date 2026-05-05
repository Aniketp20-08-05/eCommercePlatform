import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('urbanbazaar_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('urbanbazaar_cart', JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      saveCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      saveCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    const existing = cart.find(item => item.id === productId);
    if (!existing) return;
    
    if (existing.quantity + change <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + change } : item
      ));
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};
