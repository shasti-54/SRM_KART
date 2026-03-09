import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">Your Campus Marketplace</h1>
          <p className="hero-subtitle">Discover textbooks, electronics, and essentials sold by your peers.</p>
          <div className="hero-search glass-panel">
             <Search size={20} className="text-muted" />
             <input type="text" placeholder="Search for anything..." />
             <button className="btn btn-primary" style={{borderRadius: 'var(--radius-full)'}}>Search</button>
          </div>
        </div>
      </section>

      <section className="container products-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <div className="filter-tabs">
            <button className="tab active">All</button>
            <button className="tab">Electronics</button>
            <button className="tab">Books</button>
            <button className="tab">Furniture</button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div className="empty-state">
                <p>No products found yet.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
