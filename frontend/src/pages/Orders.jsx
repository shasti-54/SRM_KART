import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, Clock, ShoppingBag } from 'lucide-react';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="orders-page container flex justify-center items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page container animate-fade-in">
        <h1 className="page-title">My Orders</h1>
        <div className="empty-state glass-panel text-center">
          <Package size={64} className="text-muted mx-auto" style={{ marginBottom: '1.5rem' }} />
          <h2>No orders yet</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>You haven't placed any orders.</p>
          <Link to="/" className="btn btn-primary inline-flex">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page container animate-fade-in">
      <h1 className="page-title">My Orders ({orders.length})</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card glass-panel mb-6 p-6">
            <div className="order-header flex justify-between items-center border-b border-glass pb-4 mb-4">
              <div>
                <p className="text-sm text-muted mb-1">Order #{order.id}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} /> 
                  <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-accent">₹{order.totalAmount.toFixed(2)}</p>
                <span className={`order-status badge ${order.status?.toLowerCase() || 'pending'}`}>
                  {order.status || 'PROCESSING'}
                </span>
              </div>
            </div>
            
            <div className="order-items-preview">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ShoppingBag size={16} /> Items Output
              </h4>
              <div className="items-grid">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-mini flex items-center gap-3">
                    <img 
                      src={item.product?.images?.length > 0 ? item.product.images[0].url : 'https://via.placeholder.com/64'} 
                      alt={item.product?.title || 'Product'} 
                      className="mini-thumbnail"
                    />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{item.product?.title || 'Unknown Product'}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-footer mt-4 pt-4 border-t border-glass text-sm text-muted">
              <strong>Delivering to:</strong> {order.shippingAddress}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
