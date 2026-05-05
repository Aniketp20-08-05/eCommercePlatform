import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShoppingBag, Truck, LogOut, User, Search, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const count = getCartCount();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          <ShoppingBag size={28} />
          UrbanBazaar
        </Link>
        
        <form onSubmit={handleSearch} style={{ position: 'relative', flex: '0 1 400px', margin: '0 2rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search products..." 
            style={{ paddingLeft: '2.75rem', borderRadius: '999px', background: 'var(--secondary)', border: 'none' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            fontSize: '0.875rem', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Home size={20} />
            Home
          </Link>

          <Link to="/track" style={{ 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            fontSize: '0.875rem', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Truck size={20} />
            Track Order
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                <User size={18} />
                {user.name}
              </div>
              <button 
                onClick={logout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--danger)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ 
              color: 'var(--primary)', 
              textDecoration: 'none', 
              fontSize: '0.875rem', 
              fontWeight: 600,
              padding: '0.5rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: '0.75rem'
            }}>
              Login
            </Link>
          )}
          
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={24} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};
