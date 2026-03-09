import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading-state" style={{marginTop:'5rem'}}><div className="spinner"></div></div>;
  if (!product) return <div className="empty-state" style={{marginTop:'5rem'}}>Product not found.</div>;

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/600x400?text=No+Image';

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first to add items to the cart.");
      return;
    }
    setAdding(true);
    const success = await addToCart(product.id, 1);
    setAdding(false);
    if (success) {
      alert("Added to cart!");
    } else {
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="product-details-page container animate-fade-in">
      <Link to="/" className="back-link">
        <ArrowLeft size={20} />
        <span>Back to Marketplace</span>
      </Link>
      
      <div className="product-details-grid glass-panel">
        <div className="product-image-container">
          <img src={imageUrl} alt={product.title} className="details-image" />
          {product.condition && (
             <span className="product-badge" style={{position:'absolute', top:'1rem', left:'1rem', background:'var(--bg-card)', padding:'0.25rem 0.75rem', borderRadius:'var(--radius-full)', fontWeight:'600'}}>{product.condition}</span>
          )}
        </div>
        
        <div className="product-info-container">
          <div className="category-tag">{product.category?.name || 'General Item'}</div>
          <h1 className="details-title">{product.title}</h1>
          <div className="details-price">₹{product.price}</div>
          
          <div className="details-seller text-muted">
             Sold by: <span className="seller-name">{product.seller?.name || 'Unknown User'}</span>
          </div>

          <div className="details-description">
            <h3><Info size={18} /> Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="details-actions">
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={adding} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
              <ShoppingCart size={20} />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
