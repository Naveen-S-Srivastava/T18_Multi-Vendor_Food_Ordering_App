import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🍕 FoodHub</h1>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <span className="user-name">Hello, {user.name}</span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
