import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import Button from '../common/Button';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'vendor': return '/vendor/dashboard';
      case 'delivery': return '/delivery/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/profile';
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <span className="logo-icon">🍔</span>
            <span className="logo-text">Foodie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/restaurants" className="nav-link">Restaurants</Link>
            {isAuthenticated && user?.role === 'customer' && (
              <Link to="/orders" className="nav-link">My Orders</Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <Link to="/cart" className="cart-button">
                    <FaShoppingCart />
                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                  </Link>
                )}
                
                <Link to={getDashboardLink()} className="icon-button desktop-only">
                  {user?.role === 'customer' ? <FaUser /> : <FaTachometerAlt />}
                </Link>

                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<FaSignOutAlt />}
                  onClick={handleLogout}
                  className="desktop-only"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="desktop-only"
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="desktop-only"
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu slide-down">
            <Link to="/restaurants" className="mobile-menu-link" onClick={closeMobileMenu}>
              Restaurants
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="mobile-menu-link" onClick={closeMobileMenu}>
                  {user?.role === 'customer' ? 'Profile' : 'Dashboard'}
                </Link>
                {user?.role === 'customer' && (
                  <>
                    <Link to="/orders" className="mobile-menu-link" onClick={closeMobileMenu}>
                      My Orders
                    </Link>
                    <Link to="/cart" className="mobile-menu-link" onClick={closeMobileMenu}>
                      Cart {itemCount > 0 && `(${itemCount})`}
                    </Link>
                  </>
                )}
                <button className="mobile-menu-link" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu-link" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="mobile-menu-link" onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
