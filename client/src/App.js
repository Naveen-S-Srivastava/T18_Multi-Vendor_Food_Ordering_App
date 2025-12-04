import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurant from './pages/Restaurant';
import DashboardPage from './pages/dashboard';
import './App.css';
import './styles/globals.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/restaurant/:id" element={<Restaurant user={user} />} />
            <Route path="*" element={<div className="not-found">Page not found</div>} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2024 FoodHub. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
