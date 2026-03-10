import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const PLACEHOLDER_PRODUCTS = [
  {
    id: 1,
    title: "Apple MacBook Pro M2 14-inch (2023) - Silver",
    description: "Barely used MacBook Pro. Perfect for coding and design work.\n\nSpecs:\n- Apple M2 Pro chip\n- 16GB Unified Memory\n- 512GB SSD Storage\n- 14-inch Liquid Retina XDR display",
    price: 95000,
    condition: "USED",
    category: { name: "Electronics" },
    seller: { name: "Aditya S." },
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    description: "Brand new, sealed in box. Won it in a hackathon.\n\nIndustry-leading noise cancellation with multiple microphones. Up to 30-hour battery life with quick charging.",
    price: 24000,
    condition: "NEW",
    category: { name: "Electronics" },
    seller: { name: "Priya M." },
    images: [{ url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  },
  {
    id: 3,
    title: "Introduction to Algorithms, 4th Edition (CLRS)",
    description: "Standard textbook for Data Structures. Good condition. No highlights or markings inside the book.",
    price: 850,
    condition: "USED",
    category: { name: "Books" },
    seller: { name: "Rahul V." },
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  },
  {
    id: 4,
    title: "Ergonomic Office Chair - Mesh Back",
    description: "Selling because I am moving out of the hostel. Very comfortable for long hours of study or gaming.\n\nFeatures adjustable lumbar support and armrests.",
    price: 3200,
    condition: "USED",
    category: { name: "Furniture" },
    seller: { name: "Sneha K." },
    images: [{ url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  }
];

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
        console.error('Error fetching product details, looking in placeholders', error);
        const placeholder = PLACEHOLDER_PRODUCTS.find(p => p.id === parseInt(id));
        setProduct(placeholder || null);
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
