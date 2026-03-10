import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import './Home.css';

const PLACEHOLDER_PRODUCTS = [
  {
    id: 1,
    title: "Apple MacBook Pro M2 14-inch (2023) - Silver",
    description: "Barely used MacBook Pro. Perfect for coding and design work.",
    price: 95000,
    condition: "USED",
    category: { name: "Electronics" },
    seller: { name: "Aditya S." },
    images: [{ url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    description: "Brand new, sealed in box. Won it in a hackathon.",
    price: 24000,
    condition: "NEW",
    category: { name: "Electronics" },
    seller: { name: "Priya M." },
    images: [{ url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  },
  {
    id: 3,
    title: "Introduction to Algorithms, 4th Edition (CLRS)",
    description: "Standard textbook for Data Structures. Good condition.",
    price: 850,
    condition: "USED",
    category: { name: "Books" },
    seller: { name: "Rahul V." },
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  },
  {
    id: 4,
    title: "Ergonomic Office Chair - Mesh Back",
    description: "Selling because I am moving out of the hostel. Very comfortable.",
    price: 3200,
    condition: "USED",
    category: { name: "Furniture" },
    seller: { name: "Sneha K." },
    images: [{ url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }]
  }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products, using placeholders', error);
        setProducts(PLACEHOLDER_PRODUCTS);
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
