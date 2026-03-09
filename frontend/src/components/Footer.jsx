import './Footer.css'
import { Store, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer relative z-10">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="brand-logo">
            <Store className="brand-icon" />
            <span>SRM KART</span>
          </div>
          <p className="text-muted">Your premier campus marketplace for buying and selling student essentials.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/categories">Categories</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#"><Github size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SRM KART. All rights reserved.</p>
      </div>
    </footer>
  )
}
