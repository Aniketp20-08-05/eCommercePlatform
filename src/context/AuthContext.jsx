import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('urbanbazaar_token');
    if (token) {
      verifyUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyUser = async (token) => {
    try {
      const res = await axios.get('http://localhost:5002/api/auth/user', {
        headers: { 'x-auth-token': token }
      });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('urbanbazaar_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5002/api/auth/register', { name, email, password });
    localStorage.setItem('urbanbazaar_token', res.data.token);
    await verifyUser(res.data.token);
  };

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5002/api/auth/login', { email, password });
    localStorage.setItem('urbanbazaar_token', res.data.token);
    await verifyUser(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem('urbanbazaar_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
