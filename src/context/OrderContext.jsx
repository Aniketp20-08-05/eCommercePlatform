import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const placeOrder = async (cartItems, total) => {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const token = localStorage.getItem('urbanbazaar_token');
    
    try {
      const res = await axios.post('http://localhost:5002/api/orders', {
        orderId,
        items: cartItems,
        total
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setOrders([res.data, ...orders]);
      return orderId;
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
  };

  const getOrder = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:5002/api/orders/${orderId}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching order:', err);
      return null;
    }
  };

  const getUserOrders = async () => {
    const token = localStorage.getItem('urbanbazaar_token');
    if (!token) return [];
    try {
      const res = await axios.get('http://localhost:5002/api/orders/user/all', {
        headers: { 'x-auth-token': token }
      });
      return res.data;
    } catch (err) {
      console.error('Error fetching user orders:', err);
      return [];
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder, getUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
