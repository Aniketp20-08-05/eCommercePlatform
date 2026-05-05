import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft, LogIn } from 'lucide-react';

export const TrackOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrder, getUserOrders } = useOrders();
  const { user, loading: authLoading } = useAuth();
  
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchUserOrders();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      handleTrack(id);
    } else {
      setCurrentOrder(null);
    }
  }, [location.search]);

  const fetchUserOrders = async () => {
    setLoading(true);
    const orders = await getUserOrders();
    setUserOrders(orders);
    setLoading(false);
  };

  const handleTrack = async (id) => {
    setLoading(true);
    const order = await getOrder(id);
    if (order) {
      setCurrentOrder(order);
    }
    setLoading(false);
  };

  const steps = [
    { label: 'Order Placed', status: 'Processing', icon: Clock, date: 'May 04, 2026' },
    { label: 'Shipped', status: 'Shipped', icon: Package, date: 'May 05, 2026' },
    { label: 'Out for Delivery', status: 'Out for Delivery', icon: Truck, date: 'May 06, 2026' },
    { label: 'Delivered', status: 'Delivered', icon: CheckCircle, date: 'May 07, 2026' }
  ];

  const getStepStatus = (stepStatus) => {
    const statusOrder = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIdx = statusOrder.indexOf(currentOrder.status);
    const stepIdx = statusOrder.indexOf(stepStatus);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <LogIn size={40} />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Please login to track your orders</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            You need to be signed in to view your order history and tracking details.
          </p>
          <Link to="/login" className="btn btn-primary">Login Now</Link>
        </div>
      </div>
    );
  }

  if (currentOrder) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => navigate('/track')} 
            className="btn btn-outline" 
            style={{ marginBottom: '2rem', border: 'none', padding: '0', color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={18} /> Back to My Orders
          </button>

          <div style={{ 
            background: 'var(--surface)', 
            borderRadius: '1.5rem', 
            border: '1px solid var(--border)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Order Number</p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentOrder.orderId}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Expected Delivery</p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>May 07, 2026</h2>
              </div>
            </div>

            <div className="timeline">
              {steps.map((step, index) => {
                const status = getStepStatus(step.status);
                const Icon = step.icon;
                return (
                  <div key={index} className={`timeline-step ${status}`}>
                    <div className="timeline-icon">
                      <Icon size={20} />
                    </div>
                    <div className="timeline-content">
                      <h3>{step.label}</h3>
                      <p>{step.date}</p>
                    </div>
                    {index < steps.length - 1 && <div className="timeline-line"></div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <MapPin size={20} color="var(--primary)" />
                <h4 style={{ fontWeight: 700 }}>Shipping Address</h4>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                123 Business Avenue<br />
                Suite 405<br />
                San Francisco, CA 94107
              </p>
            </div>
            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Package size={20} color="var(--primary)" />
                <h4 style={{ fontWeight: 700 }}>Order Summary</h4>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                {currentOrder.items.length} Items<br />
                Total: ${currentOrder.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>My Orders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View and track your recent purchases.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</div>
        ) : userOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package size={40} />
            </div>
            <h2 style={{ marginBottom: '1rem' }}>No orders yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Once you place an order, it will appear here for you to track.
            </p>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {userOrders.map(order => (
              <div key={order._id} style={{ 
                background: 'var(--surface)', 
                borderRadius: '1.5rem', 
                border: '1px solid var(--border)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ background: 'var(--secondary)', width: '64px', height: '64px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={24} color="var(--text-secondary)" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>{order.orderId}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(order.date).toLocaleDateString()} • {order.items.length} items • ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span className={`badge ${order.status === 'Delivered' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                    {order.status}
                  </span>
                  <button 
                    onClick={() => navigate(`/track?id=${order.orderId}`)} 
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem' }}
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
