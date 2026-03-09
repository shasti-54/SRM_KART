import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import './Cart.css';

export default function Cart() {
  const { items, removeFromCart, cartTotal, cartItemCount } = useCart();
  const navigate = useNavigate();

  if (!items || items.length === 0) {
    return (
      <div className="cart-page container animate-fade-in">
        <div className="empty-cart-state glass-panel">
          <ShoppingBag size={64} className="text-muted" style={{ marginBottom: '1.5rem' }} />
          <h2>Your cart is empty</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="page-title">Shopping Cart ({cartItemCount} items)</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item glass-panel">
              <div className="cart-item-image">
                <img 
                  src={item.product.images?.length > 0 ? item.product.images[0].url : 'https://via.placeholder.com/150'} 
                  alt={item.product.title} 
                />
              </div>
              <div className="cart-item-details">
                <Link to={`/product/${item.product.id}`} className="cart-item-title">{item.product.title}</Link>
                <div className="cart-item-price">₹{item.product.price}</div>
                <div className="cart-item-quantity text-muted">Qty: {item.quantity}</div>
              </div>
              <button 
                className="btn btn-icon remove-btn" 
                onClick={() => removeFromCart(item.product.id)}
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary glass-panel">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee</span>
            <span>₹0.00</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary full-width" onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
