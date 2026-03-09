import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="product-card glass-panel">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <img src={imageUrl} alt={product.title} className="product-image" />
        {product.condition && (
          <span className="product-badge condition-badge">{product.condition}</span>
        )}
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category?.name || 'General Item'}</div>
        <Link to={`/product/${product.id}`} className="product-title-link">
          <h3 className="product-title" title={product.title}>{product.title}</h3>
        </Link>
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button className="btn btn-primary add-to-cart-btn" aria-label="Add to cart">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
