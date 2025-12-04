import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🍔</span>
              <span className="logo-text">Foodie</span>
            </div>
            <p className="footer-description">
              Your favorite food, delivered fast. Order from the best restaurants in your area.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/press">Press Kit</Link></li>
            </ul>
          </div>

          {/* For Partners */}
          <div className="footer-section">
            <h4 className="footer-title">For Partners</h4>
            <ul className="footer-links">
              <li><Link to="/register?role=vendor">Partner with Us</Link></li>
              <li><Link to="/register?role=delivery">Become a Delivery Partner</Link></li>
              <li><Link to="/vendor/dashboard">Restaurant Dashboard</Link></li>
              <li><Link to="/delivery/dashboard">Delivery Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} Foodie. All rights reserved.
          </p>
          <p className="developed-by">
            Developed for Hackathon T18
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
