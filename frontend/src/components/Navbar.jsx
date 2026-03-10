import { Link } from 'react-router-dom'
import { ShoppingCart, User, Search, Store, LogOut, Package } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content">
        <Link to="/" className="brand">
          <Store className="brand-icon" />
          <span>SRM KART</span>
        </Link>
        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <button><Search size={18} /></button>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="nav-link" style={{cursor: 'default'}}>
                <User size={20} />
                <span>{user.name || user.username || 'User'}</span>
              </span>
              <Link to="/orders" className="nav-link">
                <Package size={20} />
                <span>Orders</span>
              </Link>
              <button onClick={logout} className="nav-link btn-secondary" style={{ padding: '0.4rem 0.8rem', border: 'none', background: 'transparent' }}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
          <Link to="/cart" className="nav-link cart-link">
            <ShoppingCart size={20} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  )
}
