import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const total = getCartTotal();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const orderId = await placeOrder(cart, total);
    clearCart();
    navigate(`/track?id=${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="container cart-page">
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 800 }}>Shopping Cart</h1>
      
      <div className="cart-grid">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.name}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="cart-item-actions">
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h2>
          
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
            <span style={{ fontWeight: 600 }}>Calculated at checkout</span>
          </div>
          
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
          
          <Link to="/" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
