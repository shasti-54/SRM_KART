import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import './Checkout.css';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!items || items.length === 0) {
    if (orderSuccess) {
      return (
        <div className="checkout-page container animate-fade-in">
          <div className="success-state glass-panel">
            <CheckCircle size={80} className="success-icon" />
            <h2>Order Placed Successfully!</h2>
            <p className="text-muted">Thank you for your purchase. Your order is being processed.</p>
            <Link to="/" className="btn btn-primary mt-4">Continue Shopping</Link>
          </div>
        </div>
      );
    }
    
    return (
      <div className="checkout-page container animate-fade-in">
        <div className="empty-state glass-panel">
          <h2>Your cart is empty</h2>
          <p className="text-muted">Add some items to your cart before proceeding to checkout.</p>
          <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Shipping address is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      await axios.post('http://localhost:8080/api/orders', {
        shippingAddress: address,
        items: orderItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await clearCart();
      setOrderSuccess(true);
    } catch (err) {
      console.error('Failed to place order:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container animate-fade-in">
      <h1 className="page-title">Checkout</h1>
      
      <div className="checkout-layout">
        <div className="checkout-form-section glass-panel">
          <h2>Shipping Information</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label htmlFor="address">Full Delivery Address</label>
              <textarea 
                id="address" 
                className="form-control"
                placeholder="Enter your complete street address, city, state, and zip code"
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="payment-simulation mt-6">
              <h3>Payment Method</h3>
              <div className="payment-card-mockup">
                <div className="payment-options">
                  <div className="payment-option selected">
                    <CreditCard size={20} />
                    <span>Credit / Debit Card</span>
                    <div className="radio-indicator"></div>
                  </div>
                </div>
                <p className="text-muted text-sm mt-3 pt-3 border-t border-glass">
                  * This is a simulated checkout. No real payment will be processed.
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary full-width submit-order mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
          
          <div className="trust-badges mt-6 pt-6 border-t border-glass flex flex-wrap gap-4">
             <div className="badge flex items-center gap-2 text-muted text-sm">
                <ShieldCheck size={18} /> Secure Checkout
             </div>
             <div className="badge flex items-center gap-2 text-muted text-sm">
                <Truck size={18} /> Fast Delivery
             </div>
          </div>
        </div>

        <div className="checkout-summary glass-panel">
          <h2>Order Summary</h2>
          <div className="summary-items mt-4">
            {items.map(item => (
              <div key={item.product.id} className="summary-item flex justify-between items-center pb-3 mb-3 border-b border-glass">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.product.images?.length > 0 ? item.product.images[0].url : 'https://via.placeholder.com/64'} 
                    alt={item.product.title} 
                    className="item-thumbnail"
                  />
                  <div>
                    <h4 className="item-title text-sm">{item.product.title}</h4>
                    <p className="text-muted text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="item-price font-medium">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals mt-4">
            <div className="flex justify-between pb-2 text-muted">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pb-2 text-muted">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between pt-3 mt-2 border-t border-glass text-lg font-bold">
              <span>Total</span>
              <span className="text-accent">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
